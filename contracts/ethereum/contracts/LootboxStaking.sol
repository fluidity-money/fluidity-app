// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/ILootboxStaking.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IToken.sol";

import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IUniswapV2Pair.sol";

import "../interfaces/ISushiswapStablePool.sol";
import "../interfaces/ISushiswapBentoBox.sol";

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
 * - Camelot
 * - SushiSwap
 *
 * Divided 50/50
*/

uint256 constant MAX_UINT256 = type(uint256).max;

uint256 constant MIN_LOCKUP_TIME = 31 days;

uint256 constant MAX_LOCKUP_TIME = 365 days;

/**
 * @dev MIN_LIQUIDITY since we split it up in half and there's a
 *      minimum liquidity of 10k
 */
uint256 constant MIN_LIQUIDITY = 1e18 * 2;

contract LootboxStaking is ILootboxStaking, IOperatorOwned, IEmergencyMode {
    using SafeERC20 for IERC20;

    uint8 private version_;

    address private operator_;

    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    IERC20 public fusdc_;

    IERC20 public weth_;

    IERC20 public usdc_;

    IUniswapV2Router02 public camelotRouter_;

    ISushiswapBentoBox public sushiswapBentoBox_;

    // we don't use a sushiswap router since it doesn't do much aside from check amounts

    ISushiswapStablePool public sushiswapFusdcUsdcPool_;

    ISushiswapStablePool public sushiswapFusdcWethPool_;

    IUniswapV2Pair public camelotFusdcUsdcPair_;

    IUniswapV2Pair public camelotFusdcWethPair_;

    mapping (address => Deposit[]) private deposits_;

    // lp tokens provided by users that we don't touch

    uint256 public camelotFusdcUsdcDepositedLpTokens_;

    uint256 public camelotFusdcWethDepositedLpTokens_;

    uint256 public sushiswapFusdcUsdcDepositedLpTokens_;

    uint256 public sushiswapFusdcWethDepositedLpTokens_;

    function init(
        address _operator,
        address _emergencyCouncil,
        IERC20 _fusdc,
        IERC20 _usdc,
        IERC20 _weth,
        IUniswapV2Router02 _camelotRouter,
        ISushiswapBentoBox _sushiswapBentoBox,
        IUniswapV2Pair _camelotFusdcUsdcPair,
        IUniswapV2Pair _camelotFusdcWethPair,
        ISushiswapStablePool _sushiswapFusdcUsdcPool,
        ISushiswapStablePool _sushiswapFusdcWethPool
    ) public {
        require(version_ == 0, "already initialised");

        version_ = 1;

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;

        noEmergencyMode_ = true;

        fusdc_ = _fusdc;
        usdc_ = _usdc;
        weth_ = _weth;

        camelotRouter_ = _camelotRouter;

        sushiswapBentoBox_ = _sushiswapBentoBox;

        camelotFusdcUsdcPair_ = _camelotFusdcUsdcPair;

        camelotFusdcWethPair_ = _camelotFusdcWethPair;

        sushiswapFusdcUsdcPool_ = _sushiswapFusdcUsdcPool;

        sushiswapFusdcWethPool_ = _sushiswapFusdcWethPool;

        _enableApprovals();
    }

    /* ~~~~~~~~~~ INTERNAL DEPOSIT FUNCTIONS ~~~~~~~~~~ */

    function _depositToUniswapV2Router(
        IUniswapV2Router02 _router,
        address _tokenA,
        address _tokenB,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount,
        uint256 _tokenAAmountMin,
        uint256 _tokenBAmountMin,
        uint256 _timestamp
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
            _timestamp
        );

        return (amountA, amountB, liquidity);
    }

    function _depositToSushiswapPool(
        ISushiswapStablePool _pool,
        IERC20 _tokenA,
        IERC20 _tokenB,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount
    ) internal returns (uint256 liquidity) {
        // we don't track the liquidity from the bentobox since it's transferred
        // to the pool which then returns it's liquidity

        sushiswapBentoBox_.deposit(
            _tokenA,
            address(this),
            address(_pool),
            _tokenAAmount,
            0
        );

        sushiswapBentoBox_.deposit(
            _tokenB,
            address(this),
            address(_pool),
            _tokenBAmount,
            0
        );

        liquidity = _pool.mint(abi.encode(address(this)));

        return liquidity;
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

    function _hasEnoughWethLiquidity(
        uint256 _fusdcAmount,
        uint256 _wethAmount
    ) internal pure returns (bool) {
        return _fusdcAmount + 1 > MIN_LIQUIDITY && _wethAmount + 1 > MIN_LIQUIDITY;
    }

    function _depositTokens(
        IERC20 _tokenA,
        IERC20 _tokenB,
        ISushiswapStablePool _sushiswapPool,
        uint256 _tokenAAmount,
        uint256 _tokenBAmount,
        uint256 _slippage,
        uint256 _timestamp
    ) internal returns (Deposit memory dep) {
        (
            uint256 camelotTokenA,
            uint256 sushiTokenA,

            uint256 camelotTokenB,
            uint256 sushiTokenB
        ) = _calculateWeights(_tokenAAmount, _tokenBAmount);

        uint256 camelotTokenAMin = _reduceBySlippage(camelotTokenA, _slippage);
        uint256 camelotTokenBMin = _reduceBySlippage(camelotTokenB, _slippage);

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
            camelotTokenBMin,
            _timestamp
        );

        // deposit it on sushiswap

        dep.sushiswapLpMinted = _depositToSushiswapPool(
            _sushiswapPool,
            _tokenA,
            _tokenB,
            sushiTokenA,
            sushiTokenB
        );

        dep.sushiswapTokenA = sushiTokenA;
        dep.sushiswapTokenB = sushiTokenB;

        return dep;
    }

    function _deposit(
        uint256 _lockupLength,
        uint256 _fusdcAmount,
        uint256 _tokenBAmount,
        uint256 _slippage,
        uint256 _timestamp,
        address _sender,
        IERC20 _tokenB,
        bool _fusdcUsdcPair
    ) internal returns (
        uint256 tokenADeposited,
        uint256 tokenBDeposited
    ) {
        uint256 tokenABefore = fusdc_.balanceOf(address(this));

        uint256 tokenBBefore = _tokenB.balanceOf(address(this));

        fusdc_.transferFrom(_sender, address(this), _fusdcAmount);

        _tokenB.transferFrom(_sender, address(this), _tokenBAmount);

        Deposit memory dep;

        dep = _depositTokens(
            fusdc_,
            _fusdcUsdcPair ? usdc_ : weth_,
            _fusdcUsdcPair ? sushiswapFusdcUsdcPool_ : sushiswapFusdcWethPool_,
            _fusdcAmount,
            _tokenBAmount,
            _slippage,
            _timestamp
        );

        dep.fusdcUsdcPair = _fusdcUsdcPair;

        uint256 tokenAAfter = fusdc_.balanceOf(address(this));

        uint256 tokenBAfter = _tokenB.balanceOf(address(this));

        dep.redeemTimestamp = _lockupLength + block.timestamp;

        if (_fusdcUsdcPair) {
            camelotFusdcUsdcDepositedLpTokens_ += dep.camelotLpMinted;
            sushiswapFusdcUsdcDepositedLpTokens_ += dep.sushiswapLpMinted;
        } else {
            camelotFusdcWethDepositedLpTokens_ += dep.camelotLpMinted;
            sushiswapFusdcWethDepositedLpTokens_ += dep.sushiswapLpMinted;
        }

        deposits_[_sender].push(dep);

        // refund the user any amounts not used

        if (tokenAAfter > tokenABefore)
            fusdc_.transfer(_sender, tokenAAfter - tokenABefore);

        if (tokenBAfter > tokenBBefore)
            _tokenB.transfer(_sender, tokenBAfter - tokenBBefore);

        // return the amount that we deposited

        require(tokenABefore + 1 > tokenAAfter, "token A not drained");

        require(tokenBBefore + 1 > tokenBAfter, "token B not drained");

        tokenADeposited = dep.camelotTokenA + dep.sushiswapTokenA;

        tokenBDeposited = dep.camelotTokenB + dep.sushiswapTokenB;

        return (tokenADeposited, tokenBDeposited);
    }

    /* ~~~~~~~~~~ INTERNAL REDEEM FUNCTIONS ~~~~~~~~~~ */

    function _redeemFromUniswapV2Router(
        IUniswapV2Router02 _router,
        IERC20 _tokenB,
        uint256 _lpTokens,
        uint256 _timestamp,
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
            _timestamp
        );
    }

    function _redeemFromSushiswapPool(
        ISushiswapStablePool _pool,
        IERC20 _tokenB,
        uint256 _lpTokens,
        address _recipient
    ) internal returns (
        uint256 sushiswapARedeemed,
        uint256 sushiswapBRedeemed
    ) {
        uint256 sushiswapABefore = fusdc_.balanceOf(address(this));
        uint256 sushiswapBBefore = _tokenB.balanceOf(address(this));

        _pool.transfer(address(_pool), _lpTokens);

        // unwrap the bento (the true) so we get the funds back into the contract
        _pool.burn(abi.encode(address(this), true));

        uint256 sushiswapAAfter = fusdc_.balanceOf(address(this));
        uint256 sushiswapBAfter = _tokenB.balanceOf(address(this));

        require(sushiswapAAfter > sushiswapABefore, "sushiswap token A no return");
        require(sushiswapBAfter > sushiswapBBefore, "sushiswap token B no return");

        uint256 tokenADiff = sushiswapAAfter - sushiswapABefore;

        uint256 tokenBDiff = sushiswapBAfter - sushiswapBBefore;

        fusdc_.safeTransfer(_recipient, tokenADiff);

        _tokenB.safeTransfer(_recipient, tokenBDiff);

        return (tokenADiff, tokenBDiff);
    }

    function _deleteDeposit(address _sender, uint _depositId) internal {
        deposits_[_sender][_depositId] =
            deposits_[_sender][deposits_[_sender].length - 1];

        deposits_[_sender].pop();
    }

    function _redeemCamelotSushiswap(
        Deposit memory dep,
        IERC20 _tokenB,
        ISushiswapStablePool _sushiswapPool,
        uint256 _timestamp,
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
                _timestamp,
                _sender
            );

        (uint256 sushiswapARedeemed, uint256 sushiswapBRedeemed) =
            _redeemFromSushiswapPool(
                _sushiswapPool,
                _tokenB,
                dep.sushiswapLpMinted,
                _sender
            );

        return (
            camelotARedeemed + sushiswapARedeemed,
            camelotBRedeemed + sushiswapBRedeemed
        );
    }

    /* ~~~~~~~~~~ INTERNAL REDEEMABLE FUNCTIONS ~~~~~~~~~~ */

    function _redeemable(
        uint256 _camelotSupply,
        uint256 _camelotLpMinted,
        uint256 _sushiswapSupply,
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
            _camelotLpMinted * camelotTokenARedeemable / _camelotSupply;

        camelotTokenBRedeemable =
            _camelotLpMinted * camelotTokenBRedeemable / _camelotSupply;

        (
            uint256 sushiswapTokenARedeemable,
            uint256 sushiswapTokenBRedeemable
        ) = _sushiswapPoolReserves(
            _fusdcUsdcPair ? sushiswapFusdcUsdcPool_ : sushiswapFusdcWethPool_,
            token
        );

        sushiswapTokenARedeemable =
            _sushiswapLpMinted * sushiswapTokenARedeemable / _sushiswapSupply;

        sushiswapTokenBRedeemable =
            _sushiswapLpMinted * sushiswapTokenBRedeemable / _sushiswapSupply;

        return (
            camelotTokenARedeemable + sushiswapTokenARedeemable,
            camelotTokenBRedeemable + sushiswapTokenBRedeemable
        );
    }

    /* ~~~~~~~~~~ EXTERNAL FUNCTIONS ~~~~~~~~~~ */

    /// @inheritdoc ILootboxStaking
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
    ) {
        require(noEmergencyMode_, "emergency mode");

        if (_maxTimestamp == 0) _maxTimestamp = block.timestamp;

        require(block.timestamp < _maxTimestamp + 1, "exceeded time");

        require(_lockupLength + 1 > MIN_LOCKUP_TIME, "lockup length too low");
        require(_lockupLength < MAX_LOCKUP_TIME + 1, "lockup length too high");

        require(_slippage < 101, "slippage too high");

        // the ui should restrict the deposits to more than 1e18

        bool fusdcUsdcPair =
            _fusdcAmount + 1 > MIN_LIQUIDITY && _usdcAmount + 1 > MIN_LIQUIDITY;

        // take the amounts given, and allocate half to camelot and half to
        // sushiswap

        require(
            fusdcUsdcPair || _hasEnoughWethLiquidity(_fusdcAmount, _wethAmount),
            "not enough liquidity"
        );

        uint256 tokenBAmount = fusdcUsdcPair ? _usdcAmount : _wethAmount;

        IERC20 tokenB = fusdcUsdcPair ? usdc_ : weth_;

        (uint256 tokenASpent, uint256 tokenBSpent) = _deposit(
            _lockupLength,
            _fusdcAmount,
            tokenBAmount,
            _slippage,
            _maxTimestamp,
            msg.sender,
            tokenB,
            fusdcUsdcPair
        );

        require(tokenASpent > 0, "0 of token A was consumed");
        require(tokenBSpent > 0, "0 of token B was consumed");

        if (fusdcUsdcPair) usdcDeposited = tokenBSpent;

        else wethDeposited = tokenBSpent;

        emit Deposited(
            msg.sender,
            _lockupLength,
            block.timestamp,
            tokenASpent,
            usdcDeposited,
            wethDeposited
        );

        return (tokenASpent, usdcDeposited, wethDeposited);
    }

    /// @inheritdoc ILootboxStaking
    function redeem(uint256 _maxTimestamp) public returns (
        uint256 fusdcRedeemed,
        uint256 usdcRedeemed,
        uint256 wethRedeemed
    ) {
        require(noEmergencyMode_, "emergency mode");

        if (_maxTimestamp == 0) _maxTimestamp = block.timestamp;

        require(block.timestamp < _maxTimestamp + 1, "exceeded time");

        Deposit memory dep;

        for (uint i = deposits_[msg.sender].length; i > 0;) {
            --i;

            dep = deposits_[msg.sender][i];

            // if the deposit we're looking at isn't finished then short circuit

            if (dep.redeemTimestamp + 1 > block.timestamp)
                continue;

            bool fusdcUsdcPair = dep.fusdcUsdcPair;

            (uint256 tokenARedeemed, uint256 tokenBRedeemed) =
                _redeemCamelotSushiswap(
                    dep,
                    fusdcUsdcPair ? usdc_ : weth_,
                    fusdcUsdcPair ? sushiswapFusdcUsdcPool_ : sushiswapFusdcWethPool_,
                    _maxTimestamp,
                    msg.sender
                );

            if (fusdcUsdcPair) {
                camelotFusdcUsdcDepositedLpTokens_ -= dep.camelotLpMinted;
                sushiswapFusdcUsdcDepositedLpTokens_ -= dep.sushiswapLpMinted;
            } else {
                camelotFusdcWethDepositedLpTokens_ -= dep.camelotLpMinted;
                sushiswapFusdcWethDepositedLpTokens_ -= dep.sushiswapLpMinted;
            }

            fusdcRedeemed += tokenARedeemed;

            if (fusdcUsdcPair) usdcRedeemed += tokenBRedeemed;

            else wethRedeemed += tokenBRedeemed;

            // iterating in reverse, then deleting the deposit will let us remove
            // unneeded deposits in memory

            emit Deposited(
                msg.sender,
                dep.redeemTimestamp,
                block.timestamp,
                tokenARedeemed,
                fusdcUsdcPair ? tokenBRedeemed : 0,
                fusdcUsdcPair ? 0 : tokenBRedeemed
            );

            _deleteDeposit(msg.sender, i);
        }

        return (fusdcRedeemed, fusdcRedeemed, fusdcRedeemed);
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

            if (dep.fusdcUsdcPair) usdcAmount += tokenBAdded;
            else wethAmount += tokenBAdded;
        }

        return (fusdcAmount, usdcAmount, wethAmount);
    }

    function redeemable(address _spender) public view returns (
        uint256 fusdcRedeemable,
        uint256 usdcRedeemable,
        uint256 wethRedeemable
    ) {
        uint256 camelotFusdcUsdcSupply = camelotFusdcUsdcPair_.totalSupply();
        uint256 camelotFusdcWethSupply = camelotFusdcWethPair_.totalSupply();

        uint256 sushiswapFusdcUsdcSupply = camelotFusdcUsdcPair_.totalSupply();
        uint256 sushiswapFusdcWethSupply = camelotFusdcWethPair_.totalSupply();

        for (uint i = 0; i < deposits_[msg.sender].length; ++i) {
            Deposit memory dep = deposits_[_spender][i];

            if (dep.redeemTimestamp + 1 > block.timestamp) continue;

            bool fusdcUsdcPair = dep.fusdcUsdcPair;

            (uint256 tokenARedeemable, uint256 tokenBRedeemable) = _redeemable(
                fusdcUsdcPair ? camelotFusdcUsdcSupply : camelotFusdcWethSupply,
                dep.camelotLpMinted,
                fusdcUsdcPair ? sushiswapFusdcUsdcSupply : sushiswapFusdcWethSupply,
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

    function deposits(address _spender) public view returns (Deposit[] memory) {
        return deposits_[_spender];
    }

    /// @inheritdoc ILootboxStaking
    function ratios() public view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio,
        uint256 fusdcUsdcSpread,
        uint256 fusdcWethSpread
    ) {
        (uint256 camelotFusdcUsdcRatio, uint256 camelotFusdcWethRatio) =
            _camelotRatios();

        (uint256 sushiswapFusdcUsdcRatio, uint256 sushiswapFusdcWethRatio) =
            _sushiswapRatios();

        // assume that the weights are constant regardless of the underlying liquidity (for now)

        fusdcUsdcRatio = (camelotFusdcUsdcRatio / 2) + (sushiswapFusdcUsdcRatio / 2);

        fusdcWethRatio = (camelotFusdcWethRatio / 2) + (sushiswapFusdcWethRatio / 2);

        if (camelotFusdcUsdcRatio > sushiswapFusdcUsdcRatio) {
            fusdcUsdcSpread = camelotFusdcUsdcRatio - sushiswapFusdcUsdcRatio;
        } else {
            fusdcUsdcSpread = sushiswapFusdcUsdcRatio - camelotFusdcUsdcRatio;
        }

        if (camelotFusdcWethRatio > sushiswapFusdcWethRatio) {
            fusdcWethSpread = camelotFusdcWethRatio - sushiswapFusdcWethRatio;
        } else {
            fusdcWethSpread = sushiswapFusdcWethRatio - camelotFusdcWethRatio;
        }

        return (
            fusdcUsdcRatio,
            fusdcWethRatio,
            fusdcUsdcSpread,
            fusdcWethSpread
        );
    }

    /* ~~~~~~~~~~ INTERNAL APPROVAL FUNCTIONS ~~~~~~~~~~ */

    function _enableApprovals() internal {
        fusdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        usdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        weth_.safeApprove(address(camelotRouter_), MAX_UINT256);

        // can't use safe approve for the pairs

        camelotFusdcUsdcPair_.approve(address(camelotRouter_), MAX_UINT256);
        camelotFusdcWethPair_.approve(address(camelotRouter_), MAX_UINT256);

        fusdc_.safeApprove(address(sushiswapBentoBox_), MAX_UINT256);
        usdc_.safeApprove(address(sushiswapBentoBox_), MAX_UINT256);
        weth_.safeApprove(address(sushiswapBentoBox_), MAX_UINT256);
    }

    function _disableApprovals() internal {
        fusdc_.safeApprove(address(camelotRouter_), 0);
        usdc_.safeApprove(address(camelotRouter_), 0);
        weth_.safeApprove(address(camelotRouter_), 0);

        camelotFusdcUsdcPair_.approve(address(camelotRouter_), 0);
        camelotFusdcWethPair_.approve(address(camelotRouter_), 0);

        fusdc_.safeApprove(address(sushiswapBentoBox_), 0);
        usdc_.safeApprove(address(sushiswapBentoBox_), 0);
        weth_.safeApprove(address(sushiswapBentoBox_), 0);
    }

    /* ~~~~~~~~~~ INTERNAL MISC FUNCTIONS ~~~~~~~~~~ */

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

    function _sushiswapPoolReserves(
        ISushiswapStablePool _pool,
        IERC20 _tokenB
    ) internal view returns (
        uint256 reserveA,
        uint256 reserveB
    ) {
        (uint256 reserve0, uint256 reserve1) = _pool.getReserves();

        (reserveA, reserveB) =
          address(fusdc_) < address(_tokenB)
              ? (reserve0, reserve1)
              : (reserve1, reserve0);

        return (reserveA, reserveB);
    }

    function _camelotRatios() public view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio
    ) {
        (uint256 camelotFusdcUsdcReserveA, uint256 camelotFusdcUsdcReserveB) =
            _uniswapPairReserves(
                camelotFusdcUsdcPair_,
                fusdc_
            );

        uint256 camelotFusdcUsdcRatio =
            1e12 * camelotFusdcUsdcReserveA / (camelotFusdcUsdcReserveA + camelotFusdcUsdcReserveB);

        (uint256 camelotFusdcWethReserveA, uint256 camelotFusdcWethReserveB) =
            _uniswapPairReserves(
                camelotFusdcWethPair_,
                weth_
            );

        uint256 camelotFusdcWethRatio =
            1e12 * camelotFusdcWethReserveA / (camelotFusdcWethReserveA + camelotFusdcWethReserveB);

        return (
            camelotFusdcUsdcRatio,
            camelotFusdcWethRatio
        );
    }

    function _sushiswapRatios() public view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio
    ) {
        (uint256 sushiswapFusdcUsdcReserveA, uint256 sushiswapFusdcUsdcReserveB) =
            _sushiswapPoolReserves(
                sushiswapFusdcUsdcPool_,
                fusdc_
            );

        uint256 sushiswapFusdcUsdcRatio =
            1e12 * sushiswapFusdcUsdcReserveA / (sushiswapFusdcUsdcReserveA + sushiswapFusdcUsdcReserveB);

        (uint256 sushiswapFusdcWethReserveA, uint256 sushiswapFusdcWethReserveB) =
            _sushiswapPoolReserves(
                sushiswapFusdcWethPool_,
                weth_
            );

        uint256 sushiswapFusdcWethRatio =
            1e12 * sushiswapFusdcWethReserveA / (sushiswapFusdcWethReserveA + sushiswapFusdcWethReserveB);

        return (
            sushiswapFusdcUsdcRatio,
            sushiswapFusdcWethRatio
        );
    }

    /* ~~~~~~~~~~ EMERGENCY MODE ~~~~~~~~~~ */

    function disableEmergencyMode() public {
        require(msg.sender == operator_, "only operator");

        _enableApprovals();

        emit Emergency(false);

        noEmergencyMode_ = true;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    function enableEmergencyMode() public {
        require(
            msg.sender == operator_ ||
            msg.sender == emergencyCouncil_,
            "emergency only"
        );

        _disableApprovals();

        emit Emergency(true);

        noEmergencyMode_ = false;
    }

    /* ~~~~~~~~~~ OPERATOR ~~~~~~~~~~ */

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator_, "only operator");
        operator_ = _newOperator;
    }
}
