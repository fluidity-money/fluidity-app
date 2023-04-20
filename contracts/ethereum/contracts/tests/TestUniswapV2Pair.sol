// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IUniswapV2Pair.sol";

contract TestUniswapV2Pair {
    function balanceOf(address /* _spender */) public pure returns (uint256) {
        return 0;
    }
}
