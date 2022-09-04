/**
 * @generated SignedSource<<116fb358aa3ef6db5516d7a543147937>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type winnersGetWinningTransactionsByAddressSubscription$variables = {
  address: string;
  date: any;
  network: any;
};
export type winnersGetWinningTransactionsByAddressSubscription$data = {
  readonly winners: ReadonlyArray<{
    readonly awarded_time: any;
    readonly token_decimals: number;
    readonly token_short_name: string;
    readonly transaction_hash: string;
    readonly winning_address: string;
    readonly winning_amount: any;
  }>;
};
export type winnersGetWinningTransactionsByAddressSubscription = {
  response: winnersGetWinningTransactionsByAddressSubscription$data;
  variables: winnersGetWinningTransactionsByAddressSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "address"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "date"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "network"
},
v3 = [
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
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "address"
              }
            ],
            "kind": "ObjectValue",
            "name": "winning_address"
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "winnersGetWinningTransactionsByAddressSubscription",
    "selections": (v3/*: any*/),
    "type": "subscription_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "winnersGetWinningTransactionsByAddressSubscription",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "18c53663be58bfd81fb3e4490ff7b12f",
    "id": null,
    "metadata": {},
    "name": "winnersGetWinningTransactionsByAddressSubscription",
    "operationKind": "subscription",
    "text": "subscription winnersGetWinningTransactionsByAddressSubscription(\n  $network: network_blockchain!\n  $address: String!\n  $date: timestamp!\n) {\n  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}, awarded_time: {_gte: $date}}) {\n    awarded_time\n    transaction_hash\n    token_short_name\n    winning_amount\n    token_decimals\n    winning_address\n  }\n}\n"
  }
};
})();

(node as any).hash = "9a0589f915b8d3d1563f934d5843938e";

export default node;
