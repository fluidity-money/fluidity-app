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

import "../interfaces/ICamelotRouter.sol";
import "../interfaces/ICamelotPair.sol";

import "../interfaces/ISushiswapPool.sol";
import "../interfaces/ISushiswapBentoBox.sol";

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

uint256 constant MAX_SLIPPAGE = 100;

contract LootboxStaking is ILootboxStaking, IOperatorOwned, IEmergencyMode {
    using SafeERC20 for IERC20;

    uint8 private version_;

    address private operator_;

    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    IERC20 public fusdc_;

    IERC20 public weth_;

    IERC20 public usdc_;

    ICamelotRouter public camelotRouter_;

    ISushiswapBentoBox public sushiswapBentoBox_;

    // we don't use a sushiswap router since it doesn't do much aside from
    // check amounts

    ISushiswapPool private sushiswapFusdcUsdcPool_;

    ISushiswapPool private sushiswapFusdcWethPool_;

    ICamelotPair private camelotFusdcUsdcPair_;

    ICamelotPair private camelotFusdcWethPair_;

    mapping (address => Deposit[]) private deposits_;

    // lp tokens provided by users that we don't touch

    uint256 private camelotFusdcUsdcDepositedLpTokens_;

    uint256 private camelotFusdcWethDepositedLpTokens_;

    uint256 private sushiswapFusdcUsdcDepositedLpTokens_;

    uint256 private sushiswapFusdcWethDepositedLpTokens_;

    /// @dev fusdcMinLiquidity_ of fusdc, is one decimal unit
    uint256 private fusdcMinLiquidity_;

    /// @dev usdcMinLiquidity_ of usdc, is one decimal unit
    uint256 private usdcMinLiquidity_;

    /// @dev wethMinLiquidity_ of weth, is one decimal unit
    uint256 private wethMinLiquidity_;

    function init(
        address _operator,
        address _emergencyCouncil,
        IERC20 _fusdc,
        IERC20 _usdc,
        IERC20 _weth,
        ICamelotRouter _camelotRouter,
        ISushiswapBentoBox _sushiswapBentoBox,
        ICamelotPair _camelotFusdcUsdcPair,
        ICamelotPair _camelotFusdcWethPair,
        ISushiswapPool _sushiswapFusdcUsdcPool,
        ISushiswapPool _sushiswapFusdcWethPool
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

        fusdcMinLiquidity_ = fusdc_.decimals();

        usdcMinLiquidity_ = usdc_.decimals();

        wethMinLiquidity_ = weth_.decimals();

        require(fusdcMinLiquidity_ == usdcMinLiquidity_, "fusdc&usdc must be same dec");

        // assumes that weth > usdc and fusdc

        _enableApprovals();
    }

    /**
     * @notice migrateV2 sets the approvals back up
     */
    function migrateV2() public {
        require(msg.sender == operator_, "only operator");
        require(version_ == 1, "already init");

        version_ = 2;

        _disableApprovals();
        _enableApprovals();
    }

    /* ~~~~~~~~~~ INTERNAL DEPOSIT FUNCTIONS ~~~~~~~~~~ */

    function _depositToCamelotRouter(
        ICamelotRouter _router,
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
        ISushiswapPool _pool,
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
    ) internal view returns (bool) {
        return _fusdcAmount + 1 > fusdcMinLiquidity_ && _wethAmount + 1 > wethMinLiquidity_;
    }

    function _depositTokens(
        IERC20 _tokenA,
        IERC20 _tokenB,
        ISushiswapPool _sushiswapPool,
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
        ) = _depositToCamelotRouter(
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
        require(noEmergencyMode_, "emergency mode!");

        uint256 tokenABefore = fusdc_.balanceOf(address(this));

        uint256 tokenBBefore = _tokenB.balanceOf(address(this));

	require(
	    fusdc_.allowance(_sender, address(this)) >= _fusdcAmount,
	    "allowance needed"
	);

	require(
	    _tokenB.allowance(_sender, address(this)) >=
	    _tokenBAmount, "allowance needed"
	);

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
        dep.depositTimestamp = block.timestamp;

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

        tokenADeposited = dep.camelotTokenA + dep.sushiswapTokenA;

        tokenBDeposited = dep.camelotTokenB + dep.sushiswapTokenB;

        return (tokenADeposited, tokenBDeposited);
    }

    /* ~~~~~~~~~~ INTERNAL REDEEM FUNCTIONS ~~~~~~~~~~ */

    function _redeemFromCamelotRouter(
        ICamelotRouter _router,
        IERC20 _tokenB,
        uint256 _lpTokens,
        uint256 _timestamp
    ) internal returns (
        uint256 tokenARedeemed,
        uint256 tokenBRedeemed
    ) {
        return _router.removeLiquidity(
            address(fusdc_),
            address(_tokenB),
            _lpTokens,
            0,
            0,
            address(this),
            _timestamp
        );
    }

    function _redeemFromSushiswapPool(
        ISushiswapPool _pool,
        IERC20 _tokenB,
        uint256 _lpTokens
    ) internal returns (
        uint256 tokenARedeemed,
        uint256 tokenBRedeemed
    ) {
        uint256 tokenABefore = fusdc_.balanceOf(address(this));
        uint256 tokenBBefore = _tokenB.balanceOf(address(this));

        _pool.transfer(address(_pool), _lpTokens);

        // unwrap the bento (the true) so we get the funds back into the contract
        _pool.burn(abi.encode(address(this), true));

        uint256 tokenAAfter = fusdc_.balanceOf(address(this));
        uint256 tokenBAfter = _tokenB.balanceOf(address(this));

        tokenARedeemed = tokenAAfter - tokenABefore;
        tokenBRedeemed = tokenBAfter - tokenBBefore;

        return (tokenARedeemed, tokenBRedeemed);
    }

    function _deleteDeposit(address _sender, uint _depositId) internal {
        deposits_[_sender][_depositId] =
            deposits_[_sender][deposits_[_sender].length - 1];

        deposits_[_sender].pop();
    }

    /**
     * @notice _redeemCamelotStableSwapSushiswap by assuming it's
     *         fusdc/usdc and not rederivating the constant product formula to
     *         take fees from sushiswap (which is likely a stableswap pool in practice)
     */
    function _redeemCamelotStableSwapSushiswap(
        Deposit memory dep,
        uint256 _timestamp,
        uint256 _originalCamelotK
    ) internal returns (
        uint256 tokenARedeemed,
        uint256 tokenBRedeemed
    ) {
        (uint256 camelotARedeemed, uint256 camelotBRedeemed) =
            _redeemFromCamelotRouter(
                camelotRouter_,
                usdc_,
                dep.camelotLpMinted,
                _timestamp
            );

        (uint256 sushiswapARedeemed, uint256 sushiswapBRedeemed) =
            _redeemFromSushiswapPool(
                sushiswapFusdcUsdcPool_,
                usdc_,
                dep.sushiswapLpMinted
            );

        uint256 tokenBAvailable = camelotBRedeemed + sushiswapBRedeemed;

        uint256 redeemedCamelotK = _originalCamelotK / camelotARedeemed;

        tokenARedeemed = camelotARedeemed + sushiswapARedeemed;

        // if token B redeemed is higher than the amount that the user
        // got back, then we simply return that amount

        tokenBRedeemed = redeemedCamelotK + sushiswapBRedeemed;

        if (tokenBRedeemed > tokenBAvailable) tokenBRedeemed = tokenBAvailable;

        return (tokenARedeemed, tokenBRedeemed);
    }

    function _redeemCamelotConstantProductSushiswap(
        Deposit memory dep,
        uint256 _timestamp,
        uint256 _originalCamelotK,
        uint256 _originalSushiswapK
    ) internal returns (
        uint256 tokenARedeemed,
        uint256 tokenBRedeemed
    ) {
        (uint256 camelotARedeemed, uint256 camelotBRedeemed) =
            _redeemFromCamelotRouter(
                camelotRouter_,
                weth_,
                dep.camelotLpMinted,
                _timestamp
            );

        (uint256 sushiswapARedeemed, uint256 sushiswapBRedeemed) =
            _redeemFromSushiswapPool(
                sushiswapFusdcWethPool_,
                weth_,
                dep.sushiswapLpMinted
            );

        uint256 tokenBAvailable = camelotBRedeemed + sushiswapBRedeemed;

        uint256 redeemedCamelotK = _originalCamelotK / camelotARedeemed;

        uint256 redeemedSushiswapK = _originalSushiswapK / sushiswapARedeemed;

        tokenARedeemed = camelotARedeemed + sushiswapARedeemed;

        // if token B redeemed is higher than the amount that the user
        // got back, then we simply return that amount (this could happen
        // if the user got rekt on fees by bento)

        tokenBRedeemed = redeemedCamelotK + redeemedSushiswapK;

        if (tokenBRedeemed > tokenBAvailable) tokenBRedeemed = tokenBAvailable;

        return (tokenARedeemed, tokenBRedeemed);
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

        require(_slippage < MAX_SLIPPAGE + 1, "slippage too high");

        // the ui should restrict the deposits to more than 1e18

        bool fusdcUsdcPair =
            _fusdcAmount + 1 > fusdcMinLiquidity_ && _usdcAmount + 1 > usdcMinLiquidity_;

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

            uint256 tokenARedeemed;
            uint256 tokenBRedeemed;

            // if the pair is the fusdc usdc pair, we assume it's a stable swap pool
            // pool, and ignore any fees taken since it's difficult to calculate the
            // fees from the stableswap formula in the smart contract

            uint256 originalCamelotK = dep.camelotTokenA * dep.camelotTokenB;

            if (fusdcUsdcPair) {
                (
                    tokenARedeemed,
                    tokenBRedeemed
                ) =
                    _redeemCamelotStableSwapSushiswap(
                        dep,
                        _maxTimestamp,
                        originalCamelotK
                    );

                camelotFusdcUsdcDepositedLpTokens_ -= dep.camelotLpMinted;
                sushiswapFusdcUsdcDepositedLpTokens_ -= dep.sushiswapLpMinted;
            }

            else {
                uint256 originalSushiswapK = dep.sushiswapTokenA * dep.sushiswapTokenB;

                (
                    tokenARedeemed,
                    tokenBRedeemed
                ) =
                    _redeemCamelotConstantProductSushiswap(
                        dep,
                        _maxTimestamp,
                        originalCamelotK,
                        originalSushiswapK
                    );

                camelotFusdcWethDepositedLpTokens_ -= dep.camelotLpMinted;
                sushiswapFusdcWethDepositedLpTokens_ -= dep.sushiswapLpMinted;
            }

            fusdcRedeemed += tokenARedeemed;

            if (fusdcUsdcPair) usdcRedeemed += tokenBRedeemed;

            else wethRedeemed += tokenBRedeemed;

            // iterating in reverse, then deleting the deposit will let us remove
            // unneeded deposits in memory

            emit Redeemed(
                msg.sender,
                dep.redeemTimestamp,
                block.timestamp,
                tokenARedeemed,
                fusdcUsdcPair ? tokenBRedeemed : 0,
                fusdcUsdcPair ? 0 : tokenBRedeemed
            );

            _deleteDeposit(msg.sender, i);
        }

        fusdc_.safeTransfer(msg.sender, fusdcRedeemed);

        usdc_.safeTransfer(msg.sender, usdcRedeemed);

        weth_.safeTransfer(msg.sender, wethRedeemed);

        return (fusdcRedeemed, usdcRedeemed, wethRedeemed);
    }

    /// @inheritdoc ILootboxStaking
    function deposits(address _spender) public view returns (Deposit[] memory) {
        return deposits_[_spender];
    }

    /// @inheritdoc ILootboxStaking
    function ratios() public view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio,
        uint256 fusdcUsdcSpread,
        uint256 fusdcWethSpread,
        uint256 fusdcUsdcLiq,
        uint256 fusdcWethLiq
    ) {
        (
            uint256 camelotFusdcUsdcRatio,
            uint256 camelotFusdcWethRatio,
            uint256 camelotFusdcUsdcLiq,
            uint256 camelotFusdcWethLiq
        ) =  _camelotRatios();

        (
            uint256 sushiswapFusdcUsdcRatio,
            uint256 sushiswapFusdcWethRatio,
            uint256 sushiswapFusdcUsdcLiq,
            uint256 sushiswapFusdcWethLiq
        ) = _sushiswapRatios();

        fusdcUsdcRatio =  (camelotFusdcUsdcRatio + sushiswapFusdcUsdcRatio) / 2;

        fusdcWethRatio = (camelotFusdcWethRatio + sushiswapFusdcWethRatio) / 2;

        if (camelotFusdcUsdcRatio > sushiswapFusdcUsdcRatio)
            fusdcUsdcSpread = camelotFusdcUsdcRatio - sushiswapFusdcUsdcRatio;
        else
            fusdcUsdcSpread = sushiswapFusdcUsdcRatio - camelotFusdcUsdcRatio;

        if (camelotFusdcWethRatio > sushiswapFusdcWethRatio)
            fusdcWethSpread = camelotFusdcWethRatio - sushiswapFusdcWethRatio;
        else
            fusdcWethSpread = sushiswapFusdcWethRatio - camelotFusdcWethRatio;

        fusdcUsdcLiq = camelotFusdcUsdcLiq + sushiswapFusdcUsdcLiq;

        fusdcWethLiq = camelotFusdcWethLiq + sushiswapFusdcWethLiq;

        return (
            fusdcUsdcRatio,
            fusdcWethRatio,
            fusdcUsdcSpread,
            fusdcWethSpread,
            fusdcUsdcLiq,
            fusdcWethLiq
        );
    }

    /// @inheritdoc ILootboxStaking
    function drain(address _recipient) public {
        require(msg.sender == operator_, "only operator");
        require(noEmergencyMode_, "emergency mode");

        fusdc_.safeTransfer(_recipient, fusdc_.balanceOf(address(this)));
        usdc_.safeTransfer(_recipient, usdc_.balanceOf(address(this)));
        weth_.safeTransfer(_recipient, weth_.balanceOf(address(this)));
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

    function _camelotPairReserves(
        ICamelotPair _pair,
        IERC20 _tokenB
    ) internal view returns (
        uint256 reserveA,
        uint256 reserveB
    ) {
        (uint112 reserve0_, uint112 reserve1_,,) = _pair.getReserves();

        uint256 reserve0 = uint256(reserve0_);

        uint256 reserve1 = uint256(reserve1_);

        (reserveA, reserveB) =
          address(fusdc_) < address(_tokenB)
              ? (reserve0, reserve1)
              : (reserve1, reserve0);

        return (reserveA, reserveB);
    }

    function _sushiswapPoolReserves(
        ISushiswapPool _pool,
        IERC20 _tokenB
    ) internal view returns (
        uint256 reserveA,
        uint256 reserveB
    ) {
        (uint256 reserve0, uint256 reserve1) = _pool.getNativeReserves();

        (reserveA, reserveB) =
          address(fusdc_) < address(_tokenB)
              ? (reserve0, reserve1)
              : (reserve1, reserve0);

        return (reserveA, reserveB);
    }

    function _camelotRatios() internal view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio,
        uint256 fusdcUsdcLiq,
        uint256 fusdcWethLiq
    ) {
        (uint256 camelotFusdcUsdcReserveA, uint256 camelotFusdcUsdcReserveB) =
            _camelotPairReserves(
                camelotFusdcUsdcPair_,
                usdc_
            );



        camelotFusdcUsdcReserveA *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);
        camelotFusdcUsdcReserveB *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);

        fusdcUsdcLiq = camelotFusdcUsdcReserveA + camelotFusdcUsdcReserveB;


        // if the information here is empty, then we provide a hardcoded ratio suggestion

        if (fusdcUsdcLiq != 0)
            fusdcUsdcRatio = 1e12 * camelotFusdcUsdcReserveA / fusdcUsdcLiq;

        else
            fusdcUsdcRatio = 500000000000; // 50 * 1e10


        (uint256 camelotFusdcWethReserveA, uint256 camelotFusdcWethReserveB) =
            _camelotPairReserves(
                camelotFusdcWethPair_,
                weth_
            );

        // exponentiate fudsc by the difference between it's decimals and
        // weth's for an equal calculation to get an accurate ratio

        camelotFusdcWethReserveA *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);

        fusdcWethLiq = camelotFusdcWethReserveA + camelotFusdcWethReserveB;

        if (fusdcWethLiq != 0)
            fusdcWethRatio = 1e12 * camelotFusdcWethReserveA / fusdcWethLiq;

        else
            fusdcWethRatio = 500000000000; // 50 * 1e10

        return (
            fusdcUsdcRatio,
            fusdcWethRatio,
            fusdcUsdcLiq,
            fusdcWethLiq
        );
    }

    function _sushiswapRatios() internal view returns (
        uint256 fusdcUsdcRatio,
        uint256 fusdcWethRatio,
        uint256 fusdcUsdcLiq,
        uint256 fusdcWethLiq
    ) {
        (uint256 sushiswapFusdcUsdcReserveA, uint256 sushiswapFusdcUsdcReserveB) =
            _sushiswapPoolReserves(
                sushiswapFusdcUsdcPool_,
                usdc_
            );

        sushiswapFusdcUsdcReserveA *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);
        sushiswapFusdcUsdcReserveB *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);

        fusdcUsdcLiq = sushiswapFusdcUsdcReserveA + sushiswapFusdcUsdcReserveB;

        if (fusdcUsdcLiq != 0)
            fusdcUsdcRatio = 1e12 * sushiswapFusdcUsdcReserveA / fusdcUsdcLiq;

        else
            fusdcUsdcRatio = 500000000000; // 50 * 1e10

        (uint256 sushiswapFusdcWethReserveA, uint256 sushiswapFusdcWethReserveB) =
            _sushiswapPoolReserves(
                sushiswapFusdcWethPool_,
                weth_
            );

        sushiswapFusdcWethReserveA *= 10 ** (wethMinLiquidity_ - fusdcMinLiquidity_);

        fusdcWethLiq = sushiswapFusdcWethReserveA + sushiswapFusdcWethReserveB;

        // if the liquidity in the pool is empty, then we provide a default suggestion

        if (fusdcWethLiq != 0)
            fusdcWethRatio = 1e12 * sushiswapFusdcWethReserveA / fusdcWethLiq;

        else
            fusdcWethRatio = 500000000000; // 50 * 1e10

        return (
            fusdcUsdcRatio,
            fusdcWethRatio,
            fusdcUsdcLiq,
            fusdcWethLiq
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

    function updateEmergencyCouncil(address _emergencyCouncil) public {
        require(msg.sender == operator_, "only operator");
        emergencyCouncil_ = _emergencyCouncil;
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
