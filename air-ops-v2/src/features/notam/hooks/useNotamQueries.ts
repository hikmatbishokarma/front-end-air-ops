import { useCallback, useEffect, useState, useMemo } from "react";
import { useSession } from "@/app/providers";
import useGql from "../../../lib/graphql/gql";
import { GET_NOTAMS, GET_NOTAMS_BY_ID } from "../../../lib/graphql/queries/notam";

interface NotamQueryArgs {
    filter?: any;
    page?: number;
    rowsPerPage?: number;
}

export const useNotamData = ({
    filter = {},
    page = 0,
    rowsPerPage = 10,
}: NotamQueryArgs = {}) => {
    const [notamList, setNotamList] = useState<any[]>([]);
    const [notamTotalCount, setNotamTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { session } = useSession();
    const operatorId = session?.user.operator?.id || null;

    // Stringify filter to avoid object reference issues
    const filterString = JSON.stringify(filter);

    const getNotams = useCallback(async () => {
        const parsedFilter = JSON.parse(filterString);
        const finalFilter = {
            ...parsedFilter,
            ...(operatorId && { operator: { id: { eq: operatorId } } }),
        };

        setLoading(true);
        try {
            const result = await useGql({
                query: GET_NOTAMS,
                queryName: "notams",
                queryType: "query-with-count",
                variables: {
                    filter: finalFilter,
                    paging: { offset: page * rowsPerPage, limit: rowsPerPage },
                    sorting: [{ field: "updatedAt", direction: "DESC" }],
                },
            });

            setNotamTotalCount(result?.totalCount || 0);
            setNotamList(result.data || []);
        } catch (error) {
            console.error("Error fetching NOTAMs:", error);
            setNotamTotalCount(0);
            setNotamList([]);
        } finally {
            setLoading(false);
        }
    }, [filterString, page, rowsPerPage, operatorId]);

    useEffect(() => {
        getNotams();
    }, [getNotams]);

    return { notamList, notamTotalCount, loading, refetch: getNotams };
};

export const useNotamById = (id: string) => {
    const [notam, setNotam] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getNotamById = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const result = await useGql({
                query: GET_NOTAMS_BY_ID,
                queryName: "notam",
                queryType: "query",
                variables: { id },
            });

            setNotam(result.data);
        } catch (err) {
            console.error("Error fetching NOTAM by ID:", err);
            setError(err);
            setNotam(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getNotamById();
    }, [getNotamById]);

    return { notam, loading, error, refetch: getNotamById };
};

// Hook to get NOTAMs by category
export const useNotamsByCategory = (category: string) => {
    const filter = useMemo(
        () => (category ? { category: { eq: category } } : {}),
        [category]
    );
    return useNotamData({ filter });
};
