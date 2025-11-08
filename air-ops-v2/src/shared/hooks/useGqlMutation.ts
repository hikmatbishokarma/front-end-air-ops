import { useState, useCallback } from "react";
// 💡 Update path to your core GQL client
import useGql from "../../lib/graphql/gql";

interface MutationResult {
  success: boolean;
  data?: any;
  error?: Error;
}

/**
 * A reusable hook to manage state for any asynchronous useGql mutation.
 * @returns {object} { loading, mutate, error }
 */
export const useGqlMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (gqlParams: any): Promise<MutationResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await useGql(gqlParams);

        // Check for errors returned within the GraphQL response object
        if (result?.errors?.length) {
          throw new Error(
            result.errors[0]?.message || "GraphQL mutation error."
          );
        }

        setLoading(false);
        // Return the raw result data for the feature hook to process
        return { success: true, data: result };
      } catch (err: any) {
        setLoading(false);
        // Ensure the error object is a standard Error
        const finalError =
          err instanceof Error
            ? err
            : new Error(err.message || "An unknown mutation error occurred.");
        setError(finalError);
        return { success: false, error: finalError };
      }
    },
    []
  );

  return { loading, error, mutate };
};
