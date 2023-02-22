// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
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
