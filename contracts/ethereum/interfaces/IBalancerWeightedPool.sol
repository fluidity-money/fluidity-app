// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "./IERC20.sol";

interface IBalancerWeightedPool is IERC20 {
    function getPoolId() external view returns (bytes32);
}
