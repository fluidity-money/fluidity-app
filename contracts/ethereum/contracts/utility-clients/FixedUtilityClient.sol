// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./BaseUtilityClient.sol";
import "../openzeppelin/SafeERC20.sol";

contract FixedUtilityClient is BaseUtilityClient {
    event ExchangeRateUpdated(uint256 num, uint256 denom);

    uint256 immutable deltaWeightNum_;
    uint256 immutable deltaWeightDenom_;

    uint256 private exchangeRateNum_;
    uint256 private exchangeRateDenom_;

    constructor(
        IERC20 _token,
        uint256 _deltaWeightNum,
        uint256 _deltaWeightDenom,
        uint256 _exchangeRateNum,
        uint256 _exchangeRateDenom,
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

        exchangeRateNum_ = _exchangeRateNum;
        exchangeRateDenom_ = _exchangeRateDenom;

        emit ExchangeRateUpdated(exchangeRateNum_, exchangeRateDenom_);
    }

    function updateExchangeRate(uint256 num, uint256 denom) external {
        require(msg.sender == operator_, "only operator");

        exchangeRateNum_ = num;
        exchangeRateDenom_ = denom;

        emit ExchangeRateUpdated(num, denom);
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function getUtilityVars() external override view returns (UtilityVars memory) {
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
}
