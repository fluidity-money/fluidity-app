/**
 * @generated SignedSource<<6856923d467af584eedc9877919709f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LivePrivePoolSubscription$variables = {
  time: any;
};
export type LivePrivePoolSubscription$data = {
  readonly prize_pool: ReadonlyArray<{
    readonly amount: any;
    readonly last_updated: any;
    readonly network: any;
  }>;
};
export type LivePrivePoolSubscription = {
  response: LivePrivePoolSubscription$data;
  variables: LivePrivePoolSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "time"
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
                "name": "_gte",
                "variableName": "time"
              }
            ],
            "kind": "ObjectValue",
            "name": "last_updated"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "prize_pool",
    "kind": "LinkedField",
    "name": "prize_pool",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "amount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "last_updated",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "network",
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
    "name": "LivePrivePoolSubscription",
    "selections": (v1/*: any*/),
    "type": "subscription_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LivePrivePoolSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7eb6cd00597b92a0ebe97ddb77be10f6",
    "id": null,
    "metadata": {},
    "name": "LivePrivePoolSubscription",
    "operationKind": "subscription",
    "text": "subscription LivePrivePoolSubscription(\n  $time: timestamp!\n) {\n  prize_pool(where: {last_updated: {_gte: $time}}) {\n    amount\n    last_updated\n    network\n  }\n}\n"
  }
};
})();

(node as any).hash = "7e05426cbaed5c7c7d7b48c8c0315bf3";

export default node;
