import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});