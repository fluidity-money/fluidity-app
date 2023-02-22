// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";

// it's worth noting that if someone calls GovToken like
// BaseNativeFunction they'll be able to do so without going through the
// init here

contract GovToken is BaseNativeToken {
    uint8 private version_;

    function init(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) public {
        require(version_ == 0, "already initialised");

        super.init(_name, _symbol, _decimals);
        _mint(msg.sender, _totalSupply);

        version_ = 1;
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
