// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IToken.sol";

import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IUniswapV2Pair.sol";

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

uint256 constant MAX_UINT256 = type(uint256).max;

uint256 constant MIN_LOCKUP_TIME = 31 days;

uint256 constant MAX_LOCKUP_TIME = 365 days;

uint256 constant UNISWAP_ACTION_MAX_TIME = 1 hours;

// @notice MIN_LIQUIDITY since we split it up in half and there's a
//         minimum liquidity of 10k
uint256 constant MIN_LIQUIDITY = 20 ** 3;

enum LiquidityProvided {
    FUSDC_USDC,
    FUSDC_WETH
}

/// @notice Deposit made by a user
struct Deposit {
    uint256 redeemTimestamp;

    uint256 camelotLpMinted;
    uint256 camelotTokenA;
    uint256 camelotTokenB;

    uint256 sushiswapLpMinted;
    uint256 sushiswapTokenA;
    uint256 sushiswapTokenB;

    LiquidityProvided typ;
}

contract Staking is IStaking {
    using SafeERC20 for IERC20;

    uint8 private version_;

    IERC20 private fusdc_;

    IERC20 private weth_;

    IERC20 private usdc_;

    IUniswapV2Router02 private camelotRouter_;

    IUniswapV2Router02 private sushiswapRouter_;

    mapping (address => Deposit[]) private deposits_;

    function init(
        IERC20 _fusdc,
        IERC20 _usdc,
        IERC20 _weth,
        IUniswapV2Router02 _camelotRouter,
        IUniswapV2Router02 _sushiswapRouter,
        IUniswapV2Pair _camelotFusdcUsdcPair,
        IUniswapV2Pair _camelotFusdcWethPair,
        IUniswapV2Pair _sushiswapFusdcUsdcPair,
        IUniswapV2Pair _sushiswapFusdcWethPair
    ) public {
        require(version_ == 0, "already initialised");

        fusdc_ = _fusdc;
        usdc_ = _usdc;
        weth_ = _weth;

        camelotRouter_ = _camelotRouter;

        sushiswapRouter_ = _sushiswapRouter;

        fusdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        usdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        weth_.safeApprove(address(camelotRouter_), MAX_UINT256);

        fusdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        usdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        weth_.safeApprove(address(sushiswapRouter_), MAX_UINT256);

        _camelotFusdcUsdcPair.approve(address(_camelotRouter), MAX_UINT256);

        _camelotFusdcWethPair.approve(address(_camelotRouter), MAX_UINT256);

        _sushiswapFusdcUsdcPair.approve(address(_sushiswapRouter), MAX_UINT256);

        _sushiswapFusdcWethPair.approve(address(_sushiswapRouter), MAX_UINT256);

        version_ = 1;
    }

    function _depositToUniswapV2Router(
        IUniswapV2Router02 _router,
        address _tokenA,
        address _tokenB,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount,
        uint256 _tokenAAmountMin,
        uint256 _tokenBAmountMin
    ) internal returns (
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
     ) {
        (amountA, amountB, liquidity) = _router.addLiquidity(
            _tokenA,
            _tokenB,
            _tokenAAmount,
            _tokenBAmount,
            _tokenAAmountMin,
            _tokenBAmountMin,
            address(this),
            block.timestamp + UNISWAP_ACTION_MAX_TIME
        );

        return (amountA, amountB, liquidity);
    }

    function _calculateWeights(
        uint256 _tokenAAmount,
        uint256 _tokenBAmount
    ) internal pure returns (
        uint256 camelotTokenA,
        uint256 sushiTokenA,

        uint256 camelotTokenB,
        uint256 sushiTokenB
    ) {
        camelotTokenA = _tokenAAmount / 2;
        camelotTokenB = _tokenBAmount / 2;

        // we take from the original amount so we don't end up with dust

        return (
            camelotTokenA,
            _tokenAAmount - camelotTokenA, // sushiswap

            camelotTokenB,
            _tokenBAmount - camelotTokenB // sushiswap
        );
    }

    function _reduceBySlippage(
        uint256 _x,
        uint256 _slippage
    ) internal pure returns (uint256) {
        return _x - ((_x * _slippage) / 100);
    }

    function _depositTokens(
        IERC20 _tokenA,
        IERC20 _tokenB,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount,
        uint256 _slippage
    ) internal returns (Deposit memory dep) {
        (
            uint256 camelotTokenA,
            uint256 sushiTokenA,

            uint256 camelotTokenB,
            uint256 sushiTokenB
        ) = _calculateWeights(_tokenAAmount, _tokenBAmount);

        uint256 camelotTokenAMin = _reduceBySlippage(camelotTokenA, _slippage);
        uint256 camelotTokenBMin = _reduceBySlippage(camelotTokenB, _slippage);

        uint256 sushiTokenAMin = _reduceBySlippage(sushiTokenA, _slippage);
        uint256 sushiTokenBMin = _reduceBySlippage(sushiTokenB, _slippage);

        // deposit on camelot

        (
            dep.camelotTokenA,
            dep.camelotTokenB,
            dep.camelotLpMinted
        ) = _depositToUniswapV2Router(
            camelotRouter_,
            address(_tokenA),
            address(_tokenB),
            camelotTokenA,
            camelotTokenB,
            camelotTokenAMin,
            camelotTokenBMin
        );

        // deposit it on sushiswap

        (
            dep.sushiswapTokenA,
            dep.sushiswapTokenB,
            dep.sushiswapLpMinted
        ) = _depositToUniswapV2Router(
            sushiswapRouter_,
            address(fusdc_),
            address(usdc_),
            sushiTokenA,
            sushiTokenB,
            sushiTokenAMin,
            sushiTokenBMin
        );

        return dep;
    }

    function _depositFusdcUsdc(
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _slippage
    ) internal returns (Deposit memory dep) {
        dep = _depositTokens(
            fusdc_,
            usdc_,
            _fusdcAmount,
            _usdcAmount,
            _slippage
        );

        dep.typ = LiquidityProvided.FUSDC_USDC;

        return dep;
    }

    function _depositFusdcWeth(
        uint256 _fusdcAmount,
        uint256 _wethAmount,
        uint256 _slippage
    ) internal returns (Deposit memory dep) {
        dep = _depositTokens(
            fusdc_,
            weth_,
            _fusdcAmount,
            _wethAmount,
            _slippage
        );

        dep.typ = LiquidityProvided.FUSDC_WETH;

        return dep;
    }

    function _deposit(
        uint256 _lockupLength,
        uint256 _fusdc,
        uint256 _tokenB,
        uint256 _slippage,
        address _sender,
        bool _fusdcUsdcPair
    ) internal returns (
        uint256 tokenADeposited,
        uint256 tokenBDeposited
    ) {
        IERC20 token = _fusdcUsdcPair ? usdc_ : weth_;

        uint256 tokenABefore = fusdc_.balanceOf(address(this));

        uint256 tokenBBefore = token.balanceOf(address(this));

        fusdc_.transferFrom(_sender, address(this), _fusdc);

        token.transferFrom(_sender, address(this), _tokenB);

        Deposit memory dep;

        if (_fusdcUsdcPair)
            dep = _depositFusdcUsdc(_fusdc, _tokenB, _slippage);

        else
            dep = _depositFusdcWeth(_fusdc, _tokenB, _slippage);

        uint256 tokenAAfter = fusdc_.balanceOf(address(this));

        uint256 tokenBAfter = token.balanceOf(address(this));

        dep.redeemTimestamp = _lockupLength + block.timestamp;

        deposits_[_sender].push(dep);

        // refund the user any amounts not used

        if (tokenAAfter > tokenABefore)
            fusdc_.transfer(_sender, tokenAAfter - tokenABefore);

        if (tokenBAfter > tokenBBefore)
            token.transfer(_sender, tokenBAfter - tokenBBefore);

        // return the amount that we deposited

        tokenADeposited = dep.camelotTokenA + dep.sushiswapTokenA;

        tokenBDeposited = dep.camelotTokenB + dep.sushiswapTokenB;

        return (tokenADeposited, tokenBDeposited);
    }

    /// @inheritdoc IStaking
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
    ) {
        require(_lockupLength + 1 > MIN_LOCKUP_TIME, "lockup length too low");
        require(_lockupLength < MAX_LOCKUP_TIME + 1, "lockup length too high");

        // the ui should restrict the deposits to more than 100

        bool fusdcUsdcPair =
            _fusdcAmount > MIN_LIQUIDITY && _usdcAmount > MIN_LIQUIDITY;

        bool fusdcWethPair =
            _fusdcAmount > MIN_LIQUIDITY && _wethAmount > MIN_LIQUIDITY;

        // take the amounts given, and allocate half to camelot and half to
        // sushiswap

        require(!(fusdcUsdcPair && fusdcWethPair), "usdc or weth");

        uint256 tokenB = fusdcUsdcPair ? _usdcAmount : _wethAmount;

        (uint256 tokenASpent, uint256 tokenBSpent) = _deposit(
            _lockupLength,
            _fusdcAmount,
            tokenB,
            _slippage,
            msg.sender,
            fusdcUsdcPair
        );

        // reuse the arguments to save on stack space

        if (fusdcUsdcPair) {
            _usdcAmount = tokenBSpent;
            _wethAmount = 0;
        } else {
            _wethAmount = tokenBSpent;
            _usdcAmount = 0;
        }

        emit Staked(
            msg.sender,
            _lockupLength,
            block.timestamp,
            tokenASpent,
            _usdcAmount,
            _wethAmount
        );

        return (_fusdcAmount, _usdcAmount, _wethAmount);
    }

    function _redeemFromUniswapV2Router(
        IUniswapV2Router02 _router,
        IERC20 _tokenB,
        uint256 _lpTokens,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount,
        uint256 _slippage,
        address _to
    ) internal {
        uint256 tokenAWithSlippage = _reduceBySlippage(_tokenAAmount, _slippage);
        uint256 tokenBWithSlippage = _reduceBySlippage(_tokenBAmount, _slippage);

        (uint256 redeemed0, uint256 redeemed1) = _router.removeLiquidity(
            address(fusdc_),
            address(_tokenB),
            _lpTokens,
            tokenAWithSlippage,
            tokenBWithSlippage,
            _to,
            block.timestamp + UNISWAP_ACTION_MAX_TIME
        );

        require(redeemed0 + 1 > tokenAWithSlippage, "unable to redeem tokenA");

        require(redeemed1 + 1 > tokenBWithSlippage, "unable to redeem tokenB");
    }

    function _disableDeposit(address _spender, uint _depositId) internal {
        deposits_[_spender][_depositId] =
            deposits_[_spender][deposits_[_spender].length - 1];

        deposits_[_spender].pop();
    }

    function _redeemContinue(
        uint256 _fusdcAmount,
        uint256 _tokenBAmount
    ) internal pure returns (
        bool,
        uint256,
        uint256
    ) {
        return (false, _fusdcAmount, _tokenBAmount);
    }

    function _redeemCamelotSushiswap(
        Deposit memory dep,
        IERC20 _tokenB,
        address _spender,
        uint256 _slippage
    ) internal {
        _redeemFromUniswapV2Router(
            camelotRouter_,
            _tokenB,
            dep.camelotLpMinted,
            dep.camelotTokenA,
            dep.camelotTokenB,
            _slippage,
            _spender
        );

        _redeemFromUniswapV2Router(
            sushiswapRouter_,
            _tokenB,
            dep.sushiswapLpMinted,
            dep.sushiswapTokenA,
            dep.sushiswapTokenB,
            _slippage,
            _spender
        );
    }

    /**
     * @notice _redeem a deposit, failing to do so if the
     *         fusdc/usdc/weth amount isn't greater than the current deposit or
     *         equal to 0
     */
    function _redeem(
        uint256 _slippage,
        Deposit memory _dep,
        address _spender,
        bool _fusdcUsdcPair
    ) internal {
        if (_fusdcUsdcPair)
            _redeemCamelotSushiswap(_dep, usdc_, _spender, _slippage);
        else
            _redeemCamelotSushiswap(_dep, weth_, _spender, _slippage);
    }

    /// @inheritdoc IStaking
    function redeem(
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount,
        uint256 _slippage
    ) public returns (
        uint256 fusdcRemaining,
        uint256 usdcRemaining,
        uint256 wethRemaining
    ) {
        Deposit memory dep;

        uint256 tokenBRemaining;

        fusdcRemaining = _fusdcAmount;
        usdcRemaining = _usdcAmount;
        wethRemaining = _wethAmount;

        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            dep = deposits_[msg.sender][i];

            // if the deposit we're looking at isn't finished then short circuit

            if (dep.redeemTimestamp + 1 > block.timestamp)
                continue;

            bool fusdcUsdcPair = dep.typ == LiquidityProvided.FUSDC_USDC;

            tokenBRemaining = fusdcUsdcPair ? usdcRemaining : wethRemaining;

            uint256 tokenAPastDeposit = dep.camelotTokenA + dep.sushiswapTokenA;

            uint256 tokenBPastDeposit = dep.camelotTokenB + dep.sushiswapTokenB;

            // check that the fusdc requested to pull out is equal to or
            // greater than the amount in this deposit

            if (tokenAPastDeposit > fusdcRemaining) continue;

            // if the amount deposited for the second token is greater than what we
            // can redeem, then we stop so the user can try again with a separate
            // transaction that's larger

            if (fusdcUsdcPair && tokenBPastDeposit > usdcRemaining) continue;

            else if (tokenBPastDeposit > wethRemaining) break;

            _redeem(_slippage, dep, msg.sender, fusdcUsdcPair);

            fusdcRemaining -= tokenAPastDeposit;

            tokenBRemaining -= tokenBPastDeposit;

            if (fusdcUsdcPair) usdcRemaining = tokenBRemaining;

            else wethRemaining = tokenBRemaining;

            _disableDeposit(msg.sender, i);

            if (fusdcRemaining == 0 || tokenBRemaining == 0) break;
        }

        return (fusdcRemaining, usdcRemaining, wethRemaining);
    }

    /// @inheritdoc IStaking
    function deposited(address _spender) public view returns (
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    ) {
        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            Deposit memory dep = deposits_[_spender][i];

            fusdcAmount += dep.camelotTokenA + dep.sushiswapTokenA;

            uint256 tokenBAdded = dep.camelotTokenB + dep.sushiswapTokenB;

            if (dep.typ == LiquidityProvided.FUSDC_USDC)
                usdcAmount += tokenBAdded;

            else if (dep.typ == LiquidityProvided.FUSDC_WETH)
                wethAmount += tokenBAdded;
        }

        return (fusdcAmount, usdcAmount, wethAmount);
    }
}
