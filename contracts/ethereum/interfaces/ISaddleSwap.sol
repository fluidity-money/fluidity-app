// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IERC20.sol";

interface ISaddleSwap {
    function swapStorage() external view returns (
        uint256 initialA,
        uint256 futureA,
        uint256 initialATime,
        uint256 futureATime,
        uint256 swapFee,
        uint256 adminFee,
        uint256 defaultWithdrawFee,
        IERC20 lpToken
    );

    function addLiquidity(
        uint256[] memory amounts,
        uint256 minToMint,
        uint256 deadline
    ) external returns (uint256);

     function removeLiquidity(
        uint256 amount,
        uint256[] calldata minAmounts,
        uint256 deadline
    ) external returns (uint256[] memory);
}
