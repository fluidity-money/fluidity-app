// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./IToken.sol";
import "./ILiquidityProvider.sol";
import "./IToken.sol";
import "./IRegistry.sol";

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

contract Registry is IRegistry {
    uint8 version_;

    address operator_;

    /// @notice tokenBeacon_ to be used as a helpful guide for the DAO
    IBeacon tokenBeacon_;

    /// @notice liquidityProviderBeacon_ as a helpful guide for the DAO
    IBeacon liquidityProviderBeacon_;

    IToken[] tokens_;

    ILiquidityProvider[] liquidityProviders_;

    function init(
        address _operator,
        IBeacon _tokenBeacon,
        IBeacon _liquidityProviderBeacon
    )
        public
    {
        require(version_ == 0, "already initialised");

        operator_ = _operator;
        tokenBeacon_ = _tokenBeacon;
        liquidityProviderBeacon_ = _liquidityProviderBeacon;

        version_ = 1;
    }

    function operatorNotRequiredOrIsOperator() public view returns (bool) {
        return operator_ == address(0) || msg.sender == operator_;
    }

    function addToken(IToken _token) public {
        require(operatorNotRequiredOrIsOperator(), "not allowed");
        tokens_.push(_token);
    }

    function getTokens() public view returns (IToken[] memory) {
        return tokens_;
    }

    function addLiquidityProvider(ILiquidityProvider _provider) public {
        require(operatorNotRequiredOrIsOperator(), "not allowed");
        liquidityProviders_.push(_provider);
    }

    function getLiquidityProviders() public view returns (ILiquidityProvider[] memory) {
        return liquidityProviders_;
    }
}
