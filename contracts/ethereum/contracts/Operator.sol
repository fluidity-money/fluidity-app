// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./Token.sol";
import "./IUtilityClient.sol";

contract Operator {
    event NewUtilityClient(address name, address client);

    /// @dev for migrations
    uint256 private version_;

    /// @dev account that controls contract operation
    address public operator_;

    /// @dev account or contract that's allowed to use the reward function
    address public oracle_;

    /// @dev fluid token address
    Token public token_;

    mapping(address => IUtilityClient) public utilityClients_;

    function init(
        address operator,
        address oracle,
        address token
    ) external {
        require(version_ == 0, "contract is already initialized");
        version_ = 1;

        operator_ = operator;
        oracle_ = oracle;
        token_ = Token(token);
    }

    function addUtilityMiner(
        address name,
        IUtilityClient client
    ) external {
        require(msg.sender == operator_, "only the operator can use this");

        utilityClients_[name] = client;
        emit NewUtilityClient(name, address(client));
    }

    function batchReward(Winner[] memory rewards, UtilityWinner[] memory utilityRewards, uint firstBlock, uint lastBlock) external {
        // todo remove blocks
        token_.batchReward(rewards, firstBlock, lastBlock);

        for (uint i = 0; i < utilityRewards.length; i++) {
            address utility = utilityRewards[i].utility;
            if (utility == address(0)) continue;

            IUtilityClient client = utilityClients_[utility];
            if (address(client) == address(0)) continue;

            client.utilityMine(utilityRewards[i]);
        }
    }

    // todo probably also a normal reward fn
}
