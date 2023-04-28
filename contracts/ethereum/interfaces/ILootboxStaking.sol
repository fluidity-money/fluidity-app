// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface ILootboxStaking {
    event Staked(
        address indexed spender,
        uint256 lockupLength,
        uint256 lockedTimestamp,
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

    /**
     * @notice deposit a token pair (only usdc or weth is used!)
     * @param _lockupLength to use as the amount of time until redemption is possible
     * @param _fusdcAmount to use as the amount of fusdc to deposit
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
     * @notice deposited amount for the spender given of their original deposit
     * @param _spender to get the spending amounts for
     */
    function deposited(address _spender) external returns (
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

    /**
     * @notice redeem any deposits completed
     */
    function redeem() external returns (
        uint256 fusdcRedeemed,
        uint256 usdcRedeemed,
        uint256 wethRedeemed
    );

    /**
     * @notice redeemable amount that the user could get back
     * @param _spender that's checked
     */
    function redeemable(address _spender) external view returns (
        uint256 fusdcRedeemable,
        uint256 usdcRedeemable,
        uint256 wethRedeemable
    );
}
