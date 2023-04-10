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

import "hardhat/console.sol";

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

enum LiquidityProvided {
    FUSDC_USDC,
    FUSDC_WETH
}

/// @notice Deposit made by a user
struct Deposit {
    uint256 redeemTimestamp;

    uint256 saddleLpMinted;
    uint256 camelotLpMinted;
    uint256 sushiswapLpMinted;

    uint256 token0Amount;
    uint256 token1Amount;

    LiquidityProvided typ;
}

contract Staking {
    using SafeERC20 for IERC20;

    event Staked(
        address indexed spender,
        uint256 lockupLength,
        uint256 lockedTimestamp,
        uint256 fUsdcAmount,
        uint256 usdcAmount,
        uint256 wEthAmount
    );

    uint8 private version_;

    IERC20 private fUsdc_;

    IERC20 private wEth_;

    IERC20 private usdc_;

    ISaddleSwap private saddleSwapFusdcUsdc_;

    ISaddleSwap private saddleSwapFusdcWeth_;

    IERC20 private saddleSwapFusdcUsdcLpToken_;

    IERC20 private saddleSwapFusdcWethLpToken_;

    IUniswapV2Router02 private camelotRouter_;

    IUniswapV2Router02 private sushiswapRouter_;

    mapping (address => Deposit[]) private deposits_;

    function init(
        IERC20 _fUsdc,
        IERC20 _usdc,
        IERC20 _wEth,
        ISaddleSwap _saddleSwapFusdcUsdc,
        ISaddleSwap _saddleSwapFusdcWeth,
        IUniswapV2Router02 _camelotRouter,
        IUniswapV2Router02 _sushiswapRouter
    ) public {
        require(version_ == 0, "already initialised");

        fUsdc_ = _fUsdc;
        usdc_ = _usdc;
        wEth_ = _wEth;

        saddleSwapFusdcUsdc_ = _saddleSwapFusdcUsdc;
        saddleSwapFusdcWeth_ = _saddleSwapFusdcWeth;

        (,,,,,,,saddleSwapFusdcUsdcLpToken_) = saddleSwapFusdcUsdc_.swapStorage();

        (,,,,,,,saddleSwapFusdcWethLpToken_) = saddleSwapFusdcWeth_.swapStorage();

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

    function _depositToSaddle(
        ISaddleSwap _saddleSwap,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal {
        uint256[] memory amounts = new uint256[](2);

        amounts[0] = _token0Amount;
        amounts[1] = _token1Amount;

        // in our testing, saddle was incorrectly returning the lp tokens, so we
        // trust the caller to figure this out themselves

       _saddleSwap.addLiquidity(
            amounts,
            0,
            block.timestamp + 1
        );
    }

    function _depositToUniswapV2Router(
        IUniswapV2Router02 _router,
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (uint256 liquidity) {
        (,,liquidity) = _router.addLiquidity(
            _token0,
            _token1,
            _token0Amount,
            _token1Amount,
            _token0Amount,
            _token1Amount,
            address(this),
            block.timestamp + 1
        );

        return liquidity;
    }

    function calculateWeights(
        uint256 _token0Amount,
        uint256 _token1Amount
    ) public pure returns (
        uint256 saddleToken0,
        uint256 camelotToken0,
        uint256 sushiToken0,

        uint256 saddleToken1,
        uint256 camelotToken1,
        uint256 sushiToken1
    ) {
        saddleToken0 = (_token0Amount * 20) / 100;
        camelotToken0 = (_token0Amount * 40) / 100;
        sushiToken0 = (_token0Amount * 40) / 100;

        saddleToken1 = (_token1Amount * 20) / 100;
        camelotToken1 = (_token1Amount * 40) / 100;
        sushiToken1 = (_token1Amount * 40) / 100;

        return (
            saddleToken0,
            camelotToken0,
            sushiToken0,

            saddleToken1,
            camelotToken1,
            sushiToken1
        );
    }

    function _depositTokens(
        ISaddleSwap _saddleSwap,
        IERC20 _token0,
        IERC20 _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (Deposit memory dep) {
        require(_token0Amount > MIN_DEPOSIT, "base too small");
        require(_token1Amount > MIN_DEPOSIT, "float too small");

        _token0.transferFrom(msg.sender, address(this), _token0Amount);
        _token1.transferFrom(msg.sender, address(this), _token1Amount);

        (
            uint256 saddleToken0,
            uint256 camelotToken0,
            uint256 sushiToken0,

            uint256 saddleToken1,
            uint256 camelotToken1,
            uint256 sushiToken1
        ) = calculateWeights(_token0Amount, _token1Amount);

        // deposit it on saddle, but ignore the return type to set with the
        // caller (we don't trust saddle with the lp token return number)

        _depositToSaddle(
            _saddleSwap,
            saddleToken0,
            saddleToken1
        );

        // deposit on camelot

        dep.camelotLpMinted = _depositToUniswapV2Router(
            camelotRouter_,
            address(_token0),
            address(_token1),
            camelotToken0,
            camelotToken1
        );

        // deposit it on sushiswap

        dep.sushiswapLpMinted = _depositToUniswapV2Router(
            sushiswapRouter_,
            address(fUsdc_),
            address(usdc_),
            sushiToken0,
            sushiToken1
        );

        return dep;
    }

    function _depositFusdcUsdc(
        uint256 _fUsdcAmount,
        uint256 _usdcAmount
    ) internal returns (Deposit memory dep){
        uint256 saddleLpBefore = saddleSwapFusdcUsdcLpToken_.balanceOf(address(this));

        dep = _depositTokens(
            saddleSwapFusdcUsdc_,
            fUsdc_,
            usdc_,
            _fUsdcAmount,
            _usdcAmount
        );

        uint256 saddleLpAfter = saddleSwapFusdcUsdcLpToken_.balanceOf(address(this));

        dep.saddleLpMinted = saddleLpAfter - saddleLpBefore;

        dep.typ = LiquidityProvided.FUSDC_USDC;

        return dep;
    }

    function _depositFusdcWeth(
        uint256 _fUsdcAmount,
        uint256 _wEthAmount
    ) internal returns (Deposit memory dep) {
        uint256 saddleLpBefore = saddleSwapFusdcWethLpToken_.balanceOf(address(this));

        dep = _depositTokens(
            saddleSwapFusdcWeth_,
            fUsdc_,
            wEth_,
            _fUsdcAmount,
            _wEthAmount
        );

        uint256 saddleLpAfter = saddleSwapFusdcWethLpToken_.balanceOf(address(this));

        dep.saddleLpMinted = saddleLpAfter - saddleLpBefore;

        dep.typ = LiquidityProvided.FUSDC_WETH;

        return dep;
    }

    function deposit(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wEthAmount
    ) external returns (uint) {
        // take the amounts given, and allocate 40% to camelot, 20% to saddle and
        // 40% to sushiswap

        require(_lockupLength >= MIN_LOCKUP_TIME, "lockup length too low");
        require(_lockupLength <= MAX_LOCKUP_TIME, "lockup length too high");

        bool fUsdcUsdcPair = _fUsdcAmount > 0 && _usdcAmount > 0;

        bool fUsdcWethPair = _fUsdcAmount > 0 && _wEthAmount > 0;

        require(!(fUsdcUsdcPair && fUsdcWethPair), "usdc or weth");

        Deposit memory dep;

        if (fUsdcUsdcPair)
            dep = _depositFusdcUsdc(_fUsdcAmount, _usdcAmount);
        else
            dep = _depositFusdcWeth(_fUsdcAmount, _wEthAmount);

        dep.redeemTimestamp = _lockupLength + block.timestamp;

        emit Staked(
            msg.sender,
            _lockupLength,
            block.timestamp,
            _fUsdcAmount,
            _usdcAmount,
            _wEthAmount
        );

        uint depositId = deposits_[msg.sender].length;

        deposits_[msg.sender].push(dep);

        // the above functions should've added to the deposits so we can return
        // the latest item in the array there

        return depositId;
    }

    function _redeemSaddleSwap(
        ISaddleSwap _saddleSwap,
        uint256 _token0Amount,
        uint256 _token1Amount,
        uint256 _lpTokens
    ) internal {
        uint256[] memory amounts = new uint256[](2);

        amounts[0] = _token0Amount;
        amounts[1] = _token1Amount;

        uint256[] memory burned = _saddleSwap.removeLiquidity(
            _lpTokens,
            amounts,
            block.timestamp + 1
        );

        require(burned[0] == _token0Amount, "unable to redeem token0");
        require(burned[1] == _token1Amount, "unable to redeem token1");
    }

    function _uniswapRedeem(
        IUniswapV2Router02 _router,
        IERC20 _token0,
        IERC20 _token1,
        uint256 _token0Amount,
        uint256 _token1Amount,
        uint256 _lpTokens,
        address _to
    ) internal {
        (uint256 redeemed0, uint256 redeemed1) = _router.removeLiquidity(
            address(_token0),
            address(_token1),
            _lpTokens,
            _token0Amount,
            _token1Amount,
            _to,
            block.timestamp + 1
        );

        require(redeemed0 == _token0Amount, "unable to redeem token0");
        require(redeemed1 == _token1Amount, "unable to redeem token1");
    }

    function depositFinished(address _spender, uint _depositId) public view returns (bool) {
        return deposits_[_spender][_depositId].redeemTimestamp > block.timestamp;
    }

    function _disableDeposit(address _spender, uint _depositId) internal {
        deposits_[_spender][_depositId].redeemTimestamp = 0;
    }

    function redeem(uint _depositId) public {
        require(depositFinished(msg.sender, _depositId), "not finished/not exist");

        Deposit memory dep = deposits_[msg.sender][_depositId];

        ISaddleSwap saddle;

        IERC20 token0 = fUsdc_;
        IERC20 token1;

        // set the saddleswap pool and token1 depending on the token pairs

        if (dep.typ == LiquidityProvided.FUSDC_USDC) {
            saddle = saddleSwapFusdcUsdc_;
            token1 = usdc_;
        } else if (dep.typ == LiquidityProvided.FUSDC_WETH) {
            saddle = saddleSwapFusdcWeth_;
            token1 = wEth_;
        } else {
            revert("incorrect liquidity provided");
        }

        (
            uint256 saddleToken0,
            uint256 camelotToken0,
            uint256 sushiToken0,

            uint256 saddleToken1,
            uint256 camelotToken1,
            uint256 sushiToken1
        ) = calculateWeights(dep.token0Amount, dep.token1Amount);

        _redeemSaddleSwap(
            saddle,
            saddleToken0,
            saddleToken1,
            dep.saddleLpMinted
        );

        _uniswapRedeem(
            camelotRouter_,
            token0,
            token1,
            camelotToken0,
            camelotToken1,
            dep.camelotLpMinted,
            msg.sender
        );

        _uniswapRedeem(
            sushiswapRouter_,
            token0,
            token1,
            sushiToken0,
            sushiToken1,
            dep.sushiswapLpMinted,
            msg.sender
        );

        _disableDeposit(msg.sender, _depositId);
    }
}
