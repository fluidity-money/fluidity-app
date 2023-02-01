pragma solidity 0.8.11;
pragma abicoder v2;

/// @dev parameter for the batchReward function
struct Winner {
    address winner;
    uint256 amount;
}

/// @dev returned in the TrfVars struct to indicate a variable wasn't available onchain
uint constant TRF_VAR_NOT_AVAILABLE = type(uint256).max;

/// @dev returned from the getTrfVars function to calculate distribution amounts
struct TrfVars {
    uint256 poolSizeNative;
    uint256 tokenDecimalScale;
    uint256 exchangeRateNum;
    uint256 exchangeRateDenom;
    uint256 deltaWeightNum;
    uint256 deltaWeightDenom;
}

interface IFluidClient {
    /// @notice MUST be emitted when any reward is paid out
    event Reward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /**
     * @notice pays out several rewards
     * @notice only usable by the trusted oracle account
     *
     * @param rewards the array of rewards to pay out
     */
    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) external;

    /**
     * @notice gets stats on the token being distributed
     * @return the variables for the trf, or TRF_VAR_NOT_AVAILABLE
     */
    function getTrfVars() external returns (TrfVars memory);
}
