// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./ICamelotPair.sol";

interface ICamelotFactory {
    function createPair(
        address tokenA,
        address tokenB
    ) external returns (ICamelotPair);

    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (ICamelotPair);
}
