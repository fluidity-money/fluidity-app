// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

struct Staked {
    address account;
    uint256 points;
}

/*
 * IStaking is a simple staking contract with a 7 day unbonding period that requires manual
 * intervention to access after the interaction has begun. The user has their points
 * zeroed when they begin unstaking. In the interim, the UI displays them as "lost".
 * Not intended to be used as a voting contract or anything similar, so it lacks the facilities
 * for this.
 *
 * The user's deposit time and the seconds since are recorded in the contract, and a simple
 * getter method is provided to accumulate the points and amounts staked for simplicity,
 * which should be called infrequently owing to it's gas profile, perhaps only simulated.
 *
 * The Staking contract pretends to be a ERC20 amount, though the transfer and allowance
 * functions are broken.
 *
 * A function is added for an operator to retroactievely provide the signup bonus based on
 * the lag between the claim and the stake (in some cases.)
 *
 * An extra function called "emergencyWithdraw" is provided for users to pull their staked
 * amounts out in an emergency mode stake.
*/
interface IStaking {
    /* ~~~~~~~~~~ SIMPLE GETTER ~~~~~~~~~~ */

    /// @notice merkleDistributor that's in use for the stakeFor function.
    function merkleDistributor() external view returns (address);

    /// @notice minFlyAmount that must be supplied for staking.
    function minFlyAmount() external pure returns (uint256 flyAmount);

    /* ~~~~~~~~~~ NORMAL USER ~~~~~~~~~~ */

    /**
     * @notice stake the amount given.
     * @param _flyAmount to take from the msg.sender.
     */
    function stake(uint256 _flyAmount) external returns (uint256 flyStaked);

    /**
     * @notice stake the amount given, using the permit router for approvals beforehand.
     * @param _flyAmount to take from the msg.sender.
     * @param _deadline as the expiration date for the permit call to the contract.
     * @param _v recovery ID for the signature.
     * @param _r point on the elliptic curve
     * @param _s point on the elliptic curve for address derivation using a signature.
     */
    function stakePermit(
        uint256 _flyAmount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256 flyStaked);

    /**
     * @notice stakeFor a user using tokens from msg.sender. Currently gated for the
     *         merkle distributor, so as to prevent abuse.
     * @param _spender to stake on behalf of.
     * @param _amount to take from the msg.sender, to stake on behalf of the user.
     */
    function stakeFor(address _spender, uint256 _amount) external returns (
        uint256 flyStaked,
        uint256 day1Points
    );

    /**
     * @notice stakingDetails for a specific user.
     * @param _account to check.
     */
    function stakingDetails(address _account) external view returns (
        uint256 flyStaked,
        uint256 points
    );

    /**
     * @notice beginUnstake for the address given, unstaking from the leftmost position
     *         until we unstake the amount requested.
     * @param _flyToUnstake the amount to request to unstake for the user.
     * @return flyRemaining from the unstaking process.
     * @return unstakedBy the timestamp by which every position is fully unstaked.
     */
    function beginUnstake(
        uint256 _flyToUnstake
    ) external returns (uint256 flyRemaining, uint256 unstakedBy);

    /**
     * @notice amountUnstaking that the user has requested in the past, cumulatively.
     * @param _owner of the amounts that are unstaking to check.
     */
    function amountUnstaking(address _owner) external view returns (uint256 flyAmount);

    /**
     * @notice secondsUntilSoonestUnstake for the soonest amount of seconds until a unstake is possible.
     * @param _spender of the fully unstaking process.
     */
    function secondsUntilSoonestUnstake(address _spender) external view returns (uint256 shortestSecs);

    /**
     * @notice finaliseUnstake for a user, if they're past the unbonding period.
     */
    function finaliseUnstake() external returns (uint256 flyReturned);

    /**
     * @notice emergencyWithdraw the sender's balance, if the contract is in a state of emergency.
     */
    function emergencyWithdraw() external;
}
