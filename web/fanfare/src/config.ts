import { 
    mergeSettings,
 } from './types/Config';

 import {
    GraphQLObserver,
 } from './observers';


export const FanfareConfig = mergeSettings({
    unhealthyThreshold: 5,
    services: [
        // GraphQLObserver(
        //     'wss://localhost:4000/graphql',
        //     query,
        //     {
        //         transform: RewardTransformer,
        //         key: process.env.GRAPHQL_TOKEN,
        //     },
        // ),
        // TransactionObserver(
        //     'wss://localhost:4000/rpc',
        //     EthereumConnector,
        //     {
        //         key: process.env.ETHEREUM_TOKEN,
        //     },
        // ),
    ],
});