// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IERC20.sol";

/// @dev FP_COEFFICIENT to use as the floating point coefficient
uint256 constant FP_COEFFICIENT = 1e18;

struct LiquidityMultiplier {
    uint256 amountLocked;
    uint256 secondsLocked;
    uint256 timestamp;
}

/**
* Network(s): Ethereum & Arbitrum
*
* * Supported LP Tokens for assets:
* - fUSDC
* - fDAI
* - fUSDT
*
* * In the following protocols:
* - UniSwap
* - SushiSwap
*/

contract Staking {
    uint8 private version_;

    mapping (IERC20 => bool) private tokens_;

    mapping(address => mapping(IERC20 => uint256)) private balances_;

    mapping(address => LiquidityMultiplier) private multipliers_;

    function init(IERC20[] calldata _supportedTokens) public {
        require(version_ == 0, "already setup");

        for (uint i = 0; i < _supportedTokens.length; i++)
            tokens_[_supportedTokens[i]] = true;

        version_ = 1;
    }

    function calculateLinearMultiplierSingleStake(
        uint256 _daysAfterEpoch,
        uint256 _lockTime
    ) public pure returns (uint256) {
        // return (396 / 11315 - 396 / 4129975 * _lockTime) * _daysAfterEpoch + 396 * _lockTime / 133225 - 31 / 365;
    }

    function calculateLinearMultiplier(
    ) public pure returns (uint256) {
        return 0;
    }

    function depositToken(IERC20 _token, uint256 _amount) public {
        require(tokens_[_token], "token not supported");

        balances_[msg.sender][_token] += _amount;

        bool rc = _token.transferFrom(msg.sender, address(this), _amount);

        require(rc, "transfer from failed");
    }
}
