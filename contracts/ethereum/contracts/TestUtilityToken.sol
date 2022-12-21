// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/IERC20.sol";
import "./IUtilityClient.sol";

interface IMintableERC20 is IERC20 {
    function mint(address user, uint amount) external;
}

contract TestUtilityToken is IUtilityClient {
    /// @dev for migrations
    uint256 private version_;

    /// @dev account that controls contract operation
    address public operator_;

    IMintableERC20 token_;

    function init(
        address operator,
        address token
    ) external {
        require(version_ == 0, "contract is already initialized");
        version_ = 1;

        operator_ = operator;
        token_ = IMintableERC20(token);
    }

    function utilityMine(UtilityWinner calldata winners) external {
        for (uint i = 0; i < winners.winners.length; i++) {
            Winner memory w = winners.winners[i];
            token_.mint(
                w.winner,
                w.amount / 10
            );
        }
    }
}
