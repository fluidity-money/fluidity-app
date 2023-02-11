// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "../IFluidClient.sol";
import "../GovToken.sol";

contract TestClient is IFluidClient {
    address oracle_;
    GovToken govToken_;

    event GotTransfered(address indexed from, address indexed to, uint amount);

    constructor(address o) {
        oracle_ = o;
        govToken_ = new GovToken();

        govToken_.init(
            "Test utility token!",
            "UTILCLIENT",
            8
        );
    }

    function transferFrom(GovToken token, uint amount) external {
        emit GotTransfered(msg.sender, address(token), amount);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) external {
        require(msg.sender == oracle_, "only the operator can use this");

        for (uint i = 0; i < rewards.length; i++) {
            govToken_.transfer(rewards[i].winner, rewards[i].amount);
            emit Reward(rewards[i].winner, rewards[i].amount, firstBlock, lastBlock);
        }
    }

    function getUtilityVars() external view returns (UtilityVars memory) {
        return UtilityVars({
            poolSizeNative: govToken_.balanceOf(address(this)),
            tokenDecimalScale: 10 ** govToken_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000
        });
    }
}
