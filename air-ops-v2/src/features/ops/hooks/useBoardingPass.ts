import { useCallback, useState } from "react";
import { useSnackbar } from "@/app/providers";
import { useGqlMutation } from "../../../shared/hooks/useGqlMutation";
import useGql from "../../../lib/graphql/gql";
import { GENERATE_BOARDING_PASS, GET_BOARDING_PASSES } from "../../../lib/graphql/queries/boarding-pass";

export const useBoardingPass = () => {
    const showSnackbar = useSnackbar();

    // Generating (Mutation)
    const { loading: generating, mutate } = useGqlMutation();

    const generateBoardingPasses = useCallback(
        async (tripId: string, sectorNo: number) => {
            try {
                const result = await mutate({
                    query: GENERATE_BOARDING_PASS,
                    queryName: "generateBoardingPass",
                    queryType: "mutation",
                    variables: {
                        input: {
                            tripId,
                            sectorNo,
                        },
                    },
                });

                if (result?.error) throw result.error;

                showSnackbar("Boarding passes generated successfully!", "success");
                return result?.data;
            } catch (err: any) {
                showSnackbar(err.message || "Failed to generate boarding passes", "error");
                return null;
            }
        },
        [mutate, showSnackbar]
    );

    // Fetching (Query)
    // This is a bit tricky with useGql custom hook if we want to call it imperatively or reactively.
    // useGql typically behaves like useQuery but async in useEffect? 
    // Let's implement a manual fetch function or use a state-based approach for the list.

    const [boardingPasses, setBoardingPasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBoardingPasses = useCallback(async (tripId: string, sectorNo: number) => {
        setLoading(true);
        try {
            const result = await useGql({
                query: GET_BOARDING_PASSES,
                queryName: "getBoardingPasses",
                queryType: "query-without-edge", // Assuming it returns array directly not edges
                variables: { tripId, sectorNo },
            });
            setBoardingPasses(result || []);
        } catch (err) {
            console.error(err);
            // showSnackbar("Failed to fetch boarding passes", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        generateBoardingPasses,
        fetchBoardingPasses,
        boardingPasses,
        generating,
        loading,
    };
};
