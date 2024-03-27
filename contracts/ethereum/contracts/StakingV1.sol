// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./openzeppelin/SafeERC20.sol";

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IERC20.sol";

uint8 constant STAKING_DECIMALS = 1;

string constant STAKING_NAME = "Staked FLY";

string constant STAKING_SYMBOL = "sFLY";

/// @dev FLY_MIN_AMOUNT to allow for staking. 1e6 is assumed to be the
///      FLY decimals.
uint256 constant FLY_MIN_AMOUNT = 100 * 1e6;

uint256 constant UNBONDING_PERIOD = 7 days;

struct StakedPrivate {
    // receivedBonus for the day 1 staking?
    bool receivedBonus;

    // flyVested supplied by users.
    uint256 flyVested;

    // depositTimestamp used to calculate points.
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
    using SafeERC20 for IERC20;

    /* ~~~~~~~~~~ HOUSEKEEPING ~~~~~~~~~~ */

    /// @dev if false, emergency mode is active - can be called by either the
    /// @dev operator, worker account or emergency council
    bool private noEmergencyMode_;

    // for migrations
    uint private version_;

    /* ~~~~~~~~~~ OWNERSHIP ~~~~~~~~~~ */

    /// @dev emergency council that can activate emergency mode
    address private emergencyCouncil_;

    /// @dev account to use that created the contract (multisig account)
    address private operator_;

    /* ~~~~~~~~~~ GLOBAL STORAGE ~~~~~~~~~~ */

    IERC20 private flyToken_;

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
        IERC20 _flyToken,
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
    }

    /* ~~~~~~~~~~ INTERNAL FUNCTIONS ~~~~~~~~~~ */

    function calculatePoints(uint256 curTimestamp, StakedPrivate memory _staked) public pure returns (uint256 points) {
        /*
         * Calculate the points earned by the user, using the math:

a = x * (seconds_since_start * 0.001)
if day_1_staked_bonus: a += fly_staked * 0.001* (24*7)
return a

         * Then return the amounts given. Except, we don't need to check that the user has
         * received the bonus.
        */

        uint256 a = _staked.flyVested * ((curTimestamp - _staked.depositTimestamp) / 1000);
        if (_staked.receivedBonus) a += (_staked.flyVested / 1000) * 24 days;
        return a;
    }

    function _hasStaked(address _spender) internal view returns (bool hasStaked) {
        return stakedStorage_[_spender].length > 0;
    }

    function _stake(
        address _spender,
        address _recipient,
        uint256 _flyAmount,
        bool _claimAndStakeBonus
    ) internal returns (uint256 _flyStaked) {
        require(noEmergencyMode_, "emergency mode!");

        require(_flyAmount > FLY_MIN_AMOUNT, "too little fly");

        stakedStorage_[_recipient].push(StakedPrivate({
            receivedBonus: _claimAndStakeBonus,
            flyVested: _flyAmount,
            depositTimestamp: block.timestamp
        }));

        // take the ERC20 from the spender.
        flyToken_.safeTransferFrom(_spender, address(this), _flyAmount);

        return _flyAmount;
    }

    function _calcDay1Points(uint256 _flyAmount) internal pure returns (uint256 points) {
        return _flyAmount * (7 days / 100);
    }

    function _popStakedPosition(address _spender, uint i) internal {
        // if the amount of staked positions from the user exceeds 1,
        // then we can replace them with the last item in the array, then
        // pop them.
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
        return FLY_MIN_AMOUNT;
    }

    /* ~~~~~~~~~~ NORMAL USER PUBLIC ~~~~~~~~~~ */

    /// @inheritdoc IStaking
    function stake(uint256 _flyAmount) public returns (uint256 flyStaked) {
        return _stake(msg.sender, msg.sender, _flyAmount, false);
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
        if (len == 0) return (0, unstakedBy);
        unstakedBy += UNBONDING_PERIOD;
        for (uint i = 0; i < len; i++) {
            if (flyRemaining == 0) return (flyRemaining, unstakedBy);
            StakedPrivate storage s = stakedStorage_[msg.sender][i];
            if (s.flyVested >= flyRemaining) {
                // the FLY staked in this position is more than the amount requested.
                // take the full amount for this position, then move on.
                flyRemaining -= s.flyVested;
                _popStakedPosition(msg.sender, i);
                unstakingStorage_[msg.sender].push(UnstakingPrivate({
                    flyAmount: s.flyVested,
                    unstakedTimestamp: unstakedBy
                }));
            } else {
                // the FLY staked in this position is more than what's remaining. so we
                // can update the existing staked amount to reduce the FLY that they
                // requested, then we can just return here.
                stakedStorage_[msg.sender][i].flyVested -= flyRemaining;
                flyRemaining = 0;
                return (flyRemaining, unstakedBy);
            }
        }
    }

    /// @inheritdoc IStaking
    function amountUnstaking() public view returns (uint256 flyAmount) {
        for (uint i = 0; i < unstakingStorage_[msg.sender].length; i++) {
            flyAmount += unstakingStorage_[msg.sender][i].flyAmount;
        }
    }

    /// @inheritdoc IStaking
    function secondsUntilFullyUnstaked() public view returns (uint256 secs) {
        for (uint i = 0; i < unstakingStorage_[msg.sender].length; i++) {
            uint256 ts = unstakingStorage_[msg.sender][i].unstakedTimestamp;
            if (block.timestamp > ts) secs += block.timestamp - ts;
        }
    }

    /// @inheritdoc IStaking
    function finaliseUnstake() public returns (uint256 flyReturned) {
        // iterate through all the unstaking positions, and, if the unstaked
        // timestamp is greater than the block timestamp, then remove their
        // unstaked position, and increase the fly returned. then pop them from
        // the unstaking list.
        for (uint i = 0; i < unstakingStorage_[msg.sender].length; i++) {
            UnstakingPrivate storage s = unstakingStorage_[msg.sender][i];
            if (s.unstakedTimestamp > block.timestamp) continue;
            // unstake now.
            flyReturned += s.flyAmount;
            _popUnstakingPosition(msg.sender, i);
        }
        // now we can use ERC20 to send the token back, if they're legit.
        if (flyReturned > 0) {
            flyToken_.safeTransfer(msg.sender, flyReturned);
        }
    }

    /* ~~~~~~~~~~ EMERGENCY FUNCTIONS ~~~~~~~~~~ */

    /// @inheritdoc IStaking
    function emergencyWithdraw() external {
        // take out whatever we can for the user, without updating the storage internally.
        require(!noEmergencyMode_, "not emergency");
        uint256 flyAmount = 0;
        for (uint i = 0; i < stakedStorage_[msg.sender].length; i++) {
            flyAmount += stakedStorage_[msg.sender][i].flyVested;
        }
        for (uint i = 0; i < unstakingStorage_[msg.sender].length; i++) {
            flyAmount += unstakingStorage_[msg.sender][i].flyAmount;
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
