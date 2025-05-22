import { DocumentNode, Kind } from "graphql";
import apolloConnection from "./connection";

interface gqlParams {
  query: DocumentNode;
  variables: object;
  queryName: string;
  queryType?: "query" | "mutation" | "query-without-edge" | "query-with-count";
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

    console.log(
      "result111:::",
      queryType,
      result,
      queryName,
      result.data[queryName]
    );

    if (queryType == "query-without-edge") {
      return result.data[queryName];
    }

    console.log("result1111:::", queryType, result);

    if (queryType == "query") {
      return result.data[queryName].nodes;
    }
    if (queryType == "query-with-count") {
      return {
        totalCount: result.data[queryName].totalCount,
        data: result.data[queryName].nodes,
      };
    }
    console.log("result:::", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export default useGql;
