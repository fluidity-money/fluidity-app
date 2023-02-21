// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

interface ITotalRewardPool {
    /**
     * @notice getTotalRewardPool for each token that's known by the
     *         contract, normalising to 1e18
     *
     * @return the total prize pool as 1e18
    */
    function getTotalRewardPool() external returns (uint256);
}
