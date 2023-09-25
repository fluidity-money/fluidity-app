// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IFluidClient.sol";
import "../../interfaces/IEmergencyMode.sol";
import "../../interfaces/IERC20.sol";

import "../openzeppelin/SafeERC20.sol";

// BaseUtilityClient provides a utility client that can batchreward, drain, and supports emergency mode
// it does not provide getUtilityVars
abstract contract BaseUtilityClient is IFluidClient, IEmergencyMode {
    using SafeERC20 for IERC20;

    event DustCollected(address destination, uint amount);

    IERC20 immutable token_;

    address immutable dustCollector_;

    address internal oracle_;
    address internal operator_;
    address internal emergencyCouncil_;

    bool internal noEmergencyMode_;

    constructor(
        IERC20 _token,
        address _dustCollector,
        address _oracle,
        address _operator,
        address _council
    ) {
        token_ = _token;

        dustCollector_ = _dustCollector;
        oracle_ = _oracle;
        operator_ = _operator;
        emergencyCouncil_ = _council;

        noEmergencyMode_ = true;
    }

    function drain() external {
        require(msg.sender == operator_, "only operator");

        uint balance = token_.balanceOf(address(this));

        token_.safeTransfer(dustCollector_, balance);

        emit DustCollected(dustCollector_, balance);
    }

    // implements IFluidClient

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory _rewards, uint _firstBlock, uint _lastBlock) external {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == oracle_, "only oracle");

        uint poolAmount = token_.balanceOf(address(this));

        for (uint i = 0; i < _rewards.length; i++) {
            Winner memory winner = _rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            token_.safeTransfer(winner.winner, winner.amount);
            emit Reward(
                winner.winner,
                winner.amount,
                _firstBlock,
                _lastBlock
            );
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external virtual view returns (UtilityVars memory);

    // implements IEmergencyMode

    /// @inheritdoc IEmergencyMode
    function enableEmergencyMode() external {
        require(msg.sender == emergencyCouncil_ || msg.sender == operator_, "not allowed");

        noEmergencyMode_ = false;

        emit Emergency(true);
    }

    /// @inheritdoc IEmergencyMode
    function disableEmergencyMode() external {
        require(msg.sender == operator_, "not allowed");

        noEmergencyMode_ = true;

        emit Emergency(false);
    }

    /// @inheritdoc IEmergencyMode
    function noEmergencyMode() external view returns (bool) {
        return noEmergencyMode_;
    }

    /// @inheritdoc IEmergencyMode
    function emergencyCouncil() external view returns (address) {
        return emergencyCouncil_;
    }
}
