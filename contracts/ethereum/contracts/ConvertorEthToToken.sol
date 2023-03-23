// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IWETH.sol";
import "../interfaces/IToken.sol";

/*
 * Take some Eth, wrap it into wEth, then use it to wrap a Token at the
 * given address
 */
contract ConvertorEthToToken {
    IToken public tokenAddress_;

    address payable public wethAddress_;

    constructor(IToken _tokenAddress, IWETH _wethAddress) {
        tokenAddress_ = _tokenAddress;
        wethAddress_ = payable(address(_wethAddress));

        bool rc = IWETH(wethAddress_).approve(address(tokenAddress_), 2 **256 - 1);

        require(rc, "approve failed");
    }

    function wrapEth() public payable {
        IWETH(wethAddress_).deposit{value: msg.value}();
        tokenAddress_.erc20InTo(msg.sender, msg.value);
    }

    receive() external payable {
        require(msg.sender == address(wethAddress_), "sender not weth");
    }

    function unwrapEth(uint256 _amount) public {
        bool rc = tokenAddress_.transferFrom(msg.sender, address(this), _amount);

        require(rc, "transfer from failed");

        tokenAddress_.erc20Out(_amount);

        IWETH(wethAddress_).withdraw(_amount);

        // slither-disable-next-line low-level-calls
        (rc,) = payable(msg.sender).call{value: _amount}("");

        require(rc, "transfer out failed");
    }
}
