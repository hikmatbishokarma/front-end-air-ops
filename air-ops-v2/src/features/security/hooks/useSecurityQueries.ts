import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { GET_MANUALS } from "@/lib/graphql/queries/manual";
import { GET_SECURITIES } from "@/lib/graphql/queries/security";

interface SecurityQueryArgs {
  filter: any;
  page: number;
  rowsPerPage: number;
}

export const useSecurityData = ({
  filter,
  page,
  rowsPerPage,
}: SecurityQueryArgs) => {
  const [securityData, setSecurityData] = useState({ totalCount: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const getSecurityData = useCallback(async () => {
    setLoading(true);
    const finalFilter = {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const result = await useGql({
        query: GET_SECURITIES,
        queryName: "securities",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,
          paging: {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      setSecurityData({
        data: result.data,
        totalCount: result?.totalCount || 0,
      });
    } catch (error) {
      console.error("Error fetching trip details:", error);

      setSecurityData({ totalCount: 0, data: [] });
    } finally {
      setLoading(false);
    }
  }, [filter, page, rowsPerPage, operatorId]);

  useEffect(() => {
    getSecurityData();
  }, [getSecurityData]);

  const refreshList = getSecurityData;

  return { securityData, loading, refreshList };
};
