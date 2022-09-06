/**
 * @generated SignedSource<<5762998d4b13f4b2abd38cc82246a584>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type prizePoolLivePrizePoolSubscription$variables = {};
export type prizePoolLivePrizePoolSubscription$data = {
  readonly prize_pool: ReadonlyArray<{
    readonly amount: any;
    readonly last_updated: any;
    readonly network: any;
  }>;
};
export type prizePoolLivePrizePoolSubscription = {
  response: prizePoolLivePrizePoolSubscription$data;
  variables: prizePoolLivePrizePoolSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "distinct_on",
        "value": "network"
      },
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "last_updated": "desc",
          "network": "asc"
        }
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
    "storageKey": "prize_pool(distinct_on:\"network\",order_by:{\"last_updated\":\"desc\",\"network\":\"asc\"})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "prizePoolLivePrizePoolSubscription",
    "selections": (v0/*: any*/),
    "type": "subscription_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "prizePoolLivePrizePoolSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "bb007fb78456d21ffd3d4b61849af83a",
    "id": null,
    "metadata": {},
    "name": "prizePoolLivePrizePoolSubscription",
    "operationKind": "subscription",
    "text": "subscription prizePoolLivePrizePoolSubscription {\n  prize_pool(order_by: {last_updated: desc, network: asc}, distinct_on: network) {\n    amount\n    last_updated\n    network\n  }\n}\n"
  }
};
})();

(node as any).hash = "3c7fc0184d695ed6207bfa9e1e08272b";

export default node;
