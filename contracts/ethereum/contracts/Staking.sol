// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IStaking.sol";

contract Staking is IStaking, IEmergencyMode {
    uint8 private version_;

    function init() public {
        require(version_ == 0, "already setup");
    }
}
