import type { OnDataOptions } from "@apollo/client";

import ws from "ws";

import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "https://fluidity.hasura.app/v1/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://fluidity.hasura.app/v1/graphql",
    webSocketImpl:
      typeof window !== "undefined" ? WebSocket : (await import("ws")).default,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  ssrMode: false,
});

const onData = <T>(
  next: (data: T) => void,
  onError: (e: Error) => void = () => {}
) => {
  return ({ data }: OnDataOptions) => {
    data.error || data.data === null ? onError(data.error) : next(data.data);
  };
};

export { onData };
