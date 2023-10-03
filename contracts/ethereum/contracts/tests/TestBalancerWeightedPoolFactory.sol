// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "../../interfaces/IBalancerRateProvider.sol";
import "../../interfaces/IBalancerWeightedPoolFactory.sol";
import "../../interfaces/IBalancerWeightedPool.sol";

import "../../interfaces/IERC20.sol";

contract TestBalancerWeightedPoolFactory is IBalancerWeightedPoolFactory {
    uint x;

    function create(
        string memory /* name */,
        string memory /* symbol */,
        IERC20[] memory /* tokens */,
        uint256[] memory /* normalizedWeights */,
        IRateProvider[] memory /* rateProviders */,
        uint256 /* swapFeePercentage */,
        address /* owner */,
        bytes32 /* salt */
    ) external returns (IBalancerWeightedPool) {
        ++x;
        revert("test impl");
    }
}
