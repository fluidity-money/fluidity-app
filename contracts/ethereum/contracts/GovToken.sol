// SPDX-License-Identifier: GPL
pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";

contract GovToken is BaseNativeToken {
    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
