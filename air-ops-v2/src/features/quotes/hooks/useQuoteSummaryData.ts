import { useState, useEffect, useCallback } from "react";
// 💡 Adjust the path to your useGql utility and GraphQL query
import useGql from "../../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../../lib/graphql/queries/dashboard";
import { useSession } from "../../../SessionContext";

/**
 * Fetches and manages the quote/sales summary data (metrics).
 *
 * @param filter - The filter object passed down from QuoteControllerPage.
 * @param refreshKey - Dependency used to force a refetch when the filter changes.
 */
export const useQuoteSummaryData = (filter: any, refreshKey: number) => {
  // 1. Get operatorId from session context
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  // 2. Local state for data and loading status
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummaryData = useCallback(async () => {
    setLoading(true);

    // 3. Extract active dates from the filter object passed from the controller page
    const dateFilter = filter?.createdAt?.between;
    const activeFromDate = dateFilter?.lower; // This is the ISO string from handelOnApply
    const activeToDate = dateFilter?.upper; // This is the ISO string from handelOnApply

    try {
      // 4. Perform the API call using useGql (the same logic as your original function)
      const data = await useGql({
        query: GET_SALES_DASHBOARD,
        queryName: "getSalesDashboardData",
        queryType: "query-without-edge",
        variables: {
          range: "custom", // Use 'custom' since we are providing explicit dates
          operatorId: operatorId,
          ...(activeFromDate &&
            activeToDate && {
              startDate: activeFromDate,
              endDate: activeToDate,
            }),
        },
      });

      // 5. Update state
      setSummaryData(data || null);
    } catch (error) {
      console.error("Error fetching quote summary data:", error);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  }, [
    // Dependencies to trigger the function update:
    // By watching the filter's date properties and the refreshKey,
    // the hook re-runs whenever the filter is applied in the QuoteControllerPage.
    filter?.createdAt?.between?.lower,
    filter?.createdAt?.between?.upper,
    operatorId,
    refreshKey,
  ]);

  // 6. Trigger the fetch whenever the dependencies change
  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return { summaryData, loading };
};
