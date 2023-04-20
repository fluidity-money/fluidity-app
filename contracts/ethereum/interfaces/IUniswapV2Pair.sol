// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface IUniswapV2Pair {
    function balanceOf(address _spender) external view returns (uint256);
    function approve(address _spender, uint256 _amount) external returns (bool);
}
