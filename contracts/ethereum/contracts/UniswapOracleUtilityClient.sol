// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IFluidClient.sol";
import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";

import "./openzeppelin/SafeERC20.sol";
import "./uniswap/UniswapLibraries.sol";

contract UniswapOracleOverrideUtilityClient is IFluidClient, IEmergencyMode {
    using SafeERC20 for IERC20;

    event DustCollected(address destination, uint256 amount);

    IERC20 immutable token_;

    uint256 immutable deltaWeightNum_;
    uint256 immutable deltaWeightDenom_;

    address immutable dustCollector_;

    address private oracle_;
    address private operator_;
    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    IUniswapV3Pool immutable pool_;

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
    ) {
        token_ = _token;
        pool_ = _pool;
        weightedAverageTime_ = _weightedAverageTime;
        deltaWeightNum_ = _deltaWeightNum;
        deltaWeightDenom_ = _deltaWeightDenom;
        dustCollector_ = _dustCollector;

        oracle_ = _oracle;
        operator_ = _operator;
        emergencyCouncil_ = _council;
        noEmergencyMode_ = true;

        token0_ = pool_.token0();
        token1_ = pool_.token1();

        require(
            address(_token) == token0_ || address(_token) == token1_,
            "wrong pool!"
        );

        // might revert if the pool doesn't have enough data!
        getTickPrice();
    }

    // drains any dust from the pool
    function drain() external {
        require(msg.sender == operator_, "only operator");

        uint256 balance = token_.balanceOf(address(this));

        token_.safeTransfer(dustCollector_, balance);

        emit DustCollected(dustCollector_, balance);
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory _rewards, uint256 _firstBlock, uint256 _lastBlock) external {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == oracle_, "only oracle");

        uint256 poolAmount = token_.balanceOf(address(this));

        for (uint256 i = 0; i < _rewards.length; i++) {
            Winner memory winner = _rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            token_.safeTransfer(winner.winner, winner.amount);
            emit Reward(
                winner.winner,
                winner.amount,
                _firstBlock,
                _lastBlock
            );
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external view returns (UtilityVars memory) {
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
        uint256 decimals;
        if (address(token_) == token1_) {
            // token0 is usd
            num = ratio;
            denom = ratioPoints;
            decimals = 10 ** IERC20(token0_).decimals();
        } else {
            // token1 is usd
            denom = ratio;
            num = ratioPoints;
            decimals = 10 ** IERC20(token1_).decimals();
        }
        num = num * decimals;

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

    // returns the time weighted tick price from uniswap
    function getTickPrice() internal view returns (int24) {
        (int24 arithmetic, /* uint128 harmonic */) = OracleLibrary.consult(
            address(pool_),
            weightedAverageTime_
        );

        return arithmetic;
    }

    // implements IEmergencyMode

    /// @inheritdoc IEmergencyMode
    function enableEmergencyMode() external {
        require(msg.sender == emergencyCouncil_ || msg.sender == operator_, "not allowed");

        noEmergencyMode_ = false;

        emit Emergency(true);
    }

    /// @inheritdoc IEmergencyMode
    function disableEmergencyMode() external {
        require(msg.sender == operator_, "not allowed");

        noEmergencyMode_ = true;

        emit Emergency(false);
    }

    /// @inheritdoc IEmergencyMode
    function noEmergencyMode() external view returns (bool) {
        return noEmergencyMode_;
    }

    /// @inheritdoc IEmergencyMode
    function emergencyCouncil() external view returns (address) {
        return emergencyCouncil_;
    }
}
