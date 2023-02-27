// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";

// it's worth noting that if someone calls GovToken like
// BaseNativeFunction they'll be able to do so without going through the
// init here

contract GovToken is BaseNativeToken {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) {
        _mint(msg.sender, _totalSupply);
        super.init(_name, _symbol, _decimals);
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
