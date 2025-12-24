import { useEffect, useState } from "react";
import useGql from "../../../lib/graphql/gql";
import { gql } from "@apollo/client";
import { GET_OPS_DASHBOARD_SUMMARY } from "@/lib/graphql/queries/trip-detail";


export function useOpsSummaryData(
    operatorId?: string | null,
    refreshKey?: number
) {
    const [summaryData, setSummaryData] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await useGql({
                    query: GET_OPS_DASHBOARD_SUMMARY,
                    queryName: "opsDashboardSummary",
                    queryType: "query-without-edge",
                    variables: { operatorId }, // operatorId is handled by context/backend usually, or we can pass it if needed. 
                    // But the resolver accepts optional operatorId. 
                    // UseGql might handle injecting headers or we might need to pass session operatorId.
                    // For now, let's assume it grabs from context or we pass it if we have it in the hook args.
                });
                setSummaryData({ summary: response });
            } catch (error) {
                console.error("Error fetching ops dashboard summary:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [refreshKey]);

    return { summaryData, loading };
}
