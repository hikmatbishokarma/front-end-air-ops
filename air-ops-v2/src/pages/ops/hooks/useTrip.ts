// /hooks/useTrip.ts
import { useEffect, useState } from "react";
import useGql from "../../../lib/graphql/gql";
import { GET_QUOTE_BY_ID } from "../../../lib/graphql/queries/quote";

export function useTrip(quotationId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        setLoading(true);

        const response = await useGql({
          query: GET_QUOTE_BY_ID,
          queryName: "quote",
          queryType: "query-without-edge",
          variables: { id: quotationId },
        });

        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (quotationId) fetchTrip();
  }, [quotationId]);

  return { data, loading, error };
}
