// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/Address.sol";
import "./Registry.sol";

contract Operator {
    using Address for address;

    struct OracleUpdate {
        address contractAddr;
        address newOracle;
    }

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(address indexed contractAddr, address indexed oldOracle, address indexed newOracle);

    /// @notice emitted when an emergency is declared!
    event Emergency(bool indexed enabled);

    /// @dev deprecated, emergency mode is part of the registry now
    bool private __deprecated_1;

    /// @dev for migrations
    uint256 private version_;

    /// @dev deprecated, emergency mode is part of the registry now
    address private __deprecated_2;

    /// @dev can update contract props and oracles
    address private operator_;

    /// @dev token => oracle
    mapping(address => address) private oracles_;

    Registry private registry_;

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     */
    function init(
        address _operator,
        address _registry
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 2;

        operator_ = _operator;
        registry_ = Registry(_registry);
    }

    // v1 didn't have the registry
    function migrate_1(Registry _registry) public {
        require(version_ == 1, "contract needs to be version 1");
        require(msg.sender == operator_, "only the operator can use this");
        version_ = 2;

        registry_ = _registry;
    }

    /// @notice updates the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory newOracles) public {
        require(registry_.noGlobalEmergency(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        for (uint i = 0; i < newOracles.length; i++) {
            OracleUpdate memory oracle = newOracles[i];

            emit OracleChanged(oracle.contractAddr, oracles_[oracle.contractAddr], oracle.newOracle);

            oracles_[oracle.contractAddr] = oracle.newOracle;
        }
    }

    function getWorkerAddress(address contractAddr) public view returns (address) {
        require(registry_.noGlobalEmergency(), "emergency mode!");

        return oracles_[contractAddr];
    }

    function getWorkerAddress() public view returns (address) {
        require(registry_.noGlobalEmergency(), "emergency mode!");

        return oracles_[msg.sender];
    }

    /// @dev oracle function to reward
    function reward(address token, FluidityReward[] calldata rewards, uint firstBlock, uint lastBlock) public {
        address oracle = oracles_[token];
        require(msg.sender == oracle, "not authorised to use this!");

        registry_.reward(token, rewards, firstBlock, lastBlock);
    }
}
