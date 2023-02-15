// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

enum RegistrationType {
    TOKEN,
    LIQUIDITY_PROVIDER
}

struct Registration {
    RegistrationType type_;
    address addr;
}

interface IRegistry {
    function register(RegistrationType, address) external;
    function registrations() external view returns (Registration[] memory);
}
