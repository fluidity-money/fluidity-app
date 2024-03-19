// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../BaseNativeToken.sol";

contract TestGovToken is BaseNativeToken {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) BaseNativeToken(_name, _symbol, _decimals) {
        _mint(msg.sender, _totalSupply);
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
