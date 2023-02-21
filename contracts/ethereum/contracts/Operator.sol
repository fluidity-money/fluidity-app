// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IFluidClient.sol";
import "../interfaces/IRegistry.sol";
import "../interfaces/IUtilityGauges.sol";
import "../interfaces/ITrfVariables.sol";

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

    /// @dev registry to get configuration details from
    IRegistry public registry_;

    /// @dev token => oracle
    mapping(address => address) private oracles_;

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     */
    function init(
        address _operator,
        address _emergencyCouncil,
        IRegistry _registry
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 2;

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;
        registry_ = _registry;

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

    function _updateOracle(address _contractAddr, address _newOracle) internal {
        emit OracleChanged(
            _contractAddr,
            oracles_[_contractAddr],
            _newOracle
        );

        oracles_[_contractAddr] = _newOracle;
    }

    function updateOracle(address _contractAddr, address _newOracle) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        _updateOracle(_contractAddr, _newOracle);
    }

    /// @notice updates the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory _newOracles) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        for (uint i = 0; i < _newOracles.length; i++) {
            _updateOracle(
                _newOracles[i].contractAddr,
                _newOracles[i].newOracle
            );
        }
    }

    function getWorkerAddress(address _contractAddr) public view returns (address) {
        require(noEmergencyMode(), "emergency mode!");

        return oracles_[_contractAddr];
    }

    function getWorkerAddress() public view returns (address) {
        require(noEmergencyMode(), "emergency mode!");

        return oracles_[msg.sender];
    }

    function reward(
        address _token,
        FluidityReward[] calldata _rewards,
        uint _firstBlock,
        uint _lastBlock
    )
        public
    {
        require(noEmergencyMode(), "emergency mode!");

        require(msg.sender == oracles_[_token], "only the token's oracle can use this");

        for (uint i = 0; i < _rewards.length; i++) {
            FluidityReward memory fluidReward = _rewards[i];

            IFluidClient client = registry_.getFluidityClient(
                _token,
                fluidReward.clientName
            );

            // this will revert if client == address(0)
            client.batchReward(fluidReward.rewards, _firstBlock, _lastBlock);
        }
    }
}
