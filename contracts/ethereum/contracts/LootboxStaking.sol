// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/ILootboxStaking.sol";
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
 * - Camelot
 * - SushiSwap
 *
 * Divided 50/50
*/

uint256 constant MAX_UINT256 = type(uint256).max;

uint256 constant MIN_LOCKUP_TIME = 31 days;

uint256 constant MAX_LOCKUP_TIME = 365 days;

/**
 * @dev UNISWAP_ACTION_MAX_TIME to max the action by
 */
uint256 constant UNISWAP_ACTION_MAX_TIME = 10 minutes;

/**
 * @dev MIN_LIQUIDITY since we split it up in half and there's a
 *      minimum liquidity of 10k
 */
uint256 constant MIN_LIQUIDITY = 20 ** 3;

enum LiquidityProvided {
    FUSDC_USDC,
    FUSDC_WETH
}

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

    LiquidityProvided typ;
}

contract Staking is ILootboxStaking {
    using SafeERC20 for IERC20;

    uint8 private version_;

    IERC20 public fusdc_;

    IERC20 public weth_;

    IERC20 public usdc_;

    IUniswapV2Router02 private camelotRouter_;

    IUniswapV2Router02 private sushiswapRouter_;

    IUniswapV2Pair private camelotFusdcUsdcPair_;

    IUniswapV2Pair private camelotFusdcWethPair_;

    IUniswapV2Pair private sushiswapFusdcUsdcPair_;

    IUniswapV2Pair private sushiswapFusdcWethPair_;

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

        camelotFusdcUsdcPair_ = _camelotFusdcUsdcPair;

        camelotFusdcWethPair_ = _camelotFusdcWethPair;

        sushiswapFusdcUsdcPair_ = _sushiswapFusdcUsdcPair;

        sushiswapFusdcWethPair_ = _sushiswapFusdcWethPair;

        camelotFusdcUsdcPair_.approve(address(_camelotRouter), MAX_UINT256);

        camelotFusdcWethPair_.approve(address(_camelotRouter), MAX_UINT256);

        sushiswapFusdcUsdcPair_.approve(address(_sushiswapRouter), MAX_UINT256);

        sushiswapFusdcWethPair_.approve(address(_sushiswapRouter), MAX_UINT256);

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
        // IERC20(_tokenB).transfer(address(this), _tokenBAmount);

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
            address(_tokenA),
            address(_tokenB),
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

    /// @inheritdoc ILootboxStaking
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

        // take the amounts given, and allocate half to camelot and half to
        // sushiswap

        require(
            fusdcUsdcPair ||
            _fusdcAmount > MIN_LIQUIDITY && _wethAmount > MIN_LIQUIDITY,
            "not enough liquidity"
        );

        uint256 tokenB = fusdcUsdcPair ? _usdcAmount : _wethAmount;

        (uint256 tokenASpent, uint256 tokenBSpent) = _deposit(
            _lockupLength,
            _fusdcAmount,
            tokenB,
            _slippage,
            msg.sender,
            fusdcUsdcPair
        );

        if (fusdcUsdcPair)
            usdcDeposited = tokenBSpent;

        else
            wethDeposited = tokenBSpent;

        emit Staked(
            msg.sender,
            _lockupLength,
            block.timestamp,
            tokenASpent,
            usdcDeposited,
            wethDeposited
        );

        return (tokenASpent, usdcDeposited, wethDeposited);
    }

    function _redeemFromUniswapV2Router(
        IUniswapV2Router02 _router,
        IERC20 _tokenB,
        uint256 _lpTokens,
        address _to
    ) internal returns (
        uint256 amountA,
        uint256 amountB
    ) {
        return _router.removeLiquidity(
            address(fusdc_),
            address(_tokenB),
            _lpTokens,
            0,
            0,
            _to,
            block.timestamp + UNISWAP_ACTION_MAX_TIME
        );
    }

    function _deleteDeposit(address _sender, uint _depositId) internal {
        deposits_[_sender][_depositId] =
            deposits_[_sender][deposits_[_sender].length - 1];

        deposits_[_sender].pop();
    }

    function _redeemCamelotSushiswap(
        Deposit memory dep,
        IERC20 _tokenB,
        address _sender
    ) internal returns (
        uint256 tokenARedeemed,
        uint256 tokenBRedeemed
    ) {
        (uint256 camelotARedeemed, uint256 camelotBRedeemed) =
            _redeemFromUniswapV2Router(
                camelotRouter_,
                _tokenB,
                dep.camelotLpMinted,
                _sender
            );

        (uint256 sushiswapARedeemed, uint256 sushiswapBRedeemed) =
            _redeemFromUniswapV2Router(
                sushiswapRouter_,
                _tokenB,
                dep.sushiswapLpMinted,
                _sender
            );

        return (
            camelotARedeemed + sushiswapARedeemed,
            camelotBRedeemed + sushiswapBRedeemed
        );
    }

    /// @inheritdoc ILootboxStaking
    function redeem() public returns (
        uint256 fusdcRedeemed,
        uint256 usdcRedeemed,
        uint256 wethRedeemed
    ) {
        Deposit memory dep;

        for (uint i = deposits_[msg.sender].length; i > 0;) {
            --i;

            dep = deposits_[msg.sender][i];

            // if the deposit we're looking at isn't finished then short circuit

            if (dep.redeemTimestamp + 1 > block.timestamp)
                continue;

            bool fusdcUsdcPair = dep.typ == LiquidityProvided.FUSDC_USDC;

            (uint256 tokenARedeemed, uint256 tokenBRedeemed) =
                _redeemCamelotSushiswap(
                    dep,
                    fusdcUsdcPair ? usdc_ : weth_,
                    msg.sender
                );

            fusdcRedeemed += tokenARedeemed;

            if (fusdcUsdcPair) usdcRedeemed += tokenBRedeemed;

            else wethRedeemed += tokenBRedeemed;

            // iterating in reverse, then deleting the deposit will let us remove
            // unneeded deposits in memory

            _deleteDeposit(msg.sender, i);
        }

        return (fusdcRedeemed, fusdcRedeemed, fusdcRedeemed);
    }

    function _uniswapPairReserves(
        IUniswapV2Pair _pair,
        IERC20 _tokenB
    ) internal view returns (
        uint256 reserveA,
        uint256 reserveB
    ) {
        (uint112 reserve0_, uint112 reserve1_,) = _pair.getReserves();

        uint256 reserve0 = uint256(reserve0_);

        uint256 reserve1 = uint256(reserve1_);

        (reserveA, reserveB) =
          address(fusdc_) < address(_tokenB)
              ? (reserve0, reserve1)
              : (reserve1, reserve0);

        return (reserveA, reserveB);
    }

    /// @inheritdoc ILootboxStaking
    function deposited(address _sender) public view returns (
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    ) {
        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            Deposit memory dep = deposits_[_sender][i];

            fusdcAmount += dep.camelotTokenA + dep.sushiswapTokenA;

            uint256 tokenBAdded = dep.camelotTokenB + dep.sushiswapTokenB;

            if (dep.typ == LiquidityProvided.FUSDC_USDC)
                usdcAmount += tokenBAdded;

            else if (dep.typ == LiquidityProvided.FUSDC_WETH)
                wethAmount += tokenBAdded;
        }

        return (fusdcAmount, usdcAmount, wethAmount);
    }

    function _redeemable(
        uint256 _tokenASupply,
        uint256 _tokenBSupply,
        uint256 _camelotLpMinted,
        uint256 _sushiswapLpMinted,
        bool _fusdcUsdcPair
    ) internal view returns (
        uint256 tokenARedeemable,
        uint256 tokenBRedeemable
    ) {
        IERC20 token = _fusdcUsdcPair ? usdc_ : weth_;

        (
            uint256 camelotTokenARedeemable,
            uint256 camelotTokenBRedeemable
        ) = _uniswapPairReserves(
            _fusdcUsdcPair ? camelotFusdcUsdcPair_ : camelotFusdcWethPair_,
            token
        );

        camelotTokenARedeemable =
            (camelotTokenARedeemable * _camelotLpMinted) / _tokenASupply;

        camelotTokenBRedeemable =
            (camelotTokenBRedeemable * _camelotLpMinted) / _tokenBSupply;

        (
            uint256 sushiswapTokenARedeemable,
            uint256 sushiswapTokenBRedeemable
        ) = _uniswapPairReserves(
            _fusdcUsdcPair ? sushiswapFusdcUsdcPair_ : sushiswapFusdcWethPair_,
            token
        );

        sushiswapTokenARedeemable =
            (sushiswapTokenARedeemable * _sushiswapLpMinted) / _tokenASupply;

        sushiswapTokenBRedeemable =
            (sushiswapTokenBRedeemable * _sushiswapLpMinted) / _tokenBSupply;

        return (
            camelotTokenARedeemable + sushiswapTokenARedeemable,
            camelotTokenBRedeemable + sushiswapTokenBRedeemable
        );
    }

    function redeemable(address _spender) public view returns (
        uint256 fusdcRedeemable,
        uint256 usdcRedeemable,
        uint256 wethRedeemable
    ) {
        uint256 fusdcSupply = fusdc_.totalSupply();
        uint256 usdcSupply = usdc_.totalSupply();
        uint256 wethSupply = weth_.totalSupply();

        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            Deposit memory dep = deposits_[_spender][i];

            if (dep.redeemTimestamp + 1 > block.timestamp) continue;

            bool fusdcUsdcPair = dep.typ == LiquidityProvided.FUSDC_USDC;

            (uint256 tokenARedeemable, uint256 tokenBRedeemable) = _redeemable(
                fusdcSupply,
                fusdcUsdcPair ? usdcSupply : wethSupply,
                dep.camelotLpMinted,
                dep.sushiswapLpMinted,
                fusdcUsdcPair
            );

            fusdcRedeemable += tokenARedeemable;

            if (fusdcUsdcPair) usdcRedeemable += tokenBRedeemable;

            else wethRedeemable += tokenBRedeemable;
        }

        return (
            fusdcRedeemable,
            usdcRedeemable,
            wethRedeemable
        );
    }
}
