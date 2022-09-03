/**
 * @generated SignedSource<<07b00b2f539f397b159863a76709a164>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type winnersGetWinningTransactionsAllSubscription$variables = {
  date: any;
  network: any;
};
export type winnersGetWinningTransactionsAllSubscription$data = {
  readonly winners: ReadonlyArray<{
    readonly awarded_time: any;
    readonly token_decimals: number;
    readonly token_short_name: string;
    readonly transaction_hash: string;
    readonly winning_address: string;
    readonly winning_amount: any;
  }>;
};
export type winnersGetWinningTransactionsAllSubscription = {
  response: winnersGetWinningTransactionsAllSubscription$data;
  variables: winnersGetWinningTransactionsAllSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "date"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "network"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "awarded_time": "desc"
        }
      },
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_gte",
                "variableName": "date"
              }
            ],
            "kind": "ObjectValue",
            "name": "awarded_time"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "network"
              }
            ],
            "kind": "ObjectValue",
            "name": "network"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "winners",
    "kind": "LinkedField",
    "name": "winners",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "awarded_time",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "transaction_hash",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token_short_name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winning_amount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token_decimals",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winning_address",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "winnersGetWinningTransactionsAllSubscription",
    "selections": (v2/*: any*/),
    "type": "subscription_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "winnersGetWinningTransactionsAllSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a84256edb4b9869ce7c03b6e2500f506",
    "id": null,
    "metadata": {},
    "name": "winnersGetWinningTransactionsAllSubscription",
    "operationKind": "subscription",
    "text": "subscription winnersGetWinningTransactionsAllSubscription(\n  $network: network_blockchain!\n  $date: timestamp!\n) {\n  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, awarded_time: {_gte: $date}}) {\n    awarded_time\n    transaction_hash\n    token_short_name\n    winning_amount\n    token_decimals\n    winning_address\n  }\n}\n"
  }
};
})();

(node as any).hash = "3b318449bf6a4b16925b86737e725a68";

export default node;
