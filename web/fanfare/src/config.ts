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
                    "0x9d1089802eE608BA84C5c98211afE5f37F96B36C",
                    "0xADc234a4e90E2045f353F5d4fCdE66144d23b458",
                    "0x0B319dB00d07C8fAdfaAEf13C910141a5dA0aa8F",
                    "0x2bE1e42BF263AaB47D27Ba92E72c14823e101D7C",
                    "0x244517Dc59943E8CdFbD424Bdb3262c5f04a1387"
                ]
            })
        }),
        TransactionObserver({
            connector: EthereumConnector({
                chainRpcUrl: process.env.FLU_ARB_WS_RPC ?? '',
                name: 'arbitrum',
                contractAddressSet: [
                    "0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A",
                    "0xC9FA90D24B7103Ad2215DE52afec5e1E4C7a6e62",
                    "0x1b40e7812E75D02Eef97E4399c33865D2Ff5952b",
                ]
            })
        }),
    ],
});