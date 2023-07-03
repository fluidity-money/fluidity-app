// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IFluidClient.sol";
import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";

contract FixedUtilityClient is IFluidClient, IEmergencyMode {
    event DustCollected(address destination, uint amount);
    event ExchangeRateUpdated(uint num, uint denom);

    IERC20 immutable token_;

    uint immutable deltaWeightNum_;
    uint immutable deltaWeightDenom_;

    uint private exchangeRateNum_;
    uint private exchangeRateDenom_;

    address immutable dustCollector_;

    address private oracle_;
    address private operator_;
    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    constructor(
        IERC20 _token,
        uint _deltaWeightNum,
        uint _deltaWeightDenom,
        uint _exchangeRateNum,
        uint _exchangeRateDenom,
        address _dustCollector,
        address _oracle,
        address _operator,
        address _council
    ) {
        token_ = _token;
        deltaWeightNum_ = _deltaWeightNum;
        deltaWeightDenom_ = _deltaWeightDenom;

        exchangeRateNum_ = _exchangeRateNum;
        exchangeRateDenom_ = _exchangeRateDenom;

        dustCollector_ = _dustCollector;

        oracle_ = _oracle;
        operator_ = _operator;
        emergencyCouncil_ = _council;
        noEmergencyMode_ = true;

        emit ExchangeRateUpdated(exchangeRateNum_, exchangeRateDenom_);
    }

    function drain() external {
        require(msg.sender == operator_, "only operator");

        uint balance = token_.balanceOf(address(this));

        token_.transfer(dustCollector_, balance);

        emit DustCollected(dustCollector_, balance);
    }

    function updateExchangeRate(uint num, uint denom) external {
        require(msg.sender == operator_, "only operator");

        exchangeRateNum_ = num;
        exchangeRateDenom_ = denom;

        emit ExchangeRateUpdated(num, denom);
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory _rewards, uint _firstBlock, uint _lastBlock) external {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == oracle_, "only oracle");

        uint poolAmount = token_.balanceOf(address(this));

        for (uint i = 0; i < _rewards.length; i++) {
            Winner memory winner = _rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            token_.transfer(winner.winner, winner.amount);
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

        return UtilityVars({
            poolSizeNative: token_.balanceOf(address(this)),
            tokenDecimalScale: 10**token_.decimals(),
            exchangeRateNum: exchangeRateNum_,
            exchangeRateDenom: exchangeRateDenom_,
            deltaWeightNum: deltaWeightNum_,
            deltaWeightDenom: deltaWeightDenom_,
            // this is a constant that the offchain worker knows !
            customCalculationType: "worker config overrides"
        });
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
