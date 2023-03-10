// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

interface ITotalRewardPool {
    /**
     * @notice getTVL by summing the total supply and reward for each token
     *
     * @return the total TVL as 1e18
    */
    function getTVL() external retruns (uint256);

    /**
     * @notice getTotalRewardPool for each token that's known by the
     *         contract, normalising to 1e18
     *
     * @return the total prize pool as 1e18
    */
    function getTotalRewardPool() external returns (uint256);
}
