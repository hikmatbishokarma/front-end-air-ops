import { useState, useEffect } from "react";
import useGql from "../../../lib/graphql/gql"; // Your custom API utility
import { useSnackbar } from "../../../SnackbarContext";
import { useQuoteData } from "./useQuoteData";
import { GET_QUOTE_BY_ID } from "../../../lib/graphql/queries/quote";

export const useQuoteEditorData = (id: string) => {
  const showSnackbar = useSnackbar();

  // 1. Consume the existing data fetching hook
  const quoteDependencies = useQuoteData();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { fetchAircrafts, fetchClients, fetchRepresentatives } =
    quoteDependencies;

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the specific quote data
        const quoteResponse = await useGql({
          query: GET_QUOTE_BY_ID,
          queryName: "quote",
          queryType: "query-without-edge",
          variables: { id },
        });

        if (!quoteResponse) {
          showSnackbar("Failed to load quote data.", "error");
          throw new Error("Quote data is missing.");
        }

        // 2. Set the core quote data
        setInitialData(quoteResponse);

        // 3. Build and execute dependency fetching (business logic)
        const fetchPromises = [fetchAircrafts()];

        if (quoteResponse?.requestedBy) {
          fetchPromises.push(fetchClients());
        }

        if (quoteResponse?.representative) {
          // Note: The original code fetched representatives based on 'requestedBy.id'
          // but the description implies a representative is related to the client (requestedBy).
          // Assuming the original logic is correct here:
          fetchPromises.push(
            fetchRepresentatives(quoteResponse?.requestedBy?.id)
          );
        }

        await Promise.all(fetchPromises);
      } catch (err: any) {
        console.error("Data fetching error:", err);
        showSnackbar(
          err.message || "An error occurred while fetching data.",
          "error"
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, showSnackbar, fetchAircrafts, fetchClients, fetchRepresentatives]);
  // All state setters and functions must be in dependencies

  return {
    initialData,
    loading,
    error,
    // Merge all dependency fetching functions and data for the component
    ...quoteDependencies,
  };
};
