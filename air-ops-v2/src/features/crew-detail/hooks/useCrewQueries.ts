import { useCallback, useEffect, useState } from "react";
import { GET_CREW_DETAILS } from "@/lib/graphql/queries/crew-detail";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";

interface CrewQueryArgs {
  filter: any;
  searchTerm: string;
  rowsPerPage: number;
}

export const useCrewData = ({
  filter,
  searchTerm,
  rowsPerPage,
}: CrewQueryArgs) => {
  const [crewData, setCrewData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const operatorId = session?.user.operator?.id || null;

  // Core fetching function
  const getCrewDetails = useCallback(
    async (newOffset = 0, isLoadMore = false) => {
      try {
        const result = await useGql({
          query: GET_CREW_DETAILS,
          queryName: "crewDetails",
          queryType: "query-with-count",
          variables: {
            filter: {
              ...(operatorId && { operatorId: { eq: operatorId } }),
              ...(searchTerm
                ? {
                    or: [
                      { fullName: { iLike: `%${searchTerm}%` } },
                      { displayName: { iLike: `%${searchTerm}%` } },
                      { email: { iLike: `%${searchTerm}%` } },
                    ],
                  }
                : {}),
              ...(filter ? filter : {}),
            },
            paging: {
              offset: newOffset,
              limit: rowsPerPage,
            },
            sorting: [{ field: "createdAt", direction: "DESC" }],
          },
        });

        if (!result.data)
          showSnackbar("Failed to fetch Crew Details!", "error");

        setTotalCount(result.totalCount);

        if (isLoadMore) {
          setCrewData((prev) => [...prev, ...result.data]);
        } else {
          setCrewData(result.data);
        }
        const nextOffset = newOffset + result.data.length;
        setOffset(nextOffset);
        setHasMore(nextOffset < result.totalCount);
      } catch (error: any) {
        showSnackbar(error.message || "Failed to fetch Crew Details!", "error");
      }
    },
    [searchTerm, filter, rowsPerPage, operatorId, showSnackbar]
  );

  // Reset offset and fetch when filter/search changes
  useEffect(() => {
    setOffset(0); // Reset offset when filter/search changes
    getCrewDetails(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filter, rowsPerPage]);

  // Refresh function for external calls
  const refreshList = useCallback(async () => {
    await getCrewDetails(0, false);
  }, [getCrewDetails]);

  return {
    crewData,
    totalCount,
    offset,
    hasMore,
    getCrewDetails,
    refreshList,
  };
};
