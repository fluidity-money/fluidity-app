// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "forge-std/Script.sol";

import "../interfaces/IFluidClient.sol";
import "../contracts/Executor.sol";
import "../contracts/Registry.sol";

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
}

contract TestSpecialUtilityMining is Script {
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

        Registry r = new Registry();
        require(address(r) == vm.envAddress("FLU_ETHEREUM_REGISTRY_ADDR"), "registry address env is set incorrectly!");

        Executor o = new Executor();
        require(address(o) == vm.envAddress("FLU_ETHEREUM_OPERATOR_CONTRACT_ADDR"), "operator address env is set incorrectly!");
        o.init(externalOperator, council, r);

        uint8 decimals = uint8(vm.envUint("FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS"));
        IFluidClient fluidToken = new FakeFluidToken(UtilityVars({
            poolSizeNative: 10_000_000 * 10**decimals,
            tokenDecimalScale: 10**decimals,
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000,
            customCalculationType: ""
        }));
        require(address(fluidToken) == vm.envAddress("FLU_ETHEREUM_FLUID_TOKEN_ADDR"), "fluid token address env is set incorrectly!");

        IFluidClient utilityClient1 = new FakeFluidToken(UtilityVars({
            poolSizeNative: 10_000_000 * 10**decimals,
            tokenDecimalScale: 10**decimals,
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000,
            customCalculationType: "worker config overrides"
        }));
        require(address(utilityClient1) == vm.envAddress("FLU_ETHEREUM_UTIL_CLIENT_ADDR"), "util client address env is set incorrectly!");

        // TODO this is just here because otherwise our nonce change messes up deploy addresses
        r.init(externalOperator);

        vm.stopBroadcast();
        // now become the operator so we can set utility clients and oracles
        vm.startBroadcast(externalOperatorKey);

        FluidityClientChange[] memory fluidClientChanges = new FluidityClientChange[](2);
        FluidityClientChange memory fluidChange1 = FluidityClientChange({
            name: "FLUID",
            overwrite: false,
            token: address(fluidToken),
            client: fluidToken
        });
        fluidClientChanges[0] = fluidChange1;

        FluidityClientChange memory fluidChange2 = FluidityClientChange({
            name: "test special utility",
            overwrite: false,
            token: address(fluidToken),
            client: utilityClient1
        });
        fluidClientChanges[1] = fluidChange2;

        r.updateUtilityClients(fluidClientChanges);

        OracleUpdate[] memory oracleChanges = new OracleUpdate[](1);
        OracleUpdate memory oracleChange = OracleUpdate({
            contractAddr: address(fluidToken),
            newOracle: oracle
        });
        oracleChanges[0] = oracleChange;
        o.updateOracles(oracleChanges);

        // set the spooler thresholds to 0
        TrfVariables memory trfVars = TrfVariables({
            currentAtxTransactionMargin: 0,
            defaultTransfersInBlock: 0,
            spoolerInstantRewardThreshold: 0,
            spoolerBatchedRewardThreshold: 0,
            defaultSecondsSinceLastBlock: 13,
            atxBufferSize: 10
        });
        r.updateTrfVariables(address(fluidToken), trfVars);

        vm.stopBroadcast();
    }
}
