// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "../../../interfaces/IRegistry.sol";
import "../../../interfaces/ILiquidityProvider.sol";

import "../../../contracts/AaveV3LiquidityProvider.sol";
import "../../../contracts/Token.sol";

import "./UsdcEToUsdcNShifterLiquidityProvider.sol";

/**
 * ShiftUsdcEToUsdc is intended to be used with call after
 * transferring the ownership of the token given to this
 */
contract ShiftUsdcEToUsdcN {
    struct Args {
        address multisig;
        address aaveV3LiquidityProviderBeacon;
        IRegistry registry;
        Token token;
        uint256 deadline;
    }

    IERC20 immutable private usdce_ = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);

    IERC20 immutable private usdcn_ = IERC20(0xaf88d065e77c8cC2239327C5EDb3A432268e5831);

    address private authorised_;

    constructor(address _authorised) {
        authorised_ = _authorised;
    }

    function main(Args calldata _args) external {
        require(msg.sender == authorised_, "only authorised");

        // first, deploy the liquidity provider with aave v3 so we can
        // start to shift the liquidity over

        ILiquidityProvider tempLp = new UsdcEToUsdcNShifterLiquidityProvider(
            _args.multisig,
            _args.deadline,
            address(_args.token) // owner
        );

        ILiquidityProvider oldLp = _args.token.underlyingLp();

        uint256 tokenAmount = oldLp.totalPoolAmount();

        require(tokenAmount > 100, "total pool amount too low");

        uint256 minTokenAmount = (tokenAmount * 99) / 100;

        _args.token.upgradeLiquidityProvider(tempLp, minTokenAmount);

        require(tempLp.underlying_() == usdcn_);

        require(tempLp.totalPoolAmount() + 1 > minTokenAmount, "new usdcn amount too low");

        ILiquidityProvider newAaveV3Lp = ILiquidityProvider(address(new BeaconProxy(
            _args.aaveV3LiquidityProviderBeacon,
            abi.encodeWithSelector(
                AaveV3LiquidityProvider.init.selector,
                0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb, // aave address provider
                0x724dc807b04555b71ed48a6896b6F41593b8C637, // aave usdcn atoken
                address(_args.token) // owner
            )
        )));

        _args.token.upgradeLiquidityProvider(newAaveV3Lp, minTokenAmount);

        require(newAaveV3Lp.underlying_() == usdcn_);

        require(newAaveV3Lp.totalPoolAmount() + 1 > minTokenAmount, "new usdcn amount too low");

        // better to be safe than sorry and estimate instead of relying on upstream

        _args.token.updateOperator(_args.multisig);
    }
}
