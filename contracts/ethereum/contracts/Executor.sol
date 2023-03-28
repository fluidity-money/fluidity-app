// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IFluidClient.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IRegistry.sol";
import "../interfaces/ITrfVariables.sol";
import "../interfaces/IUtilityGauges.sol";

struct FluidityReward {
    string clientName;
    Winner[] rewards;
}

struct OracleUpdate {
    address contractAddr;
    address newOracle;
}

contract Executor is IEmergencyMode, IUtilityGauges, IOperatorOwned {

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(
        address indexed contractAddr,
        address indexed oldOracle,
        address indexed newOracle
    );

    /// @dev if false, emergency mode is active!
    bool private noEmergencyMode_;

    /// @dev for migrations
    uint256 private version_;

    /// @dev can set emergency mode
    address private emergencyCouncil_;

    /// @dev can update contract props and oracles
    address private operator_;

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
        version_ = 1;

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;
        registry_ = _registry;

        noEmergencyMode_ = true;
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator_, "only operator");
        require(_newOperator != address(0), "no zero operator");

        operator_ = _newOperator;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function enableEmergencyMode() public {
        bool authorised = msg.sender == operator_ || msg.sender == emergencyCouncil_;
        require(authorised, "emergency only");

        noEmergencyMode_ = false;
        emit Emergency(true);
    }

    /**
     * @notice disables emergency mode, following presumably a contract upgrade
     * @notice (operator only)
     */
    function disableEmergencyMode() public {
        require(msg.sender == operator_, "operator only");

        noEmergencyMode_ = true;

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
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == operator_, "only operator");

        _updateOracle(_contractAddr, _newOracle);
    }

    /// @notice updates the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory _newOracles) public {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == operator_, "only operator");

        for (uint i = 0; i < _newOracles.length; i++) {
            _updateOracle(
                _newOracles[i].contractAddr,
                _newOracles[i].newOracle
            );
        }
    }

    function updateRegistry(IRegistry _newRegistry) public {
        require(msg.sender == operator_, "only operator");

        registry_ = _newRegistry;
    }

    function reward(
        address _token,
        FluidityReward[] calldata _rewards,
        uint _firstBlock,
        uint _lastBlock
    )
        public
    {
        require(noEmergencyMode_, "emergency mode!");

        require(msg.sender == oracles_[_token], "only oracle");

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
