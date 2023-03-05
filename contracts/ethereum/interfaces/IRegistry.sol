// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IFluidClient.sol";
import "./ITrfVariables.sol";
import "./ITokenOperatorOwned.sol";

interface IRegistry {
    function registerToken(ITokenOperatorOwned) external;
    function registerManyTokens(ITokenOperatorOwned[] calldata) external;

    function registerLiquidityProvider(ILiquidityProvider) external;
    function registerManyLiquidityProviders(ILiquidityProvider[] calldata) external;

    function tokens() external view returns (ITokenOperatorOwned[] memory);

    function getFluidityClient(
        address,
        string memory
    ) external view returns (IFluidClient);

    function updateTrfVariables(address, TrfVariables calldata) external;

    function getTrfVariables(address) external returns (TrfVariables memory);
}
