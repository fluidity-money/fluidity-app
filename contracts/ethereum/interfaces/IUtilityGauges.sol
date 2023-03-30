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
    function balanceOf(address spender) external returns (uint256);
    function votesAvailable() external returns (uint256);
    function vote(address token, string memory gauge, uint256 weight) external;
    function getWeight(address token, string memory gauge) external returns (uint256, uint256);
    function getAllWeights() external returns (GaugeInfo[] memory, uint256, uint256, uint256);
    function addUtility(address token, string memory gauge) external;
    function removeUtility(address token, string memory gauge) external;
}
