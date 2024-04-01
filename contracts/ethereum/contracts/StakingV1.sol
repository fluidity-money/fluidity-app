// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

/*
 * Fluidity Money takes security seriously.
 *
 * If you find anything, or there's anything you think we should know, contact us
 * immediately with https://docs.fluidity.money/docs/security/contactable-team .
 *
 * If you find something urgent, and you think funds are immediately at risk, we encourage
 * you to exploit the vulnerability if there is no other choice and to move the funds into
 * one of our our dropboxes at https://docs.fluidity.money/docs/security/dropboxes .
 *
 * At the time of writing, the Arbtirum dropbox is
 * 0xfA763219492AE371b35c524655D8972F2D2AF197. Assets moved here will set off alarm bells.
 */

pragma solidity 0.8.16;
pragma abicoder v2;

import "./openzeppelin/SafeERC20.sol";

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IERC20ERC2612.sol";

uint8 constant STAKING_DECIMALS = 1;

string constant STAKING_NAME = "Staked FLY";

string constant STAKING_SYMBOL = "sFLY";

uint256 constant UNBONDING_PERIOD = 7 days;

uint constant MAX_STAKING_POSITIONS = 100;

struct StakedPrivate {
    // receivedBonus for the day 1 staking?
    bool receivedBonus;

    // flyVested supplied by users.
    uint256 flyVested;

    // depositTimestamp when the staking was completed.
    uint256 depositTimestamp;
}

struct UnstakingPrivate {
    // flyAmount that was staked originally.
    uint256 flyAmount;

    // unstakedTimestamp to use as the final timestamp that the amount is
    // fully unstaked by (ie, 7 days + the future timestamp when unstaking happens)
    uint256 unstakedTimestamp;
}

