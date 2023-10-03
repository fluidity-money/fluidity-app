// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "../../interfaces/IBalancerWeightedPool.sol";

import "../BaseNativeToken.sol";

contract TestBalancerWeightedPool is BaseNativeToken, IBalancerWeightedPool {
    bytes32 x;
    uint256 y;

    constructor() BaseNativeToken("Base Weighted Pool Token", "BWP", 18) {
    }

    function getPoolId() external view returns (bytes32 v) {
        v = x;
        revert("test impl");
    }
}
