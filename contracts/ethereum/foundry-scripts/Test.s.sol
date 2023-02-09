// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

import "forge-std/Script.sol";

import "../contracts/IFluidClient.sol";
import "../contracts/Operator.sol";

contract FakeFluidToken is IFluidClient {
    UtilityVars vars;

    event Transfer(address indexed, address indexed, uint256);

    constructor(UtilityVars memory v) {
        vars = v;
    }

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) external {
        for (uint i = 0; i < rewards.length; i++) {
            emit Reward(rewards[i].winner, rewards[i].amount, firstBlock, lastBlock);
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external returns (UtilityVars memory) {
        return vars;
    }

    // emits a transfer event
    function transfer(address from, address to, uint value) public {
        emit Transfer(from, to, value);
    }
}

contract TestScript is Script {
    function getPrivateKey(string memory key, uint32 index) public returns (uint) {
        return vm.deriveKey(key, index);
    }

    function getAddress(string memory key, uint32 index) public returns (address) {
        return vm.addr(getPrivateKey(key, index));
    }

    function run() external {
        string memory k = vm.envString("FLU_ETHEREUM_SEED_PHRASE");

        uint deployerKey = getPrivateKey(k, 0);
        address council = getAddress(k, 1);
        address oracle = getAddress(k, 2);
        address externalOperator = getAddress(k, 3);
        uint externalOperatorKey = getPrivateKey(k, 3);

        vm.startBroadcast(deployerKey);

        Operator o = new Operator();
        require(address(o) == vm.envAddress("FLU_ETHEREUM_OPERATOR_CONTRACT_ADDR"), "operator address env is set incorrectly!");
        o.init(externalOperator, council);

        IFluidClient fluidToken = new FakeFluidToken(UtilityVars({
            poolSizeNative: 10_000_000 * 10**6,
            tokenDecimalScale: 10**6,
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000
        }));
        require(address(fluidToken) == vm.envAddress("FLU_ETHEREUM_UTIL_TOKEN_ADDR"), "util token address env is set incorrectly!");

        IFluidClient utilityClient1 = new FakeFluidToken(UtilityVars({
            poolSizeNative: 500_000 * 10**18,
            tokenDecimalScale: 10**18,
            exchangeRateNum: 10,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000
        }));
        require(address(utilityClient1) == vm.envAddress("FLU_ETHEREUM_UTIL_CLIENT_ADDR"), "util client address env is set incorrectly!");

        vm.stopBroadcast();
        // now become the operator so we can set utility clients and oracles
        vm.startBroadcast(externalOperatorKey);

        Operator.FluidityClientChange[] memory fluidClientChanges = new Operator.FluidityClientChange[](2);
        Operator.FluidityClientChange memory fluidChange1 = Operator.FluidityClientChange({
            name: "FLUID",
            overwrite: false,
            token: address(fluidToken),
            client: fluidToken
        });
        fluidClientChanges[0] = fluidChange1;

        Operator.FluidityClientChange memory fluidChange2 = Operator.FluidityClientChange({
            name: "testClient",
            overwrite: false,
            token: address(fluidToken),
            client: utilityClient1
        });
        fluidClientChanges[1] = fluidChange2;

        o.updateUtilityClients(fluidClientChanges);

        Operator.OracleUpdate[] memory oracleChanges = new Operator.OracleUpdate[](1);
        Operator.OracleUpdate memory oracleChange = Operator.OracleUpdate({
            contractAddr: address(fluidToken),
            newOracle: oracle
        });
        oracleChanges[0] = oracleChange;
        o.updateOracles(oracleChanges);

        vm.stopBroadcast();
    }
}
