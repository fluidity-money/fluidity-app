import { Observable, merge, filter } from "rxjs";

import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";

import Web3 from "web3";

import BigNumber from "bn";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";
import { amountToDecimalString, shorthandAmountFormatter } from "~/util";

export const ethGetTransactionsObservable = (
  token: string,
  address: string,
  network = 0
) =>
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
          returnValues: { from: string; to: string; value: BigNumber };
        }) => {
          const {
            from: source,
            to: destination,
            value: amount,
          } = event.returnValues;

          const uiTokenAmount = amountToDecimalString(amount.toString(), 6);

          const transaction = {
            source: source,
            destination: destination,
            amount: shorthandAmountFormatter(uiTokenAmount, 3),
            token,
          };
          subscriber.next(transaction);
        }
      )
      .on("error", (error: unknown) => {
        subscriber.error(error);
      });
  });
