// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/ISaddleSwap.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IUniswapV2Router02.sol";

import "./openzeppelin/SafeERC20.sol";

/*
* Network(s): Ethereum & Arbitrum
*
* * Supported LP Tokens for assets:
* - fUSDC/ETH
* - fUSDC/USDC
*
* * In the following protocols:
* - Saddle
* - Camelot
* - SushiSwap
*/

uint256 constant MAX_UINT256 = 2 ** 256 - 1;

uint256 constant MIN_LOCKUP_TIME = 31 days;

uint256 constant MAX_LOCKUP_TIME = 365 days;

/// @dev MIN_DEPOSIT must be divisible by 10 for allocation
///      weights
uint256 constant MIN_DEPOSIT = 10;

/// @notice Deposit made by a user
struct Deposit {
    // time the deposit was locked up for
    uint256 lockupLength;

    // saddle
    uint256 saddleFusdcProvided;
    uint256 saddleUsdcProvided;
    uint256 saddleWethProvided;

    // sushiswap
    uint256 sushiswapFusdcProvided;
    uint256 sushiswapUsdcProvided;
    uint256 sushiswapWethProvided;

    // camelot
    uint256 camelotFusdcProvided;
    uint256 camelotUsdcProvided;
    uint256 camelotWethProvided;
}

