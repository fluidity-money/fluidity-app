// SPDX-License-Identifier: GPL
pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";

contract GovToken is BaseNativeToken {
    function init(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) public override(BaseNativeToken) {
        super.init(_name, _symbol, _decimals, _totalSupply);
        _mint(msg.sender, _totalSupply);
    }
}
