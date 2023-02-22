// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

import "./IProxyAdmin.sol";

interface IUpgradeableBeacon is IBeacon {
    function implementation() external view returns (address);
    function upgradeTo(address) external;
    function changeAdmin(IProxyAdmin) external;
}
