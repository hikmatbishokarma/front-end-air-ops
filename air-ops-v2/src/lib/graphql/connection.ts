import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const graphqlApiUrl = import.meta.env.VITE_GRAPHQL_API_URL;

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

// Create HTTP link for your GraphQL endpoint
const httpLink = new HttpLink({
  // uri: "http://localhost:3000/graphql/",
  uri: `${graphqlApiUrl}`,
});

console.log("graphqlApiUrl", graphqlApiUrl);

// Set context to add Authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // or sessionStorage or cookie
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloConnection = new ApolloClient({
  // add graphql endpoint from env
  // uri: "http://localhost:3000/graphql/",
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloConnection;
