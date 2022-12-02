import gql from "graphql-tag";
import { DocumentNode, execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";
import { Observable } from "rxjs";
import { PipedTransaction, NotificationType } from "./types";
import { amountToDecimalString, shorthandAmountFormatter } from "~/util";
import { captureException } from "@sentry/remix";

const WinnerSubscriptionQuery = gql`
  subscription getWinnersByAddress($address: String!) {
    winners(
      where: { winning_address: { _eq: $address } }
      limit: 1
      order_by: { created: desc }
    ) {
      transaction_hash
      token_short_name
      winning_address
      token_decimals
      winning_amount
      reward_type
    }
  }
`;

const PendingWinnerSubscriptionQuery = gql`
  subscription getPendingWinnersByAddress($address: String!) {
    ethereum_pending_winners(
      where: { address: { _eq: $address } }
      limit: 1
      order_by: { inserted_date: desc }
    ) {
      transaction_hash
      token_short_name
      address
      token_decimals
      win_amount
      reward_type
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
  transaction_hash: string;
  token_short_name: string;
  winning_address: string;
  token_decimals: number;
  winning_amount: number;
  reward_type: string;
};

type PendingWinnerData = {
  transaction_hash: string;
  token_short_name: string;
  address: string;
  token_decimals: number;
  win_amount: number;
  reward_type: string;
};

type WinnerEvent = {
  data: {
    winners: WinnerData[];
  };
};

type PendingWinnerEvent = {
  data: {
    ethereum_pending_winners: PendingWinnerData[];
  };
};

export const winnersTransactionObservable = (url: string, address: string) =>
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
          type: NotificationType.WINNING_REWARD_DATABASE,
          source: "",
          destination: itemObject.winning_address,
          amount: shorthandAmountFormatter(
            amountToDecimalString(
              itemObject.winning_amount.toString(),
              itemObject.token_decimals
            ),
            3
          ),
          token: `f${itemObject.token_short_name}`,
          transactionHash: itemObject.transaction_hash,
          rewardType: itemObject.reward_type,
        };
        subscriber.next(transaction);
      },
      (err) => {
        captureException(
          new Error(
            `Error on hasura driver listener while listening on 'winners' :: ${err}`
          ),
          {
            tags: {
              section: "drivers/hasura/winners",
            },
          }
        );
      }
    );
  });

export const pendingWinnersTransactionObservables = (
  url: string,
  address: string
) =>
  new Observable<PipedTransaction>((subscriber) => {
    createHasuraSubscriptionObservable(url, PendingWinnerSubscriptionQuery, {
      address: address,
    }).subscribe(
      (eventData: unknown) => {
        const _eventData = eventData as PendingWinnerEvent;

        if (_eventData.data.ethereum_pending_winners.length === 0) return;

        const itemObject = _eventData.data.ethereum_pending_winners.at(0) as
          | PendingWinnerData
          | never;

        const transaction: PipedTransaction = {
          type: NotificationType.PENDING_REWARD_DATABASE,
          source: "",
          destination: itemObject.address,
          amount: shorthandAmountFormatter(
            amountToDecimalString(
              itemObject.win_amount.toString(),
              itemObject.token_decimals
            ),
            3
          ),
          token: `f${itemObject.token_short_name}`,
          transactionHash: itemObject.transaction_hash,
          rewardType: itemObject.reward_type,
        };
        subscriber.next(transaction);
      },
      (err) => {
        captureException(
          new Error(
            `Error on hasura driver listener while listening on 'ethereum_pending_winners' :: ${err}`
          ),
          {
            tags: {
              section: "drivers/hasura/ethereum_pending_winners",
            },
          }
        );
      }
    );
  });
