// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface IWETH {
    function deposit() external payable;
    function withdraw(uint) external;
    function approve(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}
