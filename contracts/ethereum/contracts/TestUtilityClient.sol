pragma solidity 0.8.11;
pragma abicoder v2;

import "./Fluidity.sol";
import "./openzeppelin/IERC20Metadata.sol";

contract TestClient is IFluidity {
    address operator_;
    IERC20Metadata govToken_;

    constructor(IERC20Metadata g, address o) {
        govToken_ = g;
        operator_ = o;
    }

    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) external {
        require(msg.sender == operator_, "only the operator can use this");

        for (uint i = 0; i < rewards.length; i++) {
            govToken_.transfer(rewards[i].winner, rewards[i].amount);
            emit Reward(rewards[i].winner, rewards[i].amount, firstBlock, lastBlock);
        }
    }

    function getTrfVars() external returns (TrfVars memory) {
        return TrfVars({
            poolSizeNative: govToken_.balanceOf(address(this)),
            tokenDecimalScale: 10 ** govToken_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: TRF_VAR_NOT_AVAILABLE,
            deltaWeightDenom: TRF_VAR_NOT_AVAILABLE
        });
    }
}
