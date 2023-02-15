// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./IToken.sol";
import "./ILiquidityProvider.sol";

interface IRegistry {
    function addToken(IToken) external;
    function getTokens() external view returns (IToken[] memory);

    function addLiquidityProvider(ILiquidityProvider) external;
    function getLiquidityProviders() external view returns (ILiquidityProvider[] memory);
}
