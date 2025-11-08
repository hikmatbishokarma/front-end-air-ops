import { useCallback, useEffect, useState } from "react";
import { GET_LIBRARIES } from "@/lib/graphql/queries/library";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";

interface LibraryQueryArgs {
  filter: any;
  searchTerm: string;
  rowsPerPage: number;
}

export const useLibraryData = ({
  filter,
  searchTerm,
  rowsPerPage,
}: LibraryQueryArgs) => {
  const [libraries, setLibraries] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const operatorId = session?.user.operator?.id || null;

  // Core fetching function - same logic as old getLibrary
  const getLibrary = useCallback(
    async (newOffset = 0, isLoadMore = false) => {
      try {
        const result = await useGql({
          query: GET_LIBRARIES,
          queryName: "libraries",
          queryType: "query-with-count",
          variables: {
            filter: {
              ...(operatorId && { operatorId: { eq: operatorId } }),
              ...(searchTerm
                ? {
                    or: [
                      { name: { iLike: `%${searchTerm}%` } },
                      { department: { iLike: `%${searchTerm}%` } },
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

        if (!result.data) showSnackbar("Failed to fetch Library!", "error");

        setTotalCount(result.totalCount);

        if (isLoadMore) {
          setLibraries((prev) => [...prev, ...result.data]);
        } else {
          setLibraries(result.data);
        }
        const nextOffset = newOffset + result.data.length;
        setOffset(nextOffset);
        setHasMore(nextOffset < result.totalCount);
      } catch (error: any) {
        showSnackbar(error.message || "Failed to fetch Library!", "error");
      }
    },
    [searchTerm, filter, rowsPerPage, operatorId, showSnackbar]
  );

  // Reset offset and fetch when filter/search changes
  useEffect(() => {
    setOffset(0); // Reset offset when filter/search changes
    getLibrary(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filter, rowsPerPage]);

  // Refresh function for external calls
  const refreshList = useCallback(async () => {
    await getLibrary(0, false);
  }, [getLibrary]);

  return {
    libraries,
    totalCount,
    offset,
    hasMore,
    getLibrary,
    refreshList,
  };
};
