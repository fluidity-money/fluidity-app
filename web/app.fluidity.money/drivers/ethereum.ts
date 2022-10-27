import { Observable, merge, filter } from "rxjs";

import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";

import Web3 from "web3";

import BigNumber from "bn";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";

const getTransactionsObservable = (
  token: string,
  address: string,
  network = 0
) =>
  new Observable<PipedTransaction>((subscriber) => {
    new new Web3(config.drivers["ethereum"][network].rpc.ws ?? "").eth.Contract(
      IERC20.abi,
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

type Options = {
  network: number;
};

const OptionsDefault: Options = {
  network: 0,
};

const getTransactionsObservableForIn = (
  options: Partial<Options>,
  ...tokens: {
    token: string;
    address: string;
  }[]
) => {
  const { network } = { ...OptionsDefault, ...options };
  return merge(
    ...tokens.map(({ token, address }) =>
      getTransactionsObservable(token, address, network)
    )
  );
};

const getObservableForAddress = (
  observable: Observable<PipedTransaction>,
  address: string
) =>
  observable.pipe(
    filter(
      ({ source, destination }) => source === address || destination === address
    )
  );

export {
  getTransactionsObservableForIn,
  getTransactionsObservable,
  getObservableForAddress,
};
