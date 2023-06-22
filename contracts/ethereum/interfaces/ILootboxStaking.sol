// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface ILootboxStaking {
    /**
     * @notice Deposit made by a user that's tracked internally
     * @dev tokenA is always fusdc in this code
     */
    struct Deposit {
        uint256 redeemTimestamp;

        uint256 camelotLpMinted;
        uint256 camelotTokenA;
        uint256 camelotTokenB;

        uint256 sushiswapLpMinted;
        uint256 sushiswapTokenA;
        uint256 sushiswapTokenB;

        bool fusdcUsdcPair;

        uint256 depositTimestamp;
    }

    event Deposited(
        address indexed spender,
        uint256 lockupLength,
        uint256 lockedTimestamp,
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

    event Redeemed(
        address indexed spender,
        uint256 lockupLength,
        uint256 lockedTimestamp,
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

    /**
     * @notice deposit a token pair (only usdc or weth)
     * @param _lockupLength to use as the amount of time until redemption is possible
     * @param _fusdcAmount to use as the amount of fusdc to deposit
     * @param _usdcAmount to use as the amount of usdc to deposit
     * @param _wethAmount to use as the amount of weth to deposit
     * @param _slippage to use to reduce the minimum deposit per platform
     * @param _maxTimestamp as the max amount of time in a timestamp
     */
    function deposit(
        uint256 _lockupLength,
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount,
        uint256 _slippage,
        uint256 _maxTimestamp
    ) external returns (
        uint256 fusdcDeposited,
        uint256 usdcDeposited,
        uint256 wethDeposited
    );

    /**
     * @notice redeem as many deposits as possible that are ready
     * @param _maxTimestamp to cancel this execution by if passed
     * @param _fusdcMinimum to revert with if fusdc is less than this
     * @param _usdcMinimum to revert with if usdc is less than this
     * @param _wethMinimum to revert with if weth is less
     */
    function redeem(
        uint256 _maxTimestamp,
        uint256 _fusdcMinimum,
        uint256 _usdcMinimum,
        uint256 _wethMinimum
    ) external returns (
        uint256 fusdcRedeemed,
        uint256 usdcRedeemed,
        uint256 wethRedeemed
    );

    /**
     * @notice deposits made by a specific address
     * @param _spender address to check
     */
    function deposits(address _spender) external view returns (Deposit[] memory);

    /**
     * @notice ratios available in the underlying pools - to find the
     *         ratio of the base asset subtract by 1e12
     */
    function ratios() external view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio,
        uint256 fusdcUsdcSpread,
        uint256 fusdcWethSpread,
        uint256 fusdcUsdcLiq,
        uint256 fusdcWethLiq
    );
}
