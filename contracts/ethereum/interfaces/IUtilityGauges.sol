// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface IUtilityGauges {
    function votesAvailable(address spender) external returns (uint256);
    function votesAvailable() external returns (uint256);
    function vote(address gauge, uint256 weight) external;
    function getWeight(address gauge) external returns (uint256, uint256);
    function addUtility(address gauge) external;
}
