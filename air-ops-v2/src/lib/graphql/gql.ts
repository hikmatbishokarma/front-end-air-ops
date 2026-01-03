import { DocumentNode, Kind } from "graphql";
import apolloConnection from "./connection";

interface gqlParams {
  query: DocumentNode;
  variables: object;
  queryName: string;
  queryType?:
  | "query"
  | "mutation"
  | "query-without-edge"
  | "query-with-count"
  | "";
}

const gqlDefaults: gqlParams = {
  query: { kind: Kind.DOCUMENT, definitions: [] },
  variables: {},
  queryName: "",
  queryType: "query",
};

const useGql = async (gqlParams: gqlParams) => {
  let { query, variables, queryName, queryType } = {
    ...gqlDefaults,
    ...gqlParams,
  };
  try {
    if (!variables || Object.keys(variables).length === 0) {
      console.error("❌ Variables are empty before API call!");
    }

    let result;
    if (queryType === "mutation") {
      result = await apolloConnection.mutate({
        mutation: query,
        variables,
      });
    } else {
      result = await apolloConnection.query({
        query,
        variables,
      });
    }

    // Check for a 'data.errors' object in the response
    if (result?.errors) {
      console.error("❌ GraphQL Errors:", result?.errors);
      return result;
    }

    if (queryType == "query-without-edge") {
      return result.data[queryName];
    }

    if (queryType == "query") {
      return result.data[queryName].nodes;
    }
    if (queryType == "query-with-count") {
      return {
        totalCount: result.data[queryName].totalCount,
        data: result.data[queryName].nodes,
      };
    }

    if (queryType == "mutation") {
      return result.data[queryName];
    }

    return result;
  } catch (error) {
    console.error("❌ An error occurred during the GraphQL operation:", error);
    // Rethrow the error so it can be caught by the calling component
    throw error;
  }
};

export default useGql;
