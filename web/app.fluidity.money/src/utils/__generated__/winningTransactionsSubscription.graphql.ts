/**
 * @generated SignedSource<<f02539e0bb9183d61dbe22852c05a0bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from "relay-runtime";
export type winningTransactionsSubscription$variables = {
  address: string;
  network: any;
};
export type winningTransactionsSubscription$data = {
  readonly winners: ReadonlyArray<{
    readonly awarded_time: any;
    readonly token_decimals: number;
    readonly token_short_name: string;
    readonly transaction_hash: string;
    readonly winning_amount: any;
  }>;
};
export type winningTransactionsSubscription = {
  response: winningTransactionsSubscription$data;
  variables: winningTransactionsSubscription$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "address",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "network",
    },
    v2 = [
      {
        alias: null,
        args: [
          {
            kind: "Literal",
            name: "order_by",
            value: {
              awarded_time: "desc",
            },
          },
          {
            fields: [
              {
                fields: [
                  {
                    kind: "Variable",
                    name: "_eq",
                    variableName: "network",
                  },
                ],
                kind: "ObjectValue",
                name: "network",
              },
              {
                fields: [
                  {
                    kind: "Variable",
                    name: "_eq",
                    variableName: "address",
                  },
                ],
                kind: "ObjectValue",
                name: "winning_address",
              },
            ],
            kind: "ObjectValue",
            name: "where",
          },
        ],
        concreteType: "winners",
        kind: "LinkedField",
        name: "winners",
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "awarded_time",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "transaction_hash",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "token_short_name",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "winning_amount",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "token_decimals",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "winningTransactionsSubscription",
      selections: v2 /*: any*/,
      type: "subscription_root",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "winningTransactionsSubscription",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "8519584a33e3a96a1ab33cd5d1942481",
      id: null,
      metadata: {},
      name: "winningTransactionsSubscription",
      operationKind: "subscription",
      text: "subscription winningTransactionsSubscription(\n  $network: network_blockchain!\n  $address: String!\n) {\n  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}}) {\n    awarded_time\n    transaction_hash\n    token_short_name\n    winning_amount\n    token_decimals\n  }\n}\n",
    },
  };
})();

(node as any).hash = "777833bb3555cc372bc699f22671894c";

export default node;
