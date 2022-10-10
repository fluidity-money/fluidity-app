import { Observable } from "rxjs";

import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";

import Web3 from "web3";

import { AbiItem } from "web3-utils";
import BigNumber from "bn.js";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";

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
          returnValues: { src: string; dst: string; wad: BigNumber };
        }) => {
          const {
            src: source,
            dst: destination,
            wad: amount,
          } = event.returnValues;
          const transaction = {
            source,
            destination,
            amount: amount.toString(),
            token,
          };
          subscriber.next(transaction);
        }
      )
      .on("error", (error: unknown) => {
        subscriber.error(error);
      });
  });
