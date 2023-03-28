import { 
    mergeSettings,
 } from './types/Config';

 import {
    GraphQLObserver,
    TransactionObserver
 } from './observers';
import { EthereumConnector } from './connectors/Ethereum';


export default mergeSettings({
    unhealthyThreshold: 5,
    debug: false,
    services: [
        // GraphQLObserver(
        //     'wss://localhost:4000/graphql',
        //     query,
        //     {
        //         transform: RewardTransformer,
        //         key: process.env.GRAPHQL_TOKEN,
        //     },
        // ),
        TransactionObserver({
            connector: EthereumConnector({
                chainRpcUrl: process.env.FLU_ETH_WS_RPC ?? '',
                name: 'ethereum',
                contractAddressSet: [
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                    "0x9d1089802eE608BA84C5c98211afE5f37F96B36C",
                    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                    "0xADc234a4e90E2045f353F5d4fCdE66144d23b458",
                    "0x0000000000085d4780B73119b644AE5ecd22b376",
                    "0x0B319dB00d07C8fAdfaAEf13C910141a5dA0aa8F",
                    "0x853d955aCEf822Db058eb8505911ED77F175b99e",
                    "0x2bE1e42BF263AaB47D27Ba92E72c14823e101D7C",
                    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                    "0x244517Dc59943E8CdFbD424Bdb3262c5f04a1387"
                ]
            })
        }),
    ],
});