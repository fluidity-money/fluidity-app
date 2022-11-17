import { Observable } from "rxjs";

import { PublicKey, Connection } from "@solana/web3.js";

import BigNumber from "bn.js";
import { PipedTransaction } from "./types";

import config from "~/webapp.config.server";

import { amountToDecimalString, shorthandAmountFormatter } from "~/util";

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
            /*
             *  meta-data postbalances and prebalances retrives
             * {
             *   owner_of_token_account_source_address,
             *   owner_of_token_account_source_address,
             *   raw_token_amount_before_the transaction in the case of prebalance and viceversa for postbalance metadata,
             *   token_decimals,
             *   ui_token_amount,
             * }
             */

            const meta = event?.meta;
            const preMeta = meta?.preTokenBalances;
            const postMeta = meta?.postTokenBalances;

            const srcPostBalance = String(
              postMeta?.at(0)?.uiTokenAmount?.amount
            );
            const srcPreBalance = String(preMeta?.at(0)?.uiTokenAmount?.amount);

            const postTokenBalanceSource = new BigNumber(srcPostBalance);
            const preTokenBalanceSource = new BigNumber(srcPreBalance);
            const tokenDecimal = Number(
              preMeta?.at(0)?.uiTokenAmount?.decimals
            );

            const source = String(postMeta?.at(0)?.owner);
            const destination = String(postMeta?.at(1)?.owner);

            const amount = preTokenBalanceSource.sub(postTokenBalanceSource);

            //Spam transaction: not possible for an account signer to transfer more amount of token than it owns.

            const uiTokenAmount = amountToDecimalString(
              amount.toString(10),
              tokenDecimal
            );
            const transaction: PipedTransaction = {
              source: source,
              destination: destination,
              amount: shorthandAmountFormatter(uiTokenAmount, 3),
              token,
              type: "rewardDB",
              transactionHash: "",
            };
            LastSignature = transactionLog.signature;
            subscriber.next(transaction);
          })
          .catch((error) => subscriber.error(error));
      },
      `finalized`
    );
  });
