import { ApolloClient, DefaultOptions, InMemoryCache } from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const apolloConnection = new ApolloClient({
  // add graphql endpoint from env
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloConnection;
