// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IERC20.sol";
import "../interfaces/IFluidClient.sol";

import "../contracts/utility-clients/BaseUtilityClient.sol";
import "../contracts/GovToken.sol";

import "forge-std/Test.sol";

contract TestUtilityClient is BaseUtilityClient {
    constructor(
        IERC20 _token,
        address _dustCollector,
        address _oracle,
        address _operator,
        address _council
    ) BaseUtilityClient(
        _token,
        _dustCollector,
        _oracle,
        _operator,
        _council
    ) {}

    function getUtilityVars() external override view returns (UtilityVars memory) {
        return UtilityVars({
            poolSizeNative: token_.balanceOf(address(this)),
            tokenDecimalScale: 10**token_.decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 2,
            deltaWeightNum: 1,
            deltaWeightDenom: 1,
            customCalculationType: "custom calculation type!"
        });
    }
}

contract TestBaseUtilityClient is Test {
    // duplicate of IFluidClient.Reward, since for some reason events aren't importable
    event Reward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    IERC20 private token;
    function setUp() public {
        token = new GovToken(
            "Token!",
            "TKN",
            1,
            100
        );
    }

    function testDrain() public {
        TestUtilityClient c = new TestUtilityClient(
            token,
            address(this),
            address(this),
            address(this),
            address(this)
        );

        // transfer 10 units to the client
        token.transfer(address(c), 10);

        uint256 ourInitialBalance = token.balanceOf(address(this));
        require(token.balanceOf(address(c)) == 10, "starting balance should be 10!");

        c.drain();

        uint256 ourFinalBalance = token.balanceOf(address(this));
        require(token.balanceOf(address(c)) == 0, "balance after drain should be 0!");
        require(ourFinalBalance - ourInitialBalance == 10, "we should have gained 10 token!");
    }

    function testEmergencyMode() public {
        TestUtilityClient c = new TestUtilityClient(
            token,
            address(this),
            address(this),
            address(this),
            address(this)
        );

        Winner[] memory winners = new Winner[](0);

        require(c.noEmergencyMode(), "defaults to no emergency mode!");
        c.batchReward(winners, 0, 0); // shouldn't revert

        c.enableEmergencyMode();
        vm.expectRevert("emergency mode!");
        c.batchReward(winners, 0, 0); // should revert
        require(!c.noEmergencyMode(), "emergency mode is now enabled!");

        c.disableEmergencyMode();
        c.batchReward(winners, 0, 0); // shouldn't revert
        require(c.noEmergencyMode(), "emergency mode is now enabled!");
    }

    function testBatchReward() public {
        TestUtilityClient c = new TestUtilityClient(
            token,
            address(this),
            address(this),
            address(this),
            address(this)
        );
        token.transfer(address(c), 100);

        address winner1 = address(0x00737b7865f84bdc86b5c8ca718a5b7a6d905776f6);
        address winner2 = address(0x00837b7865f84bdc86b5c8ca718a5b7a6d905776f6);

        Winner[] memory winners = new Winner[](2);
        winners[0] = Winner({
            winner: winner1,
            amount: 7
        });
        winners[1] = Winner({
            winner: winner2,
            amount: 8
        });

        vm.expectEmit(true, true, true, true);
        emit Reward(winner1, 7, 1, 2);

        c.batchReward(winners, 1, 2);

        require(token.balanceOf(winner1) == 7, "winner1 balance incorrect!");
        require(token.balanceOf(winner2) == 8, "winner2 balance incorrect!");
    }
}
