import { ethers, JsonRpcProvider, Contract } from 'ethers';

import { ERC20 } from '../abi';

import Web3 from "web3";

import { AbiItem } from "web3-utils";
import BigNumber from "bn.js";

import { Transaction, NotificationType } from "../types/OutputMessage";
import { amountToDecimalString, shorthandAmountFormatter } from "../util";

type EthereumConnectorProps = {
    chainRpcUrl: string;
    contractAddressSet: Array<string>;
    contractAbi?: any;
    name: string;
}

export const EthereumConnector = ({
    chainRpcUrl,
    contractAddressSet,
    contractAbi = ERC20,
    name: chainName,
}: EthereumConnectorProps) => {
    let onErrorCallback: (err: Error) => void;
    let onWatchdogFailureCallback: () => void;
    let watchdogInterval: NodeJS.Timer;

    const onTransaction = (callback: (tx: Transaction) => void) => {
        const provider = new Web3(chainRpcUrl).eth;

        // Setup watchdog
        watchdogInterval = setInterval(() => {
            // Get the current block number
            provider
                .getBlockNumber().then(() => {}).catch((_) => {
                    onWatchdogFailureCallback();
                })
        }, 30000);

        contractAddressSet.forEach((contractAddress) => {
            const token = new provider.Contract(contractAbi as unknown as AbiItem, contractAddress);
            token.methods.decimals().call().then((decimals: number) => {
                token.events.Transfer({
                    fromBlock: 'latest',
                }).on('data', (event: {
                    transactionHash: string;
                    returnValues: { from: string; to: string; value: BigNumber };
                }) => {
                    const { from: source, to: destination, value: amount } = event.returnValues;

                    const uiTokenAmount = amountToDecimalString(amount.toString(), decimals);

                    const transaction: Transaction = {
                        type: NotificationType.ONCHAIN,
                        source: source,
                        destination: destination,
                        amount: shorthandAmountFormatter(uiTokenAmount, 3),
                        token: contractAddress,
                        transactionHash: event.transactionHash,
                        rewardType: "",
                    };
                    callback(transaction);
                }).on('error', async (error: unknown) => {
                    onErrorCallback(error as Error);
                });
            });
        });
    }

    return {
        onTransaction,
        onError: (callback: (err: Error) => void) => {
            onErrorCallback = callback;
        },
        onWatchdogFailure: (callback: () => void) => {
            onWatchdogFailureCallback = callback;
        },
        name: () => chainName,
    }
}
