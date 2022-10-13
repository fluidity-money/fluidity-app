import { Observable } from "rxjs";

import { PublicKey, Connection } from "@solana/web3.js";

import BigNumber from "bn.js";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";

import { amountToDecimalString, shorthandAmountFormatter } from "../app/util";

let LastSignature = ``;
export const solGetTransactionsObservable = (
  token: string,
  address: string,
  network = 0
) =>
  new Observable<PipedTransaction>((subscriber) => {
    const SolanaConnection = new Connection(
      config.drivers["solana"][network].rpc.http,
      { wsEndpoint: config.drivers["solana"][network].rpc.ws }
    );
    SolanaConnection.onLogs(
      new PublicKey(address),
      (transactionLog) => {
        SolanaConnection.getParsedTransaction(transactionLog.signature)
          .then((event) => {
            // Because solana logs token transaction twice :(
            if (LastSignature === transactionLog.signature) return;

            const SrcPostBalance = String(
              event?.meta?.postTokenBalances?.at(0)?.uiTokenAmount?.amount
            );
            const SrcPreBalance = String(
              event?.meta?.preTokenBalances?.at(0)?.uiTokenAmount?.amount
            );

            const PostTokenBalance_Source = new BigNumber(SrcPostBalance);
            const PreTokenBalance_Source = new BigNumber(SrcPreBalance);
            const TokenDecimal = Number(
              event?.meta?.preTokenBalances?.at(0)?.uiTokenAmount?.decimals
            );

            const source = String(event?.meta?.postTokenBalances?.at(0)?.owner);
            const destination = String(
              event?.meta?.postTokenBalances?.at(1)?.owner
            );
            const amount = PreTokenBalance_Source.sub(PostTokenBalance_Source);

            //Spam transaction: not possible for an account signer to transfer more amount of token than it owns.
            if (amount.isNeg()) return;
            if (source == `undefined` || destination == `undefined`) return;

            const uiTokenAmount = amountToDecimalString(
              amount.toString(10),
              TokenDecimal
            );
            const transaction: PipedTransaction = {
              source,
              destination,
              amount: shorthandAmountFormatter(uiTokenAmount, 3),
              token,
            };
            LastSignature = transactionLog.signature;
            subscriber.next(transaction);
          })
          .catch((error) => subscriber.error(error));
      },
      "finalized"
    );
  });
