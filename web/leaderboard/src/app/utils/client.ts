import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://fluidity.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
});
