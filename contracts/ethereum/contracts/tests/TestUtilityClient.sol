// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IFluidClient.sol";

import "./TestGovToken.sol";

contract TestClient is IFluidClient {
    address oracle_;
    TestGovToken govToken_;

    event GotTransfered(address indexed from, address indexed to, uint amount);

    constructor(address o) {
        oracle_ = o;
        govToken_ = new TestGovToken(
            "Test utility token!",
            "UTILCLIENT",
            8,
            1
        );
    }

    function transferFrom(TestGovToken token, uint amount) external {
        emit GotTransfered(msg.sender, address(token), amount);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function batchReward(
        Winner[] memory _rewards,
        uint _firstBlock,
        uint _lastBlock,
        bytes32 _extraData
    ) external {
        require(msg.sender == oracle_, "only the operator can use this");

        for (uint i = 0; i < _rewards.length; i++) {
            govToken_.transfer(_rewards[i].winner, _rewards[i].amount);
            emit RewardV2(
                _rewards[i].winner,
                _rewards[i].amount,
                _firstBlock,
                _lastBlock,
                _extraData
            );
        }
    }

    function getUtilityVars() external view returns (UtilityVars memory) {
        return UtilityVars({
            poolSizeNative: govToken_.balanceOf(address(this)),
            tokenDecimalScale: 10 ** govToken_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000,
            customCalculationType: ""
        });
    }
}
