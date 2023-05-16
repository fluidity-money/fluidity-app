// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IFluidClient.sol";
import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";

contract DefaultWorkerOverrideUtilityClient is IFluidClient, IEmergencyMode {
    event DustCollected(address destination, uint amount);

    IERC20 immutable token_;

    uint immutable deltaWeightNum_;
    uint immutable deltaWeightDenom_;

    address immutable dustCollector_;

    address private oracle_;
    address private operator_;
    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    constructor(
        IERC20 token,
        uint deltaWeightNum,
        uint deltaWeightDenom,
        address dustCollector,
        address oracle,
        address operator,
        address council
    ) {
        token_ = token;
        deltaWeightNum_ = deltaWeightNum;
        deltaWeightDenom_ = deltaWeightDenom;
        dustCollector_ = dustCollector;

        oracle_ = oracle;
        operator_ = operator;
        emergencyCouncil_ = council;
        noEmergencyMode_ = true;
    }

    function drain() external {
        require(msg.sender == operator_, "only operator");

        uint balance = token_.balanceOf(address(this));

        token_.transfer(dustCollector_, balance);

        emit DustCollected(dustCollector_, balance);
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) external {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == oracle_, "only oracle");

        uint poolAmount = token_.balanceOf(address(this));

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            token_.transfer(winner.winner, winner.amount);
            emit Reward(
                winner.winner,
                winner.amount,
                firstBlock,
                lastBlock
            );
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external view returns (UtilityVars memory) {
        require(noEmergencyMode_, "emergency mode!");

        return UtilityVars({
            poolSizeNative: token_.balanceOf(address(this)),
            tokenDecimalScale: 10**token_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: deltaWeightNum_,
            deltaWeightDenom: deltaWeightDenom_,
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
