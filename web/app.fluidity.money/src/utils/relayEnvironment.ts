// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type {
  FetchFunction,
  SubscribeFunction,
  Variables,
} from "relay-runtime";

import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
} from "relay-runtime";
import { createClient } from "graphql-ws";

const fetchGraphQL = async (text: string, variables: Variables) => {
  // Fetch data from GraphQL API:
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  // Get the response as JSON
  return await response.json();
};

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
const fetchRelay: FetchFunction = (params, variables) => {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(params.text ?? "", variables);
};

const wsClient = createClient({
  url: "ws://localhost:3000",
});

const subscribe: SubscribeFunction = (
  operation,
  variables
): Observable<never> => {
  return Observable.create((sink) => {
    return wsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text ?? "",
        variables,
      },
      sink
    );
  });
};

const network = Network.create(fetchRelay, subscribe);

// Export a singleton instance of Relay Environment configured with our network function:
export default new Environment({
  network,
  store: new Store(new RecordSource()),
});
