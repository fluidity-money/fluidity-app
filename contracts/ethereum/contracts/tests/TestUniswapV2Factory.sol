// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IUniswapV2Factory.sol";
import "../../interfaces/IUniswapV2Pair.sol";

contract TestUniswapV2Factory is IUniswapV2Factory {
    function createPair(
        address /* tokenA */,
        address /* tokenB */
    ) external returns (IUniswapV2Pair) {
        revert("test client");
    }

    function getPair(
        address /* tokenA */,
        address /* tokenB */
    ) external view returns (IUniswapV2Pair) {
        revert("test client");
    }
}
