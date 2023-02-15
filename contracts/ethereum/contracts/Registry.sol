// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./IToken.sol";
import "./ILiquidityProvider.sol";
import "./IToken.sol";
import "./IRegistry.sol";

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

contract Registry is IRegistry {

    // @dev RegistrationType is a uint8 in practice, so it can be updated
    // with a contract upgrade if the ABI changes
    event RegistrationMade(RegistrationType type_, address indexed addr);

    uint8 version_;

    address operator_;

    /// @notice tokenBeacon_ to be used as a helpful guide for the DAO
    IBeacon tokenBeacon_;

    /// @notice liquidityProviderBeacon_ as a helpful guide for the DAO
    IBeacon liquidityProviderBeacon_;

    Registration[] registrations_;

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

    function register(RegistrationType _type, address _contract) public {
        require(operatorNotRequiredOrIsOperator(), "not allowed");

        registrations_.push(Registration({
            type_: _type,
            addr: _contract
        }));

        emit RegistrationMade(_type, _contract);
    }

    function registrations() public view returns (Registration[] memory) {
        return registrations_;
    }
}
