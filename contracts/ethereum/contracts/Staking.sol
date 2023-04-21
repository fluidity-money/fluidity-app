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

uint256 constant MAX_UINT256 = 2 ** 256 - 1;

uint256 constant MIN_LOCKUP_TIME = 31 days;

uint256 constant MAX_LOCKUP_TIME = 365 days;

uint256 constant UNISWAP_ACTION_MAX_TIME = 1 hours;

// @notice MIN_LIQUIDITY since we split it up in half and there's a
//         minimum liquidity of 10k
uint256 constant MIN_LIQUIDITY = 20 ** 3;

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

    uint256 camelotLpMinted;
    uint256 camelotToken0;
    uint256 camelotToken1;

    uint256 sushiswapLpMinted;
    uint256 sushiswapToken0;
    uint256 sushiswapToken1;

    LiquidityProvided typ;
}

contract Staking {
    using SafeERC20 for IERC20;

    event Staked(
        address indexed spender,
        uint256 lockupLength,
        uint256 lockedTimestamp,
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    );

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
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount,
        uint256 _token0AmountMin,
        uint256 _token1AmountMin
    ) internal returns (
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
     ) {
        (amountA, amountB, liquidity) = _router.addLiquidity(
            _token0,
            _token1,
            _token0Amount,
            _token1Amount,
            _token0AmountMin,
            _token1AmountMin,
            address(this),
            block.timestamp + UNISWAP_ACTION_MAX_TIME
        );

        return (amountA, amountB, liquidity);
    }

    function calculateWeights(
        uint256 _token0Amount,
        uint256 _token1Amount
    ) public pure returns (
        uint256 camelotToken0,
        uint256 sushiToken0,

        uint256 camelotToken1,
        uint256 sushiToken1
    ) {
        camelotToken0 = (_token0Amount * 50) / 100;
        sushiToken0 = (_token0Amount * 50) / 100;

        camelotToken1 = (_token1Amount * 50) / 100;
        sushiToken1 = (_token1Amount * 50) / 100;

        return (
            camelotToken0,
            sushiToken0,

            camelotToken1,
            sushiToken1
        );
    }

    function _reduceBySlippage(
        uint256 _x,
        uint256 _slippage
    ) internal pure returns (uint256) {
        return _x - ((_x * _slippage) / 100);
    }

    function _depositTokens(
        IERC20 _token0,
        IERC20 _token1,
        uint256 _token0Amount,
        uint256 _token1Amount,
        uint256 _slippage
    ) internal returns (Deposit memory dep) {
        require(_token0Amount > MIN_DEPOSIT, "base too small");
        require(_token1Amount > MIN_DEPOSIT, "float too small");

        _token0.transferFrom(msg.sender, address(this), _token0Amount);
        _token1.transferFrom(msg.sender, address(this), _token1Amount);

        (
            uint256 camelotToken0,
            uint256 sushiToken0,

            uint256 camelotToken1,
            uint256 sushiToken1
        ) = calculateWeights(_token0Amount, _token1Amount);

        uint256 camelotToken0Min = _reduceBySlippage(camelotToken0, _slippage);
        uint256 camelotToken1Min = _reduceBySlippage(camelotToken1, _slippage);

        uint256 sushiToken0Min = _reduceBySlippage(sushiToken0, _slippage);
        uint256 sushiToken1Min = _reduceBySlippage(sushiToken1, _slippage);

        // deposit on camelot

        (
            dep.camelotToken0,
            dep.camelotToken1,
            dep.camelotLpMinted
        ) = _depositToUniswapV2Router(
            camelotRouter_,
            address(_token0),
            address(_token1),
            camelotToken0,
            camelotToken1,
            camelotToken0Min,
            camelotToken1Min
        );

        // deposit it on sushiswap

        (
            dep.sushiswapToken0,
            dep.sushiswapToken1,
            dep.sushiswapLpMinted
        ) = _depositToUniswapV2Router(
            sushiswapRouter_,
            address(fusdc_),
            address(usdc_),
            sushiToken0,
            sushiToken1,
            sushiToken0Min,
            sushiToken1Min
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
        // take the amounts given, and allocate half to camelot and half to
        // sushiswap

        require(_lockupLength + 1 > MIN_LOCKUP_TIME, "lockup length too low");
        require(_lockupLength - 1 < MAX_LOCKUP_TIME, "lockup length too high");

        // the ui should restrict the deposits to more than 100

        bool fusdcUsdcPair =
            _fusdcAmount > MIN_LIQUIDITY && _usdcAmount > MIN_LIQUIDITY;

        bool fusdcWethPair =
            _fusdcAmount > MIN_LIQUIDITY && _wethAmount > MIN_LIQUIDITY;

        require(!(fusdcUsdcPair && fusdcWethPair), "usdc or weth");

        Deposit memory dep;

        if (fusdcUsdcPair)
            dep = _depositFusdcUsdc(_fusdcAmount, _usdcAmount, _slippage);
        else
            dep = _depositFusdcWeth(_fusdcAmount, _wethAmount, _slippage);

        dep.redeemTimestamp = _lockupLength + block.timestamp;

        emit Staked(
            msg.sender,
            _lockupLength,
            block.timestamp,
            _fusdcAmount,
            _usdcAmount,
            _wethAmount
        );

        deposits_[msg.sender].push(dep);

        // the above functions should've added to the deposits so we can return
        // the latest item in the array there

        fusdcDeposited = dep.camelotToken0 + dep.sushiswapToken0;

        // depending on what was deposited, we return in different slots token 1
        // added

        if (fusdcUsdcPair)
            return (fusdcDeposited, dep.camelotToken1 + dep.sushiswapToken1, 0);

        else
            return (fusdcDeposited, 0, dep.camelotToken1 + dep.sushiswapToken1);
    }

    function _redeemFromUniswapV2Router(
        IUniswapV2Router02 _router,
        IERC20 _token1,
        uint256 _lpTokens,
        uint256 _token0Amount,
        uint256 _token1Amount,
        uint256 _slippage,
        address _to
    ) internal {
        uint256 token0WithSlippage = _reduceBySlippage(_token0Amount, _slippage);
        uint256 token1WithSlippage = _reduceBySlippage(_token1Amount, _slippage);

        (uint256 redeemed0, uint256 redeemed1) = _router.removeLiquidity(
            address(fusdc_),
            address(_token1),
            _lpTokens,
            token0WithSlippage,
            token1WithSlippage,
            _to,
            block.timestamp + UNISWAP_ACTION_MAX_TIME
        );

        require(redeemed0 + 1 > token0WithSlippage, "unable to redeem token0");

        require(redeemed1 + 1 > token1WithSlippage, "unable to redeem token1");
    }

    function depositFinished(address _spender, uint _depositId) public view returns (bool) {
        // if the current timestamp is greater than the redemption timestamp the
        // deposit is considered redeemable (finished)

        uint256 redemption = deposits_[_spender][_depositId].redeemTimestamp;

        return redemption > 0 && redemption < block.timestamp;
    }

    function _disableDeposit(address _spender, uint _depositId) internal {
        delete deposits_[_spender][_depositId];
    }

    function redeemContinue(
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount
    ) internal pure returns (
        bool,
        uint256,
        uint256,
        uint256
    ) {
        return (true, _fusdcAmount, _usdcAmount, _wethAmount);
    }

    function _redeemCamelotSushiswap(
        Deposit memory dep,
        IERC20 _token1,
        uint256 _slippage
    ) internal {
        _redeemFromUniswapV2Router(
            camelotRouter_,
            _token1,
            dep.camelotLpMinted,
            dep.camelotToken0,
            dep.camelotToken1,
            _slippage,
            msg.sender
        );

        _redeemFromUniswapV2Router(
            sushiswapRouter_,
            _token1,
            dep.sushiswapLpMinted,
            dep.sushiswapToken0,
            dep.sushiswapToken1,
            _slippage,
            msg.sender
        );
    }

    /**
     * @notice _redeem a deposit, failing to do so if the
     *         fusdc/usdc/weth amount isn't greater than the current deposit or
     *         equal to 0
     */
    function _redeem(
        uint _depositId,
        uint256 _fusdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount,
        uint256 _slippage
    ) internal returns (
        bool cont,
        uint256 fusdcRemaining,
        uint256 usdcRemaining,
        uint256 wethRemaining
    ) {

        // if the deposit we're looking at isn't finished then short circuit

        if (!depositFinished(msg.sender, _depositId)) return redeemContinue(
            _fusdcAmount,
            _usdcAmount,
            _wethAmount
        );

        Deposit memory dep = deposits_[msg.sender][_depositId];

        // set token1 depending on the token pairs

        // if the amount given isn't greater than token1 added together, then break

        uint256 token0PastDeposit = dep.camelotToken0 + dep.sushiswapToken0;

        uint256 token1PastDeposit = dep.camelotToken1 + dep.sushiswapToken1;

        uint256 token0Remaining = _fusdcAmount - token0PastDeposit;

        uint256 token1Remaining = _usdcAmount - token1PastDeposit;

        // check that the fusdc requested to pull out is equal to or
        // greater than the amount in this deposit

        if (token0PastDeposit > _fusdcAmount) return redeemContinue(
            _fusdcAmount,
            _usdcAmount,
            _wethAmount
        );

        // pick the token and make sure that there's enough liquidity

        if (dep.typ == LiquidityProvided.FUSDC_USDC) {
            // if the deposited usdc isn't greater or equal than camelot/sushiswap
            // usdc, we won't partially reduce the liquidity here, so return

            if (token1PastDeposit > _usdcAmount) return redeemContinue(
                _fusdcAmount,
                _usdcAmount,
                _wethAmount
            );

            _redeemCamelotSushiswap(dep, usdc_, _slippage);
        }

        else if (dep.typ == LiquidityProvided.FUSDC_WETH) {
            // if the deposited weth isn't greater or equal than camelot/sushiswap
            // weth, we won't partially reduce the liquidity here, so break

            if (token1PastDeposit > _wethAmount) return redeemContinue(
                _fusdcAmount,
                _usdcAmount,
                _wethAmount
            );

            _redeemCamelotSushiswap(dep, weth_, _slippage);
        }

        else revert("unusual liquidity provided");

        // disable deposit uses delete to delete the deposit

        _disableDeposit(msg.sender, _depositId);

        if (dep.typ == LiquidityProvided.FUSDC_USDC) {
            return (
                true,
                token0Remaining,
                token1Remaining,
                0
            );
        }

        else {
            return (
                true,
                token0PastDeposit,
                0,
                token1Remaining
            );
        }
    }

    function deposited() public view returns (
        uint256 fusdcAmount,
        uint256 usdcAmount,
        uint256 wethAmount
    ) {
        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            Deposit memory dep = deposits_[msg.sender][i];

            fusdcAmount += dep.camelotToken0 + dep.sushiswapToken0;

            uint256 token1Added = dep.camelotToken1 + dep.sushiswapToken1;

            if (dep.typ == LiquidityProvided.FUSDC_USDC)
                usdcAmount += token1Added;

            else if (dep.typ == LiquidityProvided.FUSDC_WETH)
                wethAmount += token1Added;
        }

        return (fusdcAmount, usdcAmount, wethAmount);
    }

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
        require(deposits_[msg.sender].length > 0, "no deposits");

        bool cont;

        for (uint depositId = 0; depositId < deposits_[msg.sender].length; ++depositId) {
            (
                cont,
                _fusdcAmount,
                _usdcAmount,
                _wethAmount
            ) = _redeem(
                depositId,
                _fusdcAmount,
                _usdcAmount,
                _wethAmount,
                _slippage
            );

            if (!cont) break;

            if (_fusdcAmount == 0) break;

            if (_usdcAmount == 0 && _wethAmount == 0) break;
        }

        return (_fusdcAmount, _usdcAmount, _wethAmount);
    }
}
