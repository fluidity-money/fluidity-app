// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IUniswapV2Factory.sol";

contract TestUniswapV2Factory is IUniswapV2Factory {
    function createPair(
        address /* tokenA */,
        address /* tokenB */
    ) external view returns (address) {
        return msg.sender;
    }
}
