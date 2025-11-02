import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { GET_MANUALS } from "@/lib/graphql/queries/manual";

interface ManualQueryArgs {
  filter: any;
  page: number;
  rowsPerPage: number;
}

export const useManualData = ({
  filter,
  page,
  rowsPerPage,
}: ManualQueryArgs) => {
  const [manualData, setManualData] = useState({ totalCount: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const getManualData = useCallback(async () => {
    setLoading(true);
    const finalFilter = {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const result = await useGql({
        query: GET_MANUALS,
        queryName: "manuals",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,

          paging: { "offset": page * rowsPerPage, "limit": rowsPerPage },
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      setManualData({ data: result.data, totalCount: result?.totalCount || 0 });
    } catch (error) {
      console.error("Error fetching trip details:", error);

      setManualData({ totalCount: 0, data: [] });
    } finally {
      setLoading(false);
    }
  }, [filter, page, rowsPerPage, operatorId]);

  useEffect(() => {
    getManualData();
  }, [getManualData]);

  const refreshList = getManualData;

  return { manualData, loading, refreshList };
};
