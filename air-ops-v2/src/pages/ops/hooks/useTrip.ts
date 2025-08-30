// /hooks/useTrip.ts
import { useEffect, useState } from "react";
import useGql from "../../../lib/graphql/gql";
import { GET_QUOTE_BY_ID } from "../../../lib/graphql/queries/quote";
import { GET_TRIP_DETAILS } from "../../../lib/graphql/queries/trip-detail";

export function useTrip(tripId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        setLoading(true);

        const response = await useGql({
          query: GET_TRIP_DETAILS,
          queryName: "tripDetails",
          queryType: "query-with-count",
          variables: { id: tripId },
        });

        console.log("response:::", response);
        setData(response.data[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (tripId) fetchTrip();
  }, [tripId]);

  return { data, loading, error };
}
