import { Observable, merge, filter } from "rxjs";
import { ethGetTransactionsObservable } from "./ethereum";
import { solGetTransactionsObservable } from "./solana";

import { PipedTransaction } from "./types";

type Options = {
  network: number;
};

const OptionsDefault: Options = {
  network: 0,
};

const getTransactionsObservableForIn = (
  protocol: "ethereum" | "solana",
  options: Partial<Options>,
  ...tokens: {
    token: string;
    address: string;
    decimals: number;
  }[]
) => {
  const { network } = { ...OptionsDefault, ...options };
  return merge(
    ...tokens.map(
      ({ token, address, decimals }) =>
        protocol === `ethereum`
          ? ethGetTransactionsObservable(token, address, decimals, network)
          : solGetTransactionsObservable(token, address, network) // solana doesn't really need decimals from app config. it can be deduced from onchain meta-data
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

export { getTransactionsObservableForIn, getObservableForAddress };
