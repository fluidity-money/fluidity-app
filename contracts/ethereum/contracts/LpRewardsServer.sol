// SPDX-License-Identifier: GPL

// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/ILpRewardsServer.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IERC20.sol";
import "./openzeppelin/SafeERC20.sol";


contract LpRewardsServer is ILpRewardsServer, IOperatorOwned {
    using SafeERC20 for IERC20;

    /// @notice emitted when an LP reward is paid out
    event LpReward(
        address indexed recipient,
        address indexed token,
        uint256 amount
    );

    uint8 private version_;

    /// @dev the account that is able to pay out rewards, should be the executor
    address private oracle_;

    /// @dev the user account that is able to accessed permissioned functions
    address private operator_;

    function init(address _oracle, address _operator) public {
        require(version_ == 0, "already initialised");
        version_ = 1;

        oracle_ = _oracle;
        operator_ = _operator;
    }

    function reward(address _user, LpRewards[] memory _rewards) external {
        require(msg.sender == oracle_, "oracle only");

        for (uint i = 0; i < _rewards.length; i++) {
            address token = _rewards[i].token;
            uint amount = _rewards[i].amount;

            IERC20(token).safeTransfer(_user, amount);

            emit LpReward(_user, token, amount);
        }
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator_, "only operator");
        require(_newOperator != address(0), "zero operator");

        emit NewOperator(operator_, _newOperator);

        operator_ = _newOperator;
    }
}

