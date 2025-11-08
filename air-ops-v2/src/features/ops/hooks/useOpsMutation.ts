import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import { useGqlMutation } from "../../../shared/hooks/useGqlMutation";
import { calculateFlightTime } from "../../../shared/utils";
import { CREATE_TRIP } from "../../../lib/graphql/queries/trip-detail";

export const useCreateTripMutation = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id;

  // Utilize your existing mutation wrapper hook
  const { loading, error, mutate } = useGqlMutation();

  const createTrip = useCallback(
    async (row: any) => {
      if (!operatorId) {
        showSnackbar("Operator ID not available for creating trip.", "error");
        return { success: false, error: new Error("Operator ID not found.") };
      }

      try {
        // --- 1. Data Transformation (Cleaning __typename and calculating flight time) ---
        const transformedSectors = row.sectors.map((sector: any) => {
          // Destructure to remove __typename fields from source/destination objects
          const { __typename: sourceTypename, ...restOfSource } = sector.source;
          const { __typename: destinationTypename, ...restOfDestination } =
            sector.destination;

          return {
            source: restOfSource,
            destination: restOfDestination,
            depatureDate: sector.depatureDate,
            depatureTime: sector.depatureTime,
            arrivalTime: sector.arrivalTime,
            arrivalDate: sector.arrivalDate,
            pax: sector.paxNumber || 0,
            flightTime: calculateFlightTime(
              sector.depatureDate,
              sector.depatureTime,
              sector.arrivalDate,
              sector.arrivalTime
            ),
          };
        });

        // --- 2. GQL Mutation Setup ---
        const gqlParams = {
          query: CREATE_TRIP,
          queryName: "createTrip",
          queryType: "mutation",
          variables: {
            input: {
              tripDetail: {
                operatorId,
                quotation: row.id,
                quotationNo: row.quotationNo,
                sectors: transformedSectors,
              },
            },
          },
        };

        // --- 3. Execute Mutation ---
        const result = await mutate(gqlParams);

        const newTripId = result?.data?.createTrip?.id;

        // --- 4. Side-Effect Handling (Snackbar & Navigation) ---
        if (result.success && newTripId) {
          showSnackbar(
            `Trip ${row.quotationNo} created successfully!`,
            "success"
          );

          // Navigate to the new trip detail page, passing the original quote row data as state
          navigate(`/app/trip-detail/${newTripId}`, { state: row });

          return { success: true, newTripId };
        }

        // Handle failure reported by the mutation wrapper
        showSnackbar(
          result.error?.message || "Failed to Create Trip!",
          "error"
        );
        return { success: false, error: result.error };
      } catch (err: any) {
        // Catch any unexpected errors during data cleaning or execution
        console.error("Unexpected error in createTrip:", err);
        showSnackbar(err.message || "Failed To Create Trip!", "error");
        return { success: false, error: err };
      }
    },
    [operatorId, navigate, showSnackbar, mutate]
  );

  return { createTrip, loading, error };
};