contract StakingV1 is IStaking, IERC20, IEmergencyMode, IOperatorOwned {
    using SafeERC20 for IERC20ERC2612;

    event NewMerkleDistributor(address old, address _new);

    /* ~~~~~~~~~~ HOUSEKEEPING ~~~~~~~~~~ */

    /// @dev if false, emergency mode is active - can be called by either the
    ///      operator or emergency council
    bool private noEmergencyMode_;

    // for migrations
    uint private version_;

    /* ~~~~~~~~~~ OWNERSHIP ~~~~~~~~~~ */

    /// @dev emergency council that can activate emergency mode
    address private emergencyCouncil_;

    /// @dev account to use that created the contract (multisig account)
    address private operator_;

    /* ~~~~~~~~~~ GLOBAL STORAGE ~~~~~~~~~~ */

    IERC20ERC2612 private flyToken_;

    address private merkleDistributor_;

    // used for future upgrades
    // solhint-disable-next-line var-name-mixedcase
    uint256[64] private __bookmark_1;

    /* ~~~~~~~~~~ USER STORAGE ~~~~~~~~~~ */

    /// @dev stakedStorage_ per user with their staked accounts in each item.
    mapping(address => StakedPrivate[]) private stakedStorage_;

    /// @dev unstakingStorage_ amounts that are waiting to be collected
    /// in the future from being unstaked.
    mapping(address => UnstakingPrivate[]) private unstakingStorage_;

    /* ~~~~~~~~~~ SETUP FUNCTIONS ~~~~~~~~~~ */

    /**
     * @notice init the contract, setting up the ownership, and the location of the
     *         MerkleDistributor contract.
     *
     * @param _flyToken to take for staking from the user.
     * @param _merkleDistributor to support for the stakeFor function.
     * @param _emergencyCouncil to give the power to freeze the contract.
     * @param _operator to use as the special privilege for retroactively awarding/admin power.
     */
    function init(
        IERC20ERC2612 _flyToken,
        address _merkleDistributor,
        address _emergencyCouncil,
        address _operator
    ) public {
        require(version_ == 0, "contract is already initialised");

        version_ = 1;
        noEmergencyMode_ = true;

        emergencyCouncil_ = _emergencyCouncil;
        operator_ = _operator;

        flyToken_ = _flyToken;
        merkleDistributor_ = _merkleDistributor;

        emit NewMerkleDistributor(address(0), merkleDistributor_);
    }

    /* ~~~~~~~~~~ INTERNAL FUNCTIONS ~~~~~~~~~~ */

    function _calcDay1Points(uint256 _flyAmount) internal pure returns (uint256 points) {
        return (_flyAmount * 4 * 7 days) / 1e6;
    }

    function calculatePoints(uint256 curTimestamp, StakedPrivate memory _staked) public pure returns (uint256 points) {
        /*
         * Calculate the points earned by the user, using the math:

a = x * (seconds_since_start * 0.000001)
if day_1_staked_bonus: a += fly_staked * 0.000001 * (24*7*60*60)
return a

        */

        points = _staked.flyVested * ((curTimestamp - _staked.depositTimestamp) / 1e6);
        if (_staked.receivedBonus) points += _calcDay1Points(_staked.flyVested);
    }

    /**
     * @notice calculatePointsAddSecs external helper function to get an idea of points earned for staking.
     * @param _seconds to add to the staked struct passed as an argument.
     * @param _staked to use as the staked structure.
     */
    function calculatePointsAddSecs(uint256 _seconds, StakedPrivate memory _staked) external pure returns (uint256 points) {
        return calculatePoints(_staked.depositTimestamp + _seconds, _staked);
    }

    function _stake(
        address _spender,
        address _recipient,
        uint256 _flyAmount,
        bool _claimAndStakeBonus
    ) internal returns (uint256 _flyStaked) {
        require(noEmergencyMode_, "emergency mode!");
        require(_flyAmount > 0, "zero fly");

        require(
            stakedStorage_[_recipient].length < MAX_STAKING_POSITIONS,
            "too many staked positions"
        );

        stakedStorage_[_recipient].push(StakedPrivate({
            receivedBonus: _claimAndStakeBonus,
            flyVested: _flyAmount,
            depositTimestamp: block.timestamp
        }));

        // take the ERC20 from the spender.
        flyToken_.safeTransferFrom(_spender, address(this), _flyAmount);

        return _flyAmount;
    }

    function _popStakedPosition(address _spender, uint i) internal {
        // if the amount of staked positions from the user exceeds 1,
        // then we can replace them with the last item in the array, then
        // pop them.
        // make sure to always iterate the opposite direction through
        // this list.
        uint256 len = stakedStorage_[_spender].length;
        if (len > 1) {
            StakedPrivate storage x = stakedStorage_[_spender][len - 1];
            stakedStorage_[_spender][i] = x;
        }
        stakedStorage_[_spender].pop();
    }

    function _popUnstakingPosition(address _spender, uint i) internal {
        // see the _popStakedPosition function for how this works (same design.)
        uint256 len = unstakingStorage_[_spender].length;
        if (len > 1) {
            UnstakingPrivate storage x = unstakingStorage_[_spender][len - 1];
            unstakingStorage_[_spender][i] = x;
        }
        unstakingStorage_[_spender].pop();
    }
    /* ~~~~~~~~~~ INFORMATIONAL ~~~~~~~~~~ */

    function stakingPositionsLen(address _account) public view returns (uint) {
        return stakedStorage_[_account].length;
    }

    /// @inheritdoc IStaking
    function stakingDetails(address _account) public view returns (uint256 flyStaked, uint256 points) {
        for (uint i = 0; i < stakedStorage_[_account].length; i++) {
            StakedPrivate storage s = stakedStorage_[_account][i];
            points += calculatePoints(block.timestamp, s);
            flyStaked += s.flyVested;
        }
    }

    /// @inheritdoc IStaking
    function merkleDistributor() public view returns (address) {
        return merkleDistributor_;
    }

    /// @inheritdoc IStaking
    function minFlyAmount() public pure returns (uint256 flyAmount) {
        return 0;
    }

    /* ~~~~~~~~~~ NORMAL USER PUBLIC ~~~~~~~~~~ */

    /// @inheritdoc IStaking
    function stake(uint256 _flyAmount) public returns (uint256 flyStaked) {
        return _stake(msg.sender, msg.sender, _flyAmount, false);
    }

    /// @inheritdoc IStaking
    function stakePermit(
        uint256 _flyAmount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public returns (uint256 flyStaked) {
        flyToken_.permit(msg.sender, address(this), _flyAmount, _deadline, _v, _r, _s);
        return stake(_flyAmount);
    }

    /// @inheritdoc IStaking
    function stakeFor(address _recipient, uint256 _flyAmount) public returns (
        uint256 flyStaked,
        uint256 day1Points
    ) {
        require(msg.sender == merkleDistributor_, "not merkle distributor");
        flyStaked = _stake(msg.sender, _recipient, _flyAmount, true);
        return (flyStaked, _calcDay1Points(_flyAmount));
    }

    /// @inheritdoc IStaking
    function beginUnstake(
        uint256 _flyToUnstake
    ) external returns (uint256 flyRemaining, uint256 unstakedBy) {
        // for every staked position created by the user, attempt to take
        // amounts from the user with them asking. if they get to 0, then we destroy
        // the position, then move on.
        flyRemaining = _flyToUnstake;
        uint len = stakedStorage_[msg.sender].length;
        unstakedBy = block.timestamp;
        if (len == 0) revert("no fly unstaked");
        unstakedBy += UNBONDING_PERIOD;
        // it's important to always break here if we're at 0.
        for (uint i = len - 1; i >= 0; i--) {
            if (flyRemaining == 0) break;
            StakedPrivate storage s = stakedStorage_[msg.sender][i];
            if (flyRemaining >= s.flyVested) {
                // the FLY staked in this position is less than the amount requested.
                // take the full amount for this position, pop the staked amount, reduce
                // the fly remaining, then move on.
                flyRemaining -= s.flyVested;
                unstakingStorage_[msg.sender].push(UnstakingPrivate({
                    flyAmount: s.flyVested,
                    unstakedTimestamp: unstakedBy
                }));
                _popStakedPosition(msg.sender, i);
                if (i == 0) break;
            } else {
                // the FLY staked in this position is more than what's remaining. so we
                // can update the existing staked amount to reduce the FLY that they
                // requested, then we can just return here.
                stakedStorage_[msg.sender][i].flyVested -= flyRemaining;
                flyRemaining = 0;
                break;
            }
        }
        require(_flyToUnstake > flyRemaining, "no fly unstaked");
        return (flyRemaining, unstakedBy);
    }

    /// @inheritdoc IStaking
    function amountUnstaking(address _owner) public view returns (uint256 flyAmount) {
        for (uint i = 0; i < unstakingStorage_[_owner].length; i++) {
            flyAmount += unstakingStorage_[_owner][i].flyAmount;
        }
    }

    /// @inheritdoc IStaking
    function secondsUntilSoonestUnstake(
        address _spender
    ) public view returns (uint256 shortestSecs) {
        for (uint i = 0; i < unstakingStorage_[_spender].length; i++) {
            uint256 ts = unstakingStorage_[_spender][i].unstakedTimestamp;
            if (block.timestamp > ts) {
                uint256 remaining =  block.timestamp - ts;
                // if we haven't set the shortest number of seconds, we
                // set it to whatever we can, or we set it to the
                // smallest value.
                if (shortestSecs == 0 || remaining < shortestSecs) shortestSecs = remaining;
            }
        }
    }

    /// @inheritdoc IStaking
    function finaliseUnstake() public returns (uint256 flyReturned) {
        // iterate through all the unstaking positions, and, if the unstaked
        // timestamp is greater than the block timestamp, then remove their
        // unstaked position, and increase the fly returned. then pop them from
        // the unstaking list.
        uint len = unstakingStorage_[msg.sender].length;
        if (len == 0) return 0;
        for (uint i = len - 1; i >= 0; i--) {
            UnstakingPrivate storage s = unstakingStorage_[msg.sender][i];
            // if the timestamp for the time that we need to unstake is less than the
            // current, break out.
            if (s.unstakedTimestamp > block.timestamp) {
              if (i == 0) break;
              else continue;
            }
            // unstake now.
            flyReturned += s.flyAmount;
            _popUnstakingPosition(msg.sender, i);
            if (i == 0) break;
        }
        // now we can use ERC20 to send the token back, if they got more than 0 back.
        if (flyReturned == 0) revert("no fly returned");
        flyToken_.safeTransfer(msg.sender, flyReturned);
    }

    /* ~~~~~~~~~~ OPERATOR ~~~~~~~~~~ */

    function updateMerkleDistributor(address _old, address _new) public {
        require(msg.sender == operator_, "operator only");
        require(merkleDistributor_ == _old, "incorrect order");
        merkleDistributor_ = _new;
        emit NewMerkleDistributor(_old, _new);
    }

    /* ~~~~~~~~~~ EMERGENCY FUNCTIONS ~~~~~~~~~~ */

    /// @inheritdoc IStaking
    function emergencyWithdraw() external {
	// take out whatever we can for the user, assuming that if we're
	// at this point, the contract is junk, and is needing a code
	// upgrade. so we keep the implementation of this as simple as
	// possible, without using the popping function from earlier.
        require(!noEmergencyMode_, "not emergency");
        uint256 flyAmount = 0;
        for (uint i = 0; i < stakedStorage_[msg.sender].length; i++) {
            flyAmount += stakedStorage_[msg.sender][i].flyVested;
            stakedStorage_[msg.sender][i].flyVested = 0;
        }
        for (uint i = 0; i < unstakingStorage_[msg.sender].length; i++) {
            flyAmount += unstakingStorage_[msg.sender][i].flyAmount;
            unstakingStorage_[msg.sender][i].flyAmount = 0;
        }
        flyToken_.safeTransfer(msg.sender, flyAmount);
    }

    /* ~~~~~~~~~~ IMPLEMENTS IOperatorOwned ~~~~~~~~~~ */

    /// @inheritdoc IOperatorOwned
    function operator() public view returns (address) {
        return operator_;
    }

    /* ~~~~~~~~~~ IMPLEMENTS IEmergencyMode ~~~~~~~~~~ */

    /// @inheritdoc IEmergencyMode
    function enableEmergencyMode() public {
        require(
            msg.sender == operator_ || msg.sender == emergencyCouncil_,
            "can't enable emergency mode!"
        );

        noEmergencyMode_ = false;

        emit Emergency(true);
    }

    /// @inheritdoc IEmergencyMode
    function disableEmergencyMode() public {
        require(msg.sender == operator_, "operator only");
        noEmergencyMode_ = true;
        emit Emergency(false);
    }

    /// @inheritdoc IEmergencyMode
    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    /// @inheritdoc IEmergencyMode
    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    /* ~~~~~~~~~~ IMPLEMENTS IERC20 ~~~~~~~~~~ */

    function allowance(address /* owner */, address /* spender */) external pure returns (uint256) {
        return 0;
    }

    function approve(address /* spender */, uint256 /* amount */) external pure returns (bool) {
        return false;
    }

    function balanceOf(address account) external view returns (uint256) {
        (, uint256 points) = stakingDetails(account);
        return points;
    }

    function decimals() external pure returns (uint8) {
        return STAKING_DECIMALS;
    }

    function name() external pure returns (string memory) {
        return STAKING_NAME;
    }

    function symbol() external pure returns (string memory) {
        return STAKING_SYMBOL;
    }

    function totalSupply() external pure returns (uint256) {
        return type(uint256).max;
    }

    function transfer(address /* to */, uint256 /* amount */) external pure returns (bool) {
        revert("no transfer");
    }

    function transferFrom(
        address /* from */,
        address /* to */,
        uint256 /* amount */
    ) external pure returns (bool) {
        revert("no transfer");
    }
}
