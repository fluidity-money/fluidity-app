// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IERC20.sol";

interface ICamelotPair is IERC20 {
    function getReserves() external view returns (
        uint112 reserve0,
        uint112 reserve1,
        uint16 token0FeePercent,
        uint16 token1
    );
}
