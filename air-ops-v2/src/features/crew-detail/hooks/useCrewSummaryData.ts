import { useState, useEffect, useCallback } from "react";
import useGql from "@/lib/graphql/gql";
import {
  GET_CREW_DETAILS,
  GET_STAFF_CERTIFICATION,
} from "@/lib/graphql/queries/crew-detail";
import { GET_LEAVES } from "@/lib/graphql/queries/leave";
import { useSession } from "@/app/providers";

/**
 * Fetches and manages the crew summary data (metrics: staff, leaves, renewals).
 *
 * @param filter - The filter object passed down from CrewControllerPage.
 * @param refreshKey - Dependency used to force a refetch when the filter changes.
 */
export const useCrewSummaryData = (filter: any, refreshKey: number) => {
  // 1. Get operatorId from session context
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  // 2. Local state for data and loading status
  const [summaryData, setSummaryData] = useState<any>({
    summary: {
      staff: 0,
      leaves: 0,
      renewals: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchSummaryData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch staff count
      const staffResult = await useGql({
        query: GET_CREW_DETAILS,
        queryName: "crewDetails",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      // Fetch renewals count (certifications)
      const renewalsResult = await useGql({
        query: GET_STAFF_CERTIFICATION,
        queryName: "staffCertificates",
        queryType: "query-without-edge",
        variables: {
          args: {
            where: {
              ...(operatorId && { operatorId }),
            },
          },
        },
      });

      // Fetch leaves count
      const leavesResult = await useGql({
        query: GET_LEAVES,
        queryName: "leaves",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      // 5. Update state
      setSummaryData({
        summary: {
          staff: staffResult?.totalCount || 0,
          leaves: leavesResult?.totalCount || 0,
          renewals: renewalsResult?.totalCount || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching crew summary data:", error);
      setSummaryData({
        summary: {
          staff: 0,
          leaves: 0,
          renewals: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [
    // Dependencies to trigger the function update:
    operatorId,
    refreshKey,
  ]);

  // 6. Trigger the fetch whenever the dependencies change
  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return { summaryData, loading };
};
