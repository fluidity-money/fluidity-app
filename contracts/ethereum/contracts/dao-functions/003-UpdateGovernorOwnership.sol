// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "../../interfaces/IOperatorOwned.sol";
import "../../interfaces/IRegistry.sol";

import "./002-SafeCall.sol";

bytes4 constant UPDATE_OPERATOR_SELECTOR =
  IOperatorOwned.updateOperator.selector;

contract UpdateGovernorOwnership {
    function updateRegistrations(IRegistry _registry, address _newOperator) public {
        Registration[] memory registrations = _registry.registrations();

        for (uint i = 0; i < registrations.length; i++) {
            Registration memory registration = registrations[i];

            safeCallIgnoreRevert(
                registration.addr,
                abi.encodeWithSelector(UPDATE_OPERATOR_SELECTOR, _newOperator)
            );
        }
    }
}