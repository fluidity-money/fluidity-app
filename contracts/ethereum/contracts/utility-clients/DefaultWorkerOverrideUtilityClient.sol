// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./BaseUtilityClient.sol";

contract DefaultWorkerOverrideUtilityClient is BaseUtilityClient {
    uint256 immutable deltaWeightNum_;
    uint256 immutable deltaWeightDenom_;

    constructor(
        IERC20 _token,
        uint _deltaWeightNum,
        uint _deltaWeightDenom,
        address _dustCollector,
        address _oracle,
        address _operator,
        address _council
    ) BaseUtilityClient(
        _token,
        _dustCollector,
        _oracle,
        _operator,
        _council
    ) {
        deltaWeightNum_ = _deltaWeightNum;
        deltaWeightDenom_ = _deltaWeightDenom;
    }


    /// @inheritdoc IFluidClient
    function getUtilityVars() external override view returns (UtilityVars memory) {
        require(noEmergencyMode_, "emergency mode!");

        return UtilityVars({
            poolSizeNative: token_.balanceOf(address(this)),
            tokenDecimalScale: 10**token_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: deltaWeightNum_,
            deltaWeightDenom: deltaWeightDenom_,
            // this is a constant that the offchain worker knows !
            customCalculationType: "worker config overrides"
        });
    }
}
