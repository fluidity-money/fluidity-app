// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./BaseUtilityClient.sol";
import "../openzeppelin/SafeERC20.sol";
import "../uniswap/UniswapLibraries.sol";

contract UniswapOracleOverrideUtilityClient is BaseUtilityClient {
    IUniswapV3Pool immutable pool_;

    uint256 immutable deltaWeightNum_;
    uint256 immutable deltaWeightDenom_;

    address immutable token0_;
    address immutable token1_;

    uint32 immutable weightedAverageTime_;

    constructor(
        IERC20 _token,
        uint256 _deltaWeightNum,
        uint256 _deltaWeightDenom,
        address _dustCollector,
        address _oracle,
        address _operator,
        address _council,
        IUniswapV3Pool _pool,
        uint32 _weightedAverageTime
    ) BaseUtilityClient(
        _token,
        _dustCollector,
        _oracle,
        _operator,
        _council
    ) {
        deltaWeightNum_ = _deltaWeightNum;
        deltaWeightDenom_ = _deltaWeightDenom;

        pool_ = _pool;
        weightedAverageTime_ = _weightedAverageTime;

        token0_ = pool_.token0();
        token1_ = pool_.token1();

        require(
            address(_token) == token0_ || address(_token) == token1_,
            "wrong pool!"
        );

        // might revert if the pool doesn't have enough data!
        getTickPrice();
    }

    // returns the time weighted tick price from uniswap
    function getTickPrice() internal view returns (int24) {
        (int24 arithmetic, /* uint128 harmonic */) = OracleLibrary.consult(
            address(pool_),
            weightedAverageTime_
        );

        return arithmetic;
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function getUtilityVars() external override view returns (UtilityVars memory) {
        require(noEmergencyMode_, "emergency mode!");

        int24 arithmetic = getTickPrice();

        uint160 sqrtPrice = TickMath.getSqrtRatioAtTick(arithmetic);
        // sqrtPrice = sqrt(price) * 2**96
        // sqrtPrice**2 / 2**96**2 = price
        // sqrtPrice**2 / 2**192 = price

        uint256 ratio;
        uint256 ratioPoints;
        if (sqrtPrice <= type(uint128).max) {
            // we can square safely
            ratio = uint256(sqrtPrice) * sqrtPrice;
            ratioPoints = 1 << 192;
        } else {
            ratio = FullMath.mulDiv(sqrtPrice, sqrtPrice, 1 << 64);
            ratioPoints = 1 << 128;
        }
        uint256 num;
        uint256 denom;
        uint256 usdDecimals;
        uint256 otherDecimals;
        if (address(token_) == token1_) {
            // token0 is usd
            denom = ratio;
            num = ratioPoints;
            usdDecimals = 10 ** IERC20(token0_).decimals();
            otherDecimals = 10 ** IERC20(token1_).decimals();
        } else {
            // token1 is usd
            num = ratio;
            denom = ratioPoints;
            usdDecimals = 10 ** IERC20(token1_).decimals();
            otherDecimals = 10 ** IERC20(token0_).decimals();
        }
        num = num / usdDecimals * otherDecimals;

        return UtilityVars({
            poolSizeNative: token_.balanceOf(address(this)),
            tokenDecimalScale: 10**token_.decimals(),
            exchangeRateNum: num,
            exchangeRateDenom: denom,
            deltaWeightNum: deltaWeightNum_,
            deltaWeightDenom: deltaWeightDenom_,
            // this is a constant that the offchain worker knows !
            customCalculationType: "worker config overrides"
        });
    }
}
