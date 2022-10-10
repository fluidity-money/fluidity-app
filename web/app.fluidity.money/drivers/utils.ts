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
  protocol: `ethereum` | `solana`,
  options: Partial<Options>,
  ...tokens: {
    token: string;
    address: string;
  }[]
) => {
  const { network } = { ...OptionsDefault, ...options };
  return merge(
    ...tokens.map(({ token, address }) =>
      protocol === `ethereum`
        ? ethGetTransactionsObservable(token, address, network)
        : solGetTransactionsObservable(token, address, network)
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