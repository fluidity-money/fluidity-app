// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./IWETH.sol";
import "./Token.sol";

/*
 * Take some Eth, wrap it into wEth, then use it to wrap a Token at the
 * given address
 */
contract ConvertorEthToToken {
    Token public tokenAddress_;

    address payable public wethAddress_;

    constructor(Token _tokenAddress, IWETH _wethAddress) {
        tokenAddress_ = _tokenAddress;
        wethAddress_ = payable(address(_wethAddress));
    }

    function wrapEth() public payable {
        IWETH(wethAddress_).deposit{value: msg.value}();
        IWETH(wethAddress_).approve(address(tokenAddress_), msg.value);
        tokenAddress_.erc20InFor(msg.sender, msg.value);
    }

    function unwrapEth(uint256 _amount) public {
        tokenAddress_.transferFrom(msg.sender, address(this), _amount);
        tokenAddress_.erc20Out(_amount);
        IWETH(wethAddress_).withdraw(_amount);
        payable(msg.sender).transfer(_amount);
    }
}
