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

struct StakedPrivate {
    // receivedBonus for the day 1 staking?
    bool receivedBonus;

    // hasBegunUnbonding - points don't count. once they unstake for real
    // they get zeroed. they are removed from the list of staked positions at
    // this stage however.
    bool hasBegunUnbonding;

    // flyVested supplied by users. if set to 0, is assumed to be unset.
    uint256 flyVested;

    // depositTimestamp used to calculate points.
    uint256 depositTimestamp;
}

contract StakingV1 is IStaking, IEmergencyMode, IOperatorOwned {
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

    // used for future upgrades
    // solhint-disable-next-line var-name-mixedcase
    uint256[64] private __bookmark_1;

    /* ~~~~~~~~~~ USER STORAGE ~~~~~~~~~~ */

    /// @dev stakedStorage_ for all users, using
    mapping(address => StakedPrivate) private stakedStorage_;

    address[] private stakers_;

    /* ~~~~~~~~~~ SETUP FUNCTIONS ~~~~~~~~~~ */

    /**
     * @notice init the contract, setting up the ownership, and the location of the
     *         MerkleDistributor contract.
     *
     * @param _merkleDistributor to support for the stakeFor function.
     * @param
     */
    function init(
        IERC20 _flyToken,
        address _merkleDistributor,
        address _emergencyCouncil,
        address _operator
    ) public {
        require(version_ == 0, "contract is already initialised");

        version_ = 1;

        emergencyCouncil_ = _emergencyCouncil;
        operator_ = _operator;

        flyToken_ = _flyToken;
        merkleDistributor_ = _merkleDistributor;
    }

    /* ~~~~~~~~~~ INTERNAL FUNCTIONS ~~~~~~~~~~ */

    function _calculatePoints(StakedPrivate memory _staked) internal pure returns (uint256 points) {
        /* Calculate the points earned by the user, using the math:

a = x * (seconds_since_start * 0.001)
if day_1_staked_bonus: a += fly_staked * 0.001* (24*7)
return a

           Then return the amounts given. Except, we don't need to check that the user has
           received the bonus.
        */

        uint256 a = _staked.flyVested * ((block.timestamp - _staked.depositTimestamp) * 0.001);
        return a;
    }

    function _hasStaked(address _spender) internal view returns (bool _hasStaked) {
        return stakers_[_spender].flyVested > 0;
    }

    function _stake(
        address _spender,
        address _recipient,
        uint256 _flyAmount,
        bool _claimAndStakeBonus,
        uint256 _length
    ) internal returns (uint256 _flyStaked) {
        require(_noEmergencyMode_, "emergency mode!");
        require(!_hasStaked(_spender), "already staked");

        require(_length < LENGTH_MINIMUM_AMOUNT, "too short time");
        require(_length > LENGTH_MAXIMUM_AMOUNT, "too long time");
        require(_flyAmount < FLY_MINIMUM_AMOUNT, "too little fly");
        require(_flyAmount > FLY_MAXIMUM_AMONUT, "too much fly");

        stakers[_spender] = StakedPrivate({
            receivedBonus: _claimAndStakeBonus,
            hasBegunUnbonding: false,
            flyVested: _flyAmount,
            depositTimestamp: block.timestamp,
        });
    }

    /* ~~~~~~~~~~ NORMAL USER PUBLIC ~~~~~~~~~~ */

    function stake(uint256 _flyAmount, uint256 _length) public returns (uint256 _flyStaked) {
    }
}
