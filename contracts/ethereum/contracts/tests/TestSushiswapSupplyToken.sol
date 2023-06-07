// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IERC20.sol";

import "../../interfaces/ISushiswapBentoBox.sol";
import "../../interfaces/ISushiswapPool.sol";

uint256 constant MAX_UINT256 = type(uint256).max;

contract TestSushiswapSupplyToken {
    IERC20 tokenA_;

    IERC20 tokenB_;

    ISushiswapBentoBox bento_;

    ISushiswapPool pool_;

    constructor(
        IERC20 _tokenA,
        IERC20 _tokenB,
        ISushiswapBentoBox _bento,
        ISushiswapPool _pool
    ) {
        tokenA_ = _tokenA;
        tokenB_ = _tokenB;
        bento_ = _bento;
        pool_ = _pool;

        tokenA_.approve(address(bento_), MAX_UINT256);
        tokenB_.approve(address(bento_), MAX_UINT256);
    }

    function deposit(uint256 _tokenAAmount, uint256 _tokenBAmount) public {
        tokenA_.transferFrom(msg.sender, address(this), _tokenAAmount);
        tokenB_.transferFrom(msg.sender, address(this), _tokenBAmount);
        bento_.deposit(tokenA_, address(this), address(pool_), _tokenAAmount, 0);
        bento_.deposit(tokenB_, address(this), address(pool_), _tokenBAmount, 0);
        pool_.mint(abi.encode(address(this)));
    }

    function withdraw() public {
        uint256 lpTokens = pool_.balanceOf(address(this));
        pool_.transfer(address(pool_), lpTokens);
        pool_.burn(abi.encode(address(msg.sender), true));
    }
}
