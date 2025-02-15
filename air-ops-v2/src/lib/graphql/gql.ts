import { DocumentNode, Kind } from "graphql";
import apolloConnection from "./connection";

interface gqlParams {
  query: DocumentNode;
  variables: object;
  queryName: string;
  queryType?: "query" | "mutation" | "query-without-edge";
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
    console.log("🟡 Before API Call - useGql queryName:", queryName, variables);

    if (!variables || Object.keys(variables).length === 0) {
      console.error("❌ Variables are empty before API call!");
    }

    const result = await apolloConnection.query({
      query,
      variables,
    });

    if (queryType == "query-without-edge") {
      return result.data[queryName];
    }

    if (queryType == "query") {
      return result.data[queryName].nodes;
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

export default useGql;
