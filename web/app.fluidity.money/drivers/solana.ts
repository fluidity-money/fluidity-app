import { Observable } from "rxjs";

import { PublicKey, Connection } from "@solana/web3.js";

import BigNumber from "bn.js";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";

let LastSignature = ``;
export const solGetTransactionsObservable = (
  token: string,
  address: string,
  network = 0
) =>
  new Observable<PipedTransaction>((subscriber) => {
    const SolanaConnection = new Connection(
      config.drivers["solana"][network].rpc.http,
      "confirmed"
    );

    SolanaConnection.onLogs(
      new PublicKey(address),
      (transactionLog) => {
        //Because solana logs transaction twice :(
        if (LastSignature === transactionLog.signature) return;

        SolanaConnection.getParsedTransaction(transactionLog.signature)
          .then((event) => {  
            const SrcPostBalance: any =
              event?.meta?.postTokenBalances?.at(0)?.uiTokenAmount?.amount;
            const SrcPreBalance: any =
              event?.meta?.preTokenBalances?.at(0)?.uiTokenAmount?.amount;

            const PostTokenBalance_Source = new BigNumber(SrcPostBalance, 10);
            const PreTokenBalance_Source = new BigNumber(SrcPreBalance, 10);

            const source: any = event?.meta?.postTokenBalances?.at(0)?.owner;
            const destination: any =
              event?.meta?.postTokenBalances?.at(1)?.owner;
            const amount = new BigNumber(
              PreTokenBalance_Source.sub(PostTokenBalance_Source)
            ).toString(10);
            const transaction: any = {
              source,
              destination,
              amount: amount.toString(),
              token,
            };
            // console.log("Updated account info: ", transactionLog.signature)
            LastSignature = transactionLog.signature;

            subscriber.next(transaction);
          })
          .catch((error) => subscriber.error(error));
      },
      "finalized"
    );
  });