contract Staking {
    using SafeERC20 for IERC20;

    uint8 private version_;

    IERC20 private fUsdc_;

    IERC20 private wEth_;

    IERC20 private usdc_;

    ISaddleSwap private saddleSwapFusdcUsdc_;

    ISaddleSwap private saddleSwapFusdcWeth_;

    IUniswapV2Router02 private sushiswapRouter_;

    IUniswapV2Router02 private camelotRouter_;

    mapping (address => Deposit[]) private deposits_;

    function init(
        IERC20 _fUsdc,
        IERC20 _wEth,
        IERC20 _usdc,
        ISaddleSwap _saddleSwapFusdcUsdc,
        ISaddleSwap _saddleSwapFusdcEth,
        IUniswapV2Router02 _sushiswapRouter,
        IUniswapV2Router02 _camelotRouter
    ) public {
        require(version_ == 0, "already initialised");

        fUsdc_ = _fUsdc;
        wEth_ = _wEth;
        usdc_ = _usdc;

        saddleSwapFusdcUsdc_ = _saddleSwapFusdcUsdc;
        saddleSwapFusdcWeth_ = _saddleSwapFusdcEth;
        sushiswapRouter_ = _sushiswapRouter;
        camelotRouter_ = _camelotRouter;

        fUsdc_.safeApprove(address(saddleSwapFusdcUsdc_), MAX_UINT256);
        usdc_.safeApprove(address(saddleSwapFusdcUsdc_), MAX_UINT256);

        fUsdc_.safeApprove(address(saddleSwapFusdcWeth_), MAX_UINT256);
        wEth_.safeApprove(address(saddleSwapFusdcWeth_), MAX_UINT256);

        fUsdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        usdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        wEth_.safeApprove(address(sushiswapRouter_), MAX_UINT256);

        fUsdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        usdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        wEth_.safeApprove(address(camelotRouter_), MAX_UINT256);

        version_ = 1;
    }

    function depositToSaddle(
        ISaddleSwap _saddlePool,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal {
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = _token0Amount;
        amounts[1] = _token1Amount;

        _saddlePool.addLiquidity(
            amounts,
            0,
            block.timestamp + 1 hours
        );
    }

    function depositToUniswapV2Router(
        IUniswapV2Router02 _router,
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        return _router.addLiquidity(
            _token0,
            _token1,
            _token0Amount,
            _token1Amount,
            0,
            0,
            address(this),
            block.timestamp + 1 hours
        );
    }

    function recordDeposit(address _spender, Deposit memory _deposit) internal {
        deposits_[_spender].push(_deposit);

        // TODO log an event
    }

    function depositTokens(
        ISaddleSwap _saddleSwapRouter,
        IERC20 _token0,
        IERC20 _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (
        uint256 camelotToken0,
        uint256 saddleToken0,
        uint256 sushiToken0,
        uint256 camelotToken1,
        uint256 saddleToken1,
        uint256 sushiToken1
    ) {
        require(_token0Amount > MIN_DEPOSIT, "base too small");
        require(_token1Amount > MIN_DEPOSIT, "float too small");

        _token0.transferFrom(msg.sender, address(this), _token0Amount);
        _token1.transferFrom(msg.sender, address(this), _token1Amount);

        camelotToken0 = (_token0Amount * 40) / 100;
        saddleToken0 = (_token0Amount * 20) / 100;
        sushiToken0 = (_token0Amount * 40) / 100;

        camelotToken1 = (_token1Amount * 40) / 100;
        saddleToken1 = (_token1Amount * 20) / 100;
        sushiToken1 = (_token1Amount * 40) / 100;

        // deposit on camelot

        depositToUniswapV2Router(
            camelotRouter_,
            address(_token0),
            address(_token1),
            camelotToken0,
            camelotToken1
        );

        // deposit it on saddle

        depositToSaddle(_saddleSwapRouter, saddleToken0, saddleToken1);

        // deposit it on sushiswap

        depositToUniswapV2Router(
            sushiswapRouter_,
            address(fUsdc_),
            address(usdc_),
            sushiToken0,
            sushiToken1
        );

        return (
            camelotToken0,
            saddleToken0,
            sushiToken0,
            camelotToken1,
            saddleToken1,
            sushiToken1
        );
    }

    function depositFusdcUsdc(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount
    ) internal {
        (
            uint256 camelotFusdc,
            uint256 saddleFusdc,
            uint256 sushiswapFusdc,
            uint256 camelotUsdc,
            uint256 saddleUsdc,
            uint256 sushiswapUsdc
        ) = depositTokens(
            saddleSwapFusdcUsdc_,
            fUsdc_,
            usdc_,
            _fUsdcAmount,
            _usdcAmount
        );

        recordDeposit(msg.sender, Deposit({
            lockupLength: _lockupLength,
            saddleFusdcProvided: saddleFusdc,
            saddleUsdcProvided: saddleUsdc,
            saddleWethProvided: 0,
            camelotFusdcProvided: camelotFusdc,
            camelotUsdcProvided: camelotUsdc,
            camelotWethProvided: 0,
            sushiswapFusdcProvided: sushiswapFusdc,
            sushiswapUsdcProvided: sushiswapUsdc,
            sushiswapWethProvided: 0
        }));
    }

    function depositFusdcWeth(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _wethAmount
    ) internal {
        (
            uint256 camelotFusdc,
            uint256 saddleFusdc,
            uint256 sushiswapFusdc,
            uint256 camelotWeth,
            uint256 saddleWeth,
            uint256 sushiswapWeth
        ) = depositTokens(
            saddleSwapFusdcWeth_,
            fUsdc_,
            wEth_,
            _fUsdcAmount,
            _wethAmount
        );

        recordDeposit(msg.sender, Deposit({
            lockupLength: _lockupLength,
            saddleFusdcProvided: saddleFusdc,
            saddleUsdcProvided: 0,
            saddleWethProvided: saddleWeth,
            camelotFusdcProvided: camelotFusdc,
            camelotUsdcProvided: 0,
            camelotWethProvided: camelotWeth,
            sushiswapFusdcProvided: sushiswapFusdc,
            sushiswapUsdcProvided: 0,
            sushiswapWethProvided: sushiswapWeth
        }));
    }

    function deposit(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount
    ) public {
        // take the amounts given, and allocate 40% to camelot, 20% to saddle and
        // 40% to sushiswap

        require(_lockupLength >= MIN_LOCKUP_TIME, "lockup length too low");
        require(_lockupLength <= MAX_LOCKUP_TIME, "lockup length too high");

        bool fUsdcUsdcPair = _fUsdcAmount > 0 && _usdcAmount > 0;

        bool fUsdcWethPair = _fUsdcAmount > 0 && _wethAmount > 0;

        require(!(fUsdcUsdcPair && fUsdcWethPair), "usdc or weth");

        if (fUsdcUsdcPair) {
            depositFusdcUsdc(_lockupLength, _fUsdcAmount, _usdcAmount);
        } else {
            depositFusdcWeth(_lockupLength, _fUsdcAmount, _wethAmount);
        }
    }
}
