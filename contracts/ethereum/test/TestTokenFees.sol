// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../contracts/Token.sol";
import "../contracts/GovToken.sol";
import "../contracts/StupidLiquidityProvider.sol";

contract TestTokenFees {
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

    function testWrapFee() public {
        token.setFeeDetails(10, 0, address(liq));
        token.addFeeWhitelist(address(this), false);

        uint256 initialBalance = token.balanceOf(address(this));

        token.erc20In(100);
        require(
            token.balanceOf(address(this)) - initialBalance == 99,
            "self f bal = 99"
        );

        token.erc20In(100);
        require(
            token.balanceOf(address(this)) - initialBalance == 99*2,
            "self f bal = 99*2"
        );

        token.erc20Out(99*2);
        require(
            token.balanceOf(address(this)) - initialBalance == 0,
            "self f bal = 0"
        );
    }

    function testUnwrapFee() public {
        token.setFeeDetails(0, 10, address(liq));
        token.addFeeWhitelist(address(this), false);

        token.erc20In(200);
        require(token.balanceOf(address(this)) == 200, "self f bal = 200");

        uint256 initialBalance = underlying.balanceOf(address(this));

        token.erc20Out(100);
        require(
            underlying.balanceOf(address(this)) - initialBalance == 99,
            "withdrew 99 tokens"
        );

        token.erc20Out(100);
        require(
            underlying.balanceOf(address(this)) - initialBalance == 99*2,
            "withdrew 99*2 tokens"
        );
    }

    function testFeeException() public {
        token.setFeeDetails(10, 10, address(liq));
        token.addFeeWhitelist(address(this), true);

        uint256 initialFBalance = token.balanceOf(address(this));
        uint256 initialUBalance = underlying.balanceOf(address(this));

        token.erc20In(100);
        token.erc20Out(100);

        require(
            token.balanceOf(address(this)) == initialFBalance,
            "self f bal should be unchanged"
        );

        require(
            underlying.balanceOf(address(this)) == initialUBalance,
            "self u bal should be unchanged"
        );
    }
}
