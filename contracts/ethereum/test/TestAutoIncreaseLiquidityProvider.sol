// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../contracts/Token.sol";
import "../contracts/AutoIncreaseLiquidityProvider.sol";

import "../contracts/tests/TestGovToken.sol";

import "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";

contract TestAutoIncreaseLiquidityProvider is Test {
    IERC20 private underlying;
    Token private token;
    AutoIncreaseLiquidityProvider private liq;
    Vm.Wallet signer;

    function setUp() public {
        uint256 key = uint256(keccak256("FLUIDITY"));
        signer = vm.createWallet(key);
        vm.startBroadcast(signer.privateKey);

        underlying = new TestGovToken(
            "testUnderlying",
            "TEST",
            6,
            type(uint256).max
        );

        token = new Token();
        liq = new AutoIncreaseLiquidityProvider();

        liq.init(address(underlying), address(token), 100 * 1e6);

        token.init(
            address(liq),
            6,
            "fluid test token",
            "fTEST",
            signer.addr, // emergency council
            signer.addr, // operator
            signer.addr // oracle
        );

        uint256 rewardPool = 1000000000000;

        underlying.approve(address(token), type(uint256).max);

        underlying.transfer(address(liq), rewardPool);
    }

    function test() public {
        // see if the token count has increased proportionally to the
        // amount of seconds since we deployed the contract.

        uint256 currentTokenAmount = liq.totalPoolAmount();

        vm.warp(liq.deploymentTs_() + 1); // so we dont' have any division by zeroes

        // increase a bit in the future, accounting for any blocks that were made to do stuff

        vm.warp(liq.deploymentTs_() + 100);

        uint256 expectedAmount = currentTokenAmount + (100 * 100 * 1e6);

        assertEq(expectedAmount, liq.totalPoolAmount(), "total pool amount not equal");

        uint256 supplyAmount = 100 * 1e6;

        token.erc20In(supplyAmount);

        assertEq(
            token.balanceOf(signer.addr), supplyAmount,
            "balance of the amount after doing erc20 in is inconsistent"
        );

        uint256 drainAmount = 20 * 1e6;

        token.erc20Out(drainAmount);

        assertEq(drainAmount, liq.amountTaken_(), "drain amount not consistent");

        assertEq(
            expectedAmount - drainAmount, liq.totalPoolAmount(),
            "pool after drain not equal"
        );
    }
}
