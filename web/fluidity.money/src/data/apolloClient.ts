import type { OnDataOptions } from "@apollo/client";

import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "https://fluidity.hasura.app/v1/graphql",
});

// Only run on Client
const wsLink = typeof window !== "undefined"
  ? new GraphQLWsLink(createClient({
    url: 'wss://fluidity.hasura.app/v1/graphql',
  }))
  : null;

const splitLink = typeof window !== "undefined" && wsLink != null
  ? split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  )
  : httpLink;

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const onData = <T>(
  next: (data: T) => void,
  onError: (e: Error) => void = () => {}
) => {
  return ( { data }: OnDataOptions) => {
    data.error || data.data === null
      ? onError(data.error)
      : next(data.data)
  }
}

export default client;

export { onData };
