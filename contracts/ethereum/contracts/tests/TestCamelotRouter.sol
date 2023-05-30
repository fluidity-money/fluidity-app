// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/ICamelotRouter.sol";

contract TestCamelotRouter is ICamelotRouter {
    uint x;

    function addLiquidity(
        address /* _tokenA */,
        address /* _tokenB */,
        uint /* _amountADesired */,
        uint /* _amountBDesired */,
        uint /* _amountAMin */,
        uint /* _amountBMin */,
        address /* _to */,
        uint /* _deadline */
    ) external returns (uint, uint, uint) {
        ++x;
        revert("test client");
    }

    function removeLiquidity(
        address /* tokenA */,
        address /* tokenB */,
        uint256 /* liquidity */,
        uint256 /* amountAMin */,
        uint256 /* amountBMin */,
        address /* to */,
        uint /* deadline */
    ) external returns (uint, uint) {
        ++x;
        revert("test client");
    }

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint /* _amountIn */,
        uint /* _amountOutMin */,
        address[] calldata /* _path */,
        address /* _to */,
        address /* _referrer */,
        uint /* _deadline */
    ) external {
        ++x;
        revert("test client");
    }
}
