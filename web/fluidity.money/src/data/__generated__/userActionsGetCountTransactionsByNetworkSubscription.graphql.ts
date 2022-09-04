/**
 * @generated SignedSource<<3eab99ea4c1bcb45e3a822c364e6a81d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type userActionsGetCountTransactionsByNetworkSubscription$variables = {
  network: any;
};
export type userActionsGetCountTransactionsByNetworkSubscription$data = {
  readonly user_actions_aggregate: {
    readonly aggregate: {
      readonly count: number;
    } | null;
  };
};
export type userActionsGetCountTransactionsByNetworkSubscription = {
  response: userActionsGetCountTransactionsByNetworkSubscription$data;
  variables: userActionsGetCountTransactionsByNetworkSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "network"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
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
    "concreteType": "user_actions_aggregate",
    "kind": "LinkedField",
    "name": "user_actions_aggregate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "user_actions_aggregate_fields",
        "kind": "LinkedField",
        "name": "aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "userActionsGetCountTransactionsByNetworkSubscription",
    "selections": (v1/*: any*/),
    "type": "subscription_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "userActionsGetCountTransactionsByNetworkSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8f08594c979fc25e5b63a60ece52ef22",
    "id": null,
    "metadata": {},
    "name": "userActionsGetCountTransactionsByNetworkSubscription",
    "operationKind": "subscription",
    "text": "subscription userActionsGetCountTransactionsByNetworkSubscription(\n  $network: network_blockchain!\n) {\n  user_actions_aggregate(where: {network: {_eq: $network}}) {\n    aggregate {\n      count\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d79955657c1940dc17210c7d792da44c";

export default node;
