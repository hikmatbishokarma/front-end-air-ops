import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/providers";
import useGql from "../../../lib/graphql/gql";
import { GET_TRIP_DETAILS } from "../../../lib/graphql/queries/trip-detail";

interface TripDetailQueryArgs {
  filter: any;
  page: number;
  rowsPerPage: number;
}

export const useTripDetailData = ({
  filter,
  page,
  rowsPerPage,
}: TripDetailQueryArgs) => {
  // ... state for tripDetailList and totalCount (similar to useSalesConfirmationData)
  const [tripDetailList, setTripDetailList] = useState<any[]>([]); // Define a type for TripDetail
  const [tripDetailTotalCount, setTripDetailTotalCount] = useState(0);
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const getTripDetails = useCallback(async () => {
    const finalFilter = {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const result = await useGql({
        query: GET_TRIP_DETAILS,
        queryName: "tripDetails",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,
          "paging": { "offset": page * rowsPerPage, "limit": rowsPerPage },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      setTripDetailTotalCount(result?.totalCount || 0);
      setTripDetailList(result.data);
    } catch (error) {
      console.error("Error fetching trip details:", error);
      setTripDetailTotalCount(0);
      setTripDetailList([]);
    }
  }, [filter, page, rowsPerPage, operatorId]);

  useEffect(() => {
    getTripDetails();
  }, [getTripDetails]);

  return { tripDetailList, tripDetailTotalCount };
};
