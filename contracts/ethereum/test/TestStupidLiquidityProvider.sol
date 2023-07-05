// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../contracts/Token.sol";
import "../contracts/GovToken.sol";
import "../contracts/StupidLiquidityProvider.sol";

contract TestStupidLiquidityProvider {
    IERC20 private underlying;
    Token private token;
    StupidLiquidityProvider private liq;

    function setUp() public {
        underlying = new GovToken(
            "testUnderlying",
            "TEST",
            6,
            100 * 10**6
        );

        token = new Token();
        liq = new StupidLiquidityProvider();

        liq.init(address(underlying), address(token));
        token.init(
            address(liq),
            6,
            "fluid test token",
            "fTEST",
            address(this),
            address(this),
            address(this)
        );

        underlying.approve(address(token), type(uint256).max);
    }

    function test() public {
        token.setFeeDetails(10, 0, address(liq));

        token.erc20In(100);

        require(token.balanceOf(address(this)) == 99, "self f bal = 99)");
        require(token.balanceOf(address(liq)) == 1, "liq f bal = 1)");
        require(underlying.balanceOf(address(liq)) == 100, "liq norm bal = 100)");

        require(token.rewardPoolAmount() == 1, "reward pool amt = 1");

        token.erc20In(100);
        require(token.rewardPoolAmount() == 2, "reward pool amt = 2");

        Winner[] memory winners = new Winner[](1);
        winners[0] = Winner({
            winner: address(0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6),
            amount: 2
        });

        token.batchReward(winners, 1, 2);

        require(token.rewardPoolAmount() == 0, "reward pool amt = 0");

        token.erc20Out(99*2);

        require(token.rewardPoolAmount() == 0, "reward pool amt = 0");
    }
}
