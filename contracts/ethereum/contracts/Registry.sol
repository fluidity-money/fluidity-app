// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/Address.sol";
import "./IFluidClient.sol";

struct FluidityReward {
    string clientName;
    Winner[] rewards;
}

contract Registry {
    using Address for address;

    /// @dev the utility name of the fluid token
    string constant FLUID_TOKEN = "FLUID";

    /// @dev return type from getTrfVars
    struct ScannedTrfVar {
        TrfVars vars;
        bool found;
        string name;
    }

    struct FluidityClientChange {
        string name;
        bool overwrite;
        address token;
        IFluidClient client;
    }

    /// @notice emitted when a fluidity client is updated
    event FluidityClientChanged(address indexed token, string indexed name, address oldClient, address newClient);

    /// @notice emitted when an emergency is declared!
    event Emergency(bool indexed enabled);

    /// @dev if false, emergency mode is active!
    bool private noGlobalEmergency_;

    /// @dev for migrations
    uint256 private version_;

    /// @dev can set emergency mode
    address private emergencyCouncil_;

    /// @dev can set emergency mode and update contract props
    address private operator_;

    /// @dev token => utility name => fluid client
    mapping(address => mapping(string => IFluidClient)) private fluidityClients_;

    // trf vars go here !

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     * @param _emergencyCouncil to use that can set emergency mode
     */
    function init(
        address _operator,
        address _emergencyCouncil
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 1;

        operator_ = _operator;

        emergencyCouncil_ = _emergencyCouncil;

        noGlobalEmergency_ = true;
    }

    function noGlobalEmergency() public view returns (bool) {
        return noGlobalEmergency_;
    }

    function enableEmergencyMode() public {
        bool authorised = msg.sender == operator_ || msg.sender == emergencyCouncil_;
        require(authorised, "only the operator or emergency council can use this");

        noGlobalEmergency_ = false;
        emit Emergency(true);
    }

    /**
     * @notice disables emergency mode, following presumably a contract upgrade
     * @notice (operator only)
     */
    function disableEmergencyMode() public {
        require(msg.sender == operator_, "only the operator account can use this");

        noGlobalEmergency_ = true;

        emit Emergency(false);
    }

    function updateUtilityClients(FluidityClientChange[] memory clients) public {
        require(msg.sender == operator_, "only the operator account can use this");

        for (uint i = 0; i < clients.length; i++) {
            FluidityClientChange memory change = clients[i];

            address oldClient = address(fluidityClients_[change.token][change.name]);

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

    function reward(address token, FluidityReward[] calldata rewards, uint firstBlock, uint lastBlock) public {
        require(noGlobalEmergency(), "emergency mode!");

        require(msg.sender == operator_, "only the operator can use this");

        for (uint i = 0; i < rewards.length; i++) {
            FluidityReward memory fluidReward = rewards[i];

            IFluidClient client = fluidityClients_[token][fluidReward.clientName];

            // this will revert if client == address(0)
            client.batchReward(fluidReward.rewards, firstBlock, lastBlock);
        }
    }

    /**
     * @notice fetches trf vars for several contracts by name
     * @param token the token for which to fetch utilities
     * @param names the list of names of utilities to fetch for
     *
     * @return an array of trf vars
     */
    function getTrfVars(address token, string[] memory names) public returns (ScannedTrfVar[] memory) {
        ScannedTrfVar[] memory vars = new ScannedTrfVar[](names.length);
        for (uint i = 0; i < names.length; i++) {
            string memory name = names[i];
            vars[i].name = name;
            IFluidClient utility = fluidityClients_[token][name];

            if (address(utility) == address(0)) {
                vars[i].found = false;
            } else {
                vars[i].found = true;
                vars[i].vars = utility.getTrfVars();
            }
        }

        return vars;
    }
}
