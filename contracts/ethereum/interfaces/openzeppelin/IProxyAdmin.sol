// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./IUpgradeableBeacon.sol";

interface IProxyAdmin {
    function changeProxyAdmin(IUpgradeableBeacon, address) external;
    function upgrade(IUpgradeableBeacon, address) external;
}
