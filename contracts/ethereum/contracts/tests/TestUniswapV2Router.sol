// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IUniswapV2Router02.sol";

contract TestUniswapV2Router is IUniswapV2Router02 {
    function addLiquidity(
        address /* _tokenA */,
        address /* _tokenB */,
        uint /* _amountADesired */,
        uint /* _amountBDesired */,
        uint /* _amountAMin */,
        uint /* _amountBMin */,
        address /* _to */,
        uint /* _deadline */
    ) external pure returns (uint, uint, uint) {
        return (0, 0, 0);
    }

    function removeLiquidity(
        address /* tokenA */,
        address /* tokenB */,
        uint256 /* liquidity */,
        uint256 /* amountAMin */,
        uint256 /* amountBMin */,
        address /* to */,
        uint /* deadline */
    ) external pure returns (uint, uint) {
        return (0, 0);
    }
}
