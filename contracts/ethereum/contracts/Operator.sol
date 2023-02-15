// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./IFluidClient.sol";
import "./IEmergencyMode.sol";
import "./IUtilityGauges.sol";

import "./TrfVariables.sol";

struct FluidityReward {
    string clientName;
    Winner[] rewards;
}

struct OracleUpdate {
    address contractAddr;
    address newOracle;
}

contract Operator is IEmergencyMode, IUtilityGauges {
    /// @dev the utility name of the fluid token
    string constant FLUID_TOKEN = "FLUID";

    struct FluidityClientChange {
        string name;
        bool overwrite;
        address token;
        IFluidClient client;
    }

    /// @dev return type from getUtilityVars
    struct ScannedUtilityVars {
        UtilityVars vars;
        string name;
    }

    /// @notice emitted when a fluidity client is updated
    event FluidityClientChanged(
        address indexed token,
        string indexed name,
        address oldClient,
        address newClient
    );

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(
        address indexed contractAddr,
        address indexed oldOracle,
        address indexed newOracle
    );

    /// @dev if false, emergency mode is active!
    bool private noEmergency_;

    /// @dev for migrations
    uint256 private version_;

    /// @dev can set emergency mode
    address private emergencyCouncil_;

    /// @dev can update contract props and oracles
    address public operator_;

    /// @dev token => oracle
    mapping(address => address) private oracles_;

    /// @dev token => utility name => fluid client
    mapping(address => mapping(string => IFluidClient)) private fluidityClients_;

    mapping(address => TrfVariables) trfVariables_;

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     */
    function init(
        address _operator,
        address _emergencyCouncil
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 2;

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;

        noEmergency_ = true;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergency_;
    }

    function enableEmergencyMode() public {
        bool authorised = msg.sender == operator_ || msg.sender == emergencyCouncil_;
        require(authorised, "only the operator or emergency council can use this");

        noEmergency_ = false;
        emit Emergency(true);
    }

    /**
     * @notice disables emergency mode, following presumably a contract upgrade
     * @notice (operator only)
     */
    function disableEmergencyMode() public {
        require(msg.sender == operator_, "only the operator account can use this");

        noEmergency_ = true;

        emit Emergency(false);
    }

    function updateUtilityClients(FluidityClientChange[] memory clients) public {
        require(msg.sender == operator_, "only the operator account can use this");

        for (uint i = 0; i < clients.length; i++) {
            FluidityClientChange memory change = clients[i];

            address oldClient = address(fluidityClients_[change.token][change.name]);

            // either the old client must be unset (setting a completely new client)
            // or the overwrite option must be set
            require(
                oldClient == address(0) || change.overwrite,
                "trying to overwrite a client without the overwrite option set!"
            );

            fluidityClients_[change.token][change.name] = change.client;

            emit FluidityClientChanged(
                change.token,
                change.name,
                oldClient,
                address(change.client)
            );
        }
    }

    /**
     * @notice fetches utility vars for several contracts by name
     * @param token the token for which to fetch utilities
     * @param names the list of names of utilities to fetch for
     *
     * @return an array of utility vars
     */
    function getUtilityVars(
        address token,
        string[] memory names
    )
        public returns (ScannedUtilityVars[] memory)
    {
        ScannedUtilityVars[] memory vars = new ScannedUtilityVars[](names.length);
        for (uint i = 0; i < names.length; i++) {
            string memory name = names[i];

            vars[i].name = name;

            IFluidClient utility = fluidityClients_[token][name];

            // reverts if utility == 0 !
            vars[i].vars = utility.getUtilityVars();
        }

        return vars;
    }

    function _updateOracle(address contractAddr, address newOracle) internal {
        emit OracleChanged(
            contractAddr,
            oracles_[contractAddr],
            newOracle
        );

        oracles_[contractAddr] = newOracle;
    }

    function updateOracle(address contractAddr, address newOracle) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        _updateOracle(contractAddr, newOracle);
    }

    /// @notice updates the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory newOracles) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        for (uint i = 0; i < newOracles.length; i++) {
            _updateOracle(
                newOracles[i].contractAddr,
                newOracles[i].newOracle
            );
        }
    }

    /// @notice update the trf variables for a specific token
    function updateTrfVariables(address token, TrfVariables calldata trf) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        trfVariables_[token] = trf;
    }

    function getTrfVariables(address token) public view returns (TrfVariables memory) {
        return trfVariables_[token];
    }

    function getWorkerAddress(address contractAddr) public view returns (address) {
        require(noEmergencyMode(), "emergency mode!");

        return oracles_[contractAddr];
    }

    function getWorkerAddress() public view returns (address) {
        require(noEmergencyMode(), "emergency mode!");

        return oracles_[msg.sender];
    }

    function reward(
        address token,
        FluidityReward[] calldata rewards,
        uint firstBlock,
        uint lastBlock
    )
        public
    {
        require(noEmergencyMode(), "emergency mode!");

        require(msg.sender == oracles_[token], "only the token's oracle can use this");

        for (uint i = 0; i < rewards.length; i++) {
            FluidityReward memory fluidReward = rewards[i];

            IFluidClient client = fluidityClients_[token][fluidReward.clientName];

            // this will revert if client == address(0)
            client.batchReward(fluidReward.rewards, firstBlock, lastBlock);
        }
    }
}
