// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./IFluidClient.sol";
import "./ITrfVariables.sol";

/**
 * @dev RegistrationTypeToken denoting implementations of "IToken.sol"
 */
uint8 constant RegistrationTypeToken = 1;

/**
 * @dev RegistrationTypeLiquidityProvider denoting implementations of
 *      "ILiquidityProvider.sol"
 */
uint8 constant RegistrationTypeLiquidityProvider = 2;

struct Registration {
    uint8 type_;
    address addr;
}

interface IRegistry {
    function register(uint8, address) external;
    function registerMany(Registration[] calldata) external;

    function registrations() external view returns (Registration[] memory);

    function getFluidityClient(
        address,
        string memory
    ) external view returns (IFluidClient);

    function updateTrfVariables(address, TrfVariables calldata) external;

    function getTrfVariables(address) external returns (TrfVariables memory);
}
