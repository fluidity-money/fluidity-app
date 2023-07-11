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

import "./UsdcEToUsdcShifterLiquidityProvider.sol";

/**
 * ShiftUsdcEToUsdc is intended to be used with call after
 * transferring the ownership of the token given to this
 */
contract ShiftUsdcEToUsdc {
    struct Args {
        address multisig;
        address aaveV3LiquidityProviderBeacon;
        IRegistry registry;
        Token token;
        uint256 deadline;
        IUniswapV3SwapRouter router;
        IERC20 usdce;
        IERC20 usdc;
        address aaveV3AddressProvider;
        address aaveV3AToken;
    }

    function main(Args calldata _args) external {
        // first, deploy the liquidity provider with aave v3 so we can
        // start to shift the liquidity over

        ILiquidityProvider tempLp = new UsdcEToUsdcShifterLiquidityProvider(
            _args.multisig,
            _args.deadline,
            _args.router,
            address(_args.token), // owner
            _args.usdce,
            _args.usdc
        );

        ILiquidityProvider oldLp = _args.token.underlyingLp();

        uint256 tokenAmount = oldLp.totalPoolAmount();

        require(tokenAmount > 100, "total pool amount too low");

        uint256 minTokenAmount = (tokenAmount * 99) / 100;

        _args.token.upgradeLiquidityProvider(tempLp, minTokenAmount);

        ILiquidityProvider newAaveV3Lp = ILiquidityProvider(address(new BeaconProxy(
            _args.aaveV3LiquidityProviderBeacon,
            abi.encodeWithSelector(
                AaveV3LiquidityProvider.init.selector,
                _args.aaveV3AddressProvider,
                _args.aaveV3AToken,
                address(_args.token) // owner
            )
        )));

        uint256 newTokenAmount = _args.usdc.balanceOf(address(newAaveV3Lp));

        require(newTokenAmount + 1 > minTokenAmount, "new usdce amount too low");

        // better to be safe than sorry and estimate instead of relying on upstream

        _args.token.upgradeLiquidityProvider(newAaveV3Lp, newTokenAmount);

        _args.token.updateOperator(_args.multisig);
    }
}
