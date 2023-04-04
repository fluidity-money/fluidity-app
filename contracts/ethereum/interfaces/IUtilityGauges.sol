// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

/// @dev identifier for a utility gauge
struct GaugeId {
    address token;
    string gauge;
}

/// @dev returned from the getAllGauges function
struct GaugeInfo {
    GaugeId id;
    uint256 votes;
}

interface IUtilityGauges {
    /// @notice returns the amount of votes a user has available
    function balanceOf(address spender) external returns (uint256);

    /// @notice returns the amount of votes the caller has available
    function votesAvailable() external returns (uint256);

    /**
     * @notice adds votes to a token/utility pair
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     * @param weight the number of votes to add
     */
    function vote(address token, string memory gauge, uint256 weight) external;

    /**
     * @notice gets the ratio of votes in a specific gauge
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     *
     * @return pair of (number of votes in that utility, number of votes total)
     */
    function getWeight(address token, string memory gauge) external returns (uint256, uint256);

    /**
     * @notice gets info for all gauges
     * @return array of (gauge id, votes), the total votes, time of last reset, and time of next reset
     */
    function getAllWeights() external returns (GaugeInfo[] memory, uint256, uint256, uint256);

    /**
     * @notice operator only, adds a new utility to be voted on
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     */
    function addUtility(address token, string memory gauge) external;

    /**
     * @notice operator only, removes a utility from voting
     * @dev this discards user's votes for a bit, but since they're
     *      reset weekly this should be fine
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     */
    function removeUtility(address token, string memory gauge) external;
}
