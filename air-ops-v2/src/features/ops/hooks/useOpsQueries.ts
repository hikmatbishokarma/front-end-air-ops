import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/providers";
import useGql from "../../../lib/graphql/gql";
import {
  GET_TRIP_DETAILS,
  GET_CREW_DOC_UPLODED_FOR_TRIP,
  TRIP_CONFIRMATION_PREVIEW,
} from "../../../lib/graphql/queries/trip-detail";

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

export const useCrewTripData = ({
  filter,
  page,
  rowsPerPage,
}: TripDetailQueryArgs) => {
  const [crewTripList, setCrewTripList] = useState<any[]>([]);
  const [crewTripTotalCount, setCrewTripTotalCount] = useState(0);
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const getCrewTrips = useCallback(async () => {
    const finalFilter = {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const result = await useGql({
        query: GET_CREW_DOC_UPLODED_FOR_TRIP,
        queryName: "tripDetailsWithCrewDocuments",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,
          paging: { offset: page * rowsPerPage, limit: rowsPerPage },
          sorting: [{ field: "createdAt", direction: "DESC" }],
        },
      });

      setCrewTripTotalCount(result?.totalCount || 0);

      // Transform API response to match expected structure
      const transformedTrips = (result.data || []).map((trip: any) => {
        return {
          tripId: trip.tripId,
          quotationNo: trip.quotationNo,
          quotation: trip.quotation,
          createdAt: trip.createdAt,
          sectors: (trip.sectors || []).map((sector: any) => {
            // Transform tripDocByCrew to crewDocuments format
            const crewDocuments = (sector.tripDocByCrew || []).map(
              (doc: any) => ({
                _id: doc.url || `${sector.sectorNo}-${doc.name}`,
                name: doc.name,
                url: doc.url,
                type: doc.type,
                uploadedAt: new Date().toISOString(), // API doesn't provide uploadedAt
                uploadedBy: {
                  name: doc.crewDetails?.fullName || "Unknown",
                  role: doc.crewDetails?.designation || "UNKNOWN",
                  profileImage: doc.crewDetails?.profile || null,
                },
              })
            );

            return {
              _id: `${trip.tripId}-${sector.sectorNo}`,
              sectorNo: sector.sectorNo,
              source: {
                code: sector.source?.code || "",
                name: sector.source?.name || "",
                city: sector.source?.city || sector.source?.name || "",
              },
              destination: {
                code: sector.destination?.code || "",
                name: sector.destination?.name || "",
                city:
                  sector.destination?.city || sector.destination?.name || "",
              },
              depatureTime: sector.depatureTime || "",
              arrivalTime: sector.arrivalTime || "",
              crewDocuments,
            };
          }),
        };
      });

      setCrewTripList(transformedTrips);
    } catch (error) {
      console.error("Error fetching crew trips:", error);
      setCrewTripTotalCount(0);
      setCrewTripList([]);
    }
  }, [filter, page, rowsPerPage, operatorId]);

  useEffect(() => {
    getCrewTrips();
  }, [getCrewTrips]);

  return { crewTripList, crewTripTotalCount };
};

export const useTripConfirmationPreview = () => {
  const [loading, setLoading] = useState(false);

  const getPreview = useCallback(async (tripId: string) => {
    setLoading(true);
    try {
      const result = await useGql({
        query: TRIP_CONFIRMATION_PREVIEW,
        queryName: "tripConfirmationPreview",
        queryType: "query-without-edge",
        variables: { tripId },
      });
      setLoading(false);


      // result.data contains the string response because the API returns a scalar String
      return result;
    } catch (error) {
      console.error("Error fetching trip confirmation preview:", error);
      setLoading(false);
      return null;
    }
  }, []);

  return { getPreview, loading };
};
