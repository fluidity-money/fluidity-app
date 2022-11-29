import { setTimeout } from "timers/promises";
import { captureException } from "@sentry/remix";
import { Observable } from "rxjs";

import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";

import Web3 from "web3";

import { AbiItem } from "web3-utils";
import BigNumber from "bn.js";
import { PipedTransaction, NotificationType } from "./types";

import config from "~/webapp.config.server";
import { amountToDecimalString, shorthandAmountFormatter } from "~/util";

const onListen = (token: string, address: string, network = 0) =>
  new Observable<PipedTransaction>((subscriber) => {
    new new Web3(config.drivers["ethereum"][network].rpc.ws ?? "").eth.Contract(
      IERC20.abi as unknown as AbiItem,
      address
    ).events
      .Transfer({
        fromBlock: "latest",
      })
      .on(
        "data",
        (event: {
          transactionHash: string;
          returnValues: { from: string; to: string; value: BigNumber };
        }) => {
          const {
            from: source,
            to: destination,
            value: amount,
          } = event.returnValues;

          const uiTokenAmount = amountToDecimalString(amount.toString(), 6);

          const transaction: PipedTransaction = {
            type: NotificationType.ONCHAIN,
            source: source,
            destination: destination,
            amount: shorthandAmountFormatter(uiTokenAmount, 3),
            token,
            transactionHash: event.transactionHash,
            rewardType: "",
          };
          subscriber.next(transaction);
        }
      )
      .on("error", async (error: unknown) => {
        // On websockets errors sleep for a while and do a manual instatiation of listening again
        captureException(
          new Error(
            `Error on ethereum driver listener ... failed to reconect. retrying in 5 seconds :: ${error}`
          ),
          {
            tags: {
              section: "drivers/ethereum",
            },
          }
        );

        await setTimeout(5000);
        onListen(token, address, network);
      });
  });

export const ethGetTransactionsObservable = (
  token: string,
  address: string,
  network = 0
) => onListen(token, address, network);
