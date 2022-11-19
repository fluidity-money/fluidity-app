// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./Token.sol";

struct RewardPool {
  uint256 amount;
  uint8 decimals;
}

contract RewardPools {
  uint private version_;

  address operator_;

  Token[] tokens_;

  function init(address _operator, Token[] memory _tokens) public {
    require(version_ == 0, "contract is already initialised");
    version_ = 1;
    operator_ = _operator;

    for (uint i = 0; i < _tokens.length; i++) {
      tokens_.push(_tokens[i]);
    }
  }

  function addToken(Token t) public {
    require(msg.sender == operator_, "only operator can use this function!");
    tokens_.push(t);
  }

  function getPools() public returns (RewardPool[] memory rewardPool) {
    rewardPool = new RewardPool[](tokens_.length);

    for (uint i = 0; i < tokens_.length; i++) {
      Token token = tokens_[i];
      RewardPool memory pool;

      pool.amount = token.rewardPoolAmount();
      pool.decimals = token.decimals();

      rewardPool[i] = pool;
    }
  }
}
