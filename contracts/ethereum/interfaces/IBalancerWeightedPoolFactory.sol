// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "./IBalancerRateProvider.sol";
import "./IBalancerWeightedPool.sol";

import "./IERC20.sol";

interface IBalancerWeightedPoolFactory {
    function create(
        string memory name,
        string memory symbol,
        IERC20[] memory tokens,
        uint256[] memory normalizedWeights,
        IRateProvider[] memory rateProviders,
        uint256 swapFeePercentage,
        address owner,
        bytes32 salt
    ) external returns (IBalancerWeightedPool);
}
