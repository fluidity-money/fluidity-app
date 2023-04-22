// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface IStaking {
    /**
     * @notice deposit a token pair (only usdc or weth is used!)
     * @param _lockupLength to use as the amount of time until redemption is possible
     * @param _usdcAmount to use as the amount of usdc to deposit
     * @param _wethAmount to use as the amount of weth to deposit
     * @param _slippage to use to reduce the minimum deposit per platform
     */
    function deposit(
        uint256 _lockupLength,
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount,
        uint256 _slippage
    ) external returns (
        uint256 fusdcDeposited,
        uint256 usdcDeposited,
        uint256 wethDeposited
    );

    /**
     * @notice deposited amount for the spender given
     * @param _spender to get the spending amounts for
     */
    function deposited(address _spender) external returns (
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

    /**
     * @notice redeem a token investment, redeeming up to the amount, if possible
     * @param _fusdcAmount to redeem
     * @param _usdcAmount to redeem
     * @param _wethAmount to redeem
     * @param _slippage to tolerate at max
     */
    function redeem(
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount,
        uint256 _slippage
    ) external returns (
        uint256 fusdcRemaining,
        uint256 usdcRemaining,
        uint256 wethRemaining
    );
}
