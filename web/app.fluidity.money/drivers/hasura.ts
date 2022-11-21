import gql from "graphql-tag";
import { DocumentNode, execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";
import { Observable } from "rxjs";
import { PipedTransaction } from "./types";
import { amountToDecimalString } from "~/util";

const WinnerSubscriptionQuery = gql`
  subscription getWinnersByAddress($address: String!) {
    winners(
      where: { winning_address: { _eq: $address } }
      limit: 1
      order_by: { created: desc }
    ) {
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

const createHasuraSubscriptionObservable = (
  wsurl: string,
  query: DocumentNode, // Explicitly when using apollo
  variables: Record<string, unknown>
) =>
  execute(new WebSocketLink(getWsClient(wsurl)), {
    query: query,
    variables: variables,
  });

type WinnerData = {
  winning_address: string;
  winning_amount: number;
  token_short_name: string;
  token_decimals: number;
  transaction_hash: string;
};

type WinnerEvent = {
  data: {
    winners: WinnerData[];
  };
};

export const getHasuraTransactionObservable = (url: string, address: string) =>
  new Observable<PipedTransaction>((subscriber) => {
    createHasuraSubscriptionObservable(url, WinnerSubscriptionQuery, {
      address: address,
    }).subscribe(
      (eventData: unknown) => {
        // Secretly a WinnerEvent
        const _eventData = eventData as WinnerEvent;
        if (_eventData.data.winners.length === 0) return;
        // Will never fail because of the length check above
        const itemObject = _eventData.data.winners.at(0) as WinnerData | never;
        const transaction: PipedTransaction = {
          type: "rewardDB",
          source: "",
          destination: itemObject.winning_address,
          amount: amountToDecimalString(
            itemObject.winning_amount.toString(),
            itemObject.token_decimals
          ),
          token: itemObject.token_short_name,
          transactionHash: itemObject.transaction_hash,
        };
        subscriber.next(transaction);
      },
      (err) => {
        console.log("Error: " + err);
      }
    );
  });
