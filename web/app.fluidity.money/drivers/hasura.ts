import gql from "graphql-tag";
import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";
import { Observable } from "rxjs";
import BigNumber from "bn.js";
import { PipedTransaction } from "./types";
import { amountToDecimalString } from "~/util";

const hasuraUri = "https://fluidity.hasura.app/v1/graphql";
const WinnerSubscriptionQuery = gql`
  subscription MyQuery {
    winners(limit: 1) {
      created
      transaction_hash
      network
      token_short_name
      winning_address
      solana_winning_owner_address
      token_decimals
      winning_amount
    }
  }
`;

const getWsClient = (wsurl: string) =>
  new SubscriptionClient(wsurl, { reconnect: true }, ws);

export const createHasuraSubscriptionObservable = (
  wsurl: string,
  query: any,
  variables: any
) =>
  execute(new WebSocketLink(getWsClient(wsurl)), {
    query: query,
    variables: variables,
  });

export const getHasuraTransactionObservable = () =>
  new Observable<PipedTransaction>((subscriber) => {
    createHasuraSubscriptionObservable(
      hasuraUri,
      WinnerSubscriptionQuery,
      {}
    ).subscribe(
      (eventData: any) => {
        const transaction: PipedTransaction = {
          type: "rewardDB",
          source: "",
          destination: eventData?.winning_address,
          amount: amountToDecimalString(
            eventData?.winning_amount,
            eventData?.token_decimals
          ),
          token: eventData?.token_short_name,
          transactionHash: eventData?.transaction_hash,
        };
        subscriber.next(transaction);
      },
      (err) => {
        console.log("Error: " + err);
      }
    );
  });
