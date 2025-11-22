import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router";

import { useCallback, useState } from "react";
import useGql from "@/lib/graphql/gql";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import {
  CREATE_QUOTE,
  SALE_CONFIRMATION,
  UPDATE_QUOTE,
} from "@/lib/graphql/queries/quote";
import { calculateFlightTime } from "@/shared/utils";
import {
  CREATE_PASSENGER_DETAILS,
  UPADTE_PASSANGER_DETAIL,
} from "@/lib/graphql/queries/passenger-detail";
import { useGqlMutation } from "@/shared/hooks/useGqlMutation";

/**
 * Interface for mutation options, allowing the component to control side-effects.
 */
interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

// ----------------------------------------------------------------------
// 1. CREATE QUOTE (Used by QuoteCreate.tsx)
// ----------------------------------------------------------------------

export const useCreateQuote = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  // Ensure useSession is correctly imported and provides session data
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;

  const { loading, error, mutate } = useGqlMutation();

  const createQuote = useCallback(
    async (formData: any) => {
      try {
        // 1. DATA MAPPING/CLEANING (copied directly from your component logic)
        const cleanedPayload: any = {
          ...(formData.category && { category: formData.category }),
          // Map relationship objects to their IDs (e.g., formData.aircraft.id)
          ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
          ...(formData.requestedBy && {
            requestedBy: formData.requestedBy?.id,
          }),
          ...(formData.representative && {
            representative: formData.representative?.id,
          }),
        };

        // Clean sectors (filter out incomplete sectors)
        if (Array.isArray(formData?.sectors)) {
          const cleanedSectors = formData.sectors.filter(
            (item: any) => item.source && item.destination
          );
          if (cleanedSectors.length) cleanedPayload.sectors = cleanedSectors;
        }

        // Clean prices (filter based on category and required fields)
        if (Array.isArray(formData.prices)) {
          const cleanedPrices =
            formData.category === "CHARTER"
              ? formData.prices
              : formData.prices.filter((item: any) => item.label && item.price);

          if (cleanedPrices.length) {
            cleanedPayload.prices = cleanedPrices;
            cleanedPayload.grandTotal = formData.grandTotal;
          }
        }

        // 2. API CALL
        const gqlParams = {
          query: CREATE_QUOTE,
          queryName: "quote",
          queryType: "mutation",
          variables: {
            input: {
              quote: { ...cleanedPayload, operatorId },
            },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar & Navigation)
        if (result.success) {
          showSnackbar("Created new Quote!", "success");
          navigate("/app/quotes", { state: { refresh: true } });
        } else {
          // If the custom mutate failed, it already set the error state
          showSnackbar(
            result.error?.message || "Failed To Create Quote!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        // Catch any unexpected errors during data cleaning or navigation
        showSnackbar(err.message || "Failed To Create Quote!", "error");
        return { success: false, error: err };
      }
    },
    [operatorId, navigate, showSnackbar, mutate]
  );

  return { createQuote, loading, error };
};

// ----------------------------------------------------------------------
// 2. UPDATE QUOTE (Used by QuoteEdit.tsx)
// ----------------------------------------------------------------------

export const useUpdateQuote = (quoteId: string | undefined) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;

  // Use the reusable mutation logic
  const { loading, error, mutate } = useGqlMutation();

  const updateQuote = useCallback(
    async (formData: any) => {
      try {
        // 1. DATA MAPPING/CLEANING (copied directly from your component logic)
        const cleanedPayload: any = {
          ...(formData.category && { category: formData.category }),
          // Map relationship objects to their IDs
          ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
          ...(formData.requestedBy && {
            requestedBy: formData.requestedBy?.id,
          }),
          ...(formData.representative && {
            representative: formData.representative?.id,
          }),
        };

        // Clean itinerary (filter out incomplete items) - legacy support
        if (Array.isArray(formData.itinerary)) {
          const cleanedItinerary = formData.itinerary.filter(
            (item: any) => item.source && item.destination
          );
          if (cleanedItinerary.length)
            cleanedPayload.itinerary = cleanedItinerary;
        }

        // Clean sectors (filter out incomplete sectors) - current form uses sectors
        if (Array.isArray(formData?.sectors)) {
          const cleanedSectors = formData.sectors
            .filter((item: any) => item.source && item.destination)
            .map((sector: any) => {
              // Remove __typename from nested objects (source and destination)
              const { __typename: sourceTypename, ...source } =
                sector.source || {};
              const { __typename: destTypename, ...destination } =
                sector.destination || {};
              const { __typename, ...rest } = sector;

              return {
                ...rest,
                source,
                destination,
              };
            });
          if (cleanedSectors.length) cleanedPayload.sectors = cleanedSectors;
        }

        // Clean prices (filter, remove __typename)
        if (Array.isArray(formData.prices)) {
          const cleanedPrices = formData.prices
            .filter((item: any) => item.label && item.price)
            // ⚠️ This is the crucial step: remove __typename from nested objects
            .map(({ __typename, ...rest }: any) => rest);

          if (cleanedPrices.length) {
            cleanedPayload.prices = cleanedPrices;
            cleanedPayload.grandTotal = formData.grandTotal;
          }
        }

        // 2. API CALL
        const gqlParams = {
          query: UPDATE_QUOTE,
          queryName: "updateOneQuote", // ASSUMED queryName based on standard convention
          queryType: "mutation",
          variables: {
            input: {
              id: quoteId, // The ID comes from the hook's argument
              update: { ...cleanedPayload, operatorId, providerType: "airops" },
            },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar & Navigation)
        if (result.success) {
          showSnackbar("Quote updated successfully!", "success");
          navigate("/app/quotes", { state: { refresh: true } });
        } else {
          showSnackbar(
            result.error?.message || "Failed To Update Quote!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        showSnackbar(err.message || "Failed To Update Quote!", "error");
        return { success: false, error: err };
      }
    },
    [operatorId, navigate, showSnackbar, mutate, quoteId]
  ); // Include quoteId in dependencies

  return { updateQuote, loading, error };
};

// ----------------------------------------------------------------------
// 3. CONFIRM SALE (Replaces onGenerateSalesConfirmation from list.tsx)
// ----------------------------------------------------------------------

interface ConfirmSaleOptions {
  // State setters from the QuoteList component
  setSaleConfirmationPreviewTemplate?: (template: string) => void;
  setShowTripConfirmationPreview: (show: boolean) => void;
  setRefreshKey: () => void;
}

/**
 * Handles the SALE_CONFIRMATION mutation, updates UI state, and triggers a refresh.
 */
export const useConfirmSale = ({
  setSaleConfirmationPreviewTemplate,
  setShowTripConfirmationPreview,
  setRefreshKey,
}: ConfirmSaleOptions) => {
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;
  const { loading, error, mutate } = useGqlMutation(); // Reusable internal mutation hook

  const confirmSale = useCallback(
    async (quotationNo: string) => {
      try {
        const gqlParams = {
          query: SALE_CONFIRMATION,
          queryName: "saleConfirmation",
          queryType: "mutation",
          variables: {
            args: {
              quotationNo,
              ...(operatorId && { operatorId }),
            },
          },
        };

        const result = await mutate(gqlParams);

        if (result.success) {
          showSnackbar("Sale confirmed successfully!", "success");

          // Update local UI state using injected setters
          setSaleConfirmationPreviewTemplate?.(
            result?.data?.confirmationTemplate
          );
          setShowTripConfirmationPreview(true);
        } else {
          showSnackbar(
            result.error?.message || "Failed to confirm sale!",
            "error"
          );
        }
        return result;
      } catch (error: any) {
        // Catch any unexpected errors
        showSnackbar(error.message || "Failed to confirm sale!", "error");
        return { success: false, error };
      } finally {
        // Always run the refresh key update, regardless of success/failure
        setRefreshKey();
      }
    },
    [
      operatorId,
      showSnackbar,
      mutate,
      setSaleConfirmationPreviewTemplate,
      setShowTripConfirmationPreview,
      setRefreshKey,
    ]
  );

  return { confirmSale, loading, error };
};

// ----------------------------------------------------------------------
// INITIAL PASSENGER DETAILS CREATION (Replaces onAddPassenger from list.tsx)
// ----------------------------------------------------------------------

/**
 * Creates the initial passenger detail record for a new quotation.
 * @param isPassengerExist - The query function extracted to useQuoteQueries.ts
 */
export const useCreateInitialPassengerDetails = (
  isPassengerExist: (quotationNo: string, quoteId: string) => Promise<boolean>
) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;
  const { loading, error, mutate } = useGqlMutation();

  // This function contains the complex flow logic from the original onAddPassenger
  const createPassengerDetails = useCallback(
    async (row: any) => {
      // 1. Existence Check (Logic copied from original component)
      const isPaxExist = await isPassengerExist(row.quotationNo, row.id);

      if (isPaxExist) {
        navigate(
          `/app/passenger-detail/${encodeURIComponent(row.quotationNo)}`
        );
        return { success: true };
      }

      try {
        // 2. Data Cleaning/Mapping (Logic copied from original component)
        const sectors = row.sectors.map((sector: any, index: number) => {
          // Destructure to remove __typename fields before sending to the API
          const { __typename, ...source } = sector.source || {};
          const { __typename: __typenameDest, ...destination } =
            sector.destination || {};

          return {
            sectorNo: index + 1,
            source,
            destination,
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

        // 3. Mutation Call (using your useGql wrapper)
        const gqlParams = {
          query: CREATE_PASSENGER_DETAILS,
          queryName: "createOnePassengerDetail", // Assuming queryName is correct
          queryType: "mutation",
          variables: {
            input: {
              passengerDetail: {
                operatorId,
                quotation: row.id,
                quotationNo: row.quotationNo,
                sectors,
              },
            },
          },
        };

        const result = await mutate(gqlParams);

        // 4. Success Handling (Navigation/Snackbar)
        if (result.success) {
          navigate(
            `/app/passenger-detail/${encodeURIComponent(row.quotationNo)}`
          );
        } else {
          showSnackbar(
            result.error?.message || "Failed to add passenger!",
            "error"
          );
        }
        return result;
      } catch (error: any) {
        // Catch errors from data mapping or navigation outside the useGqlMutation
        console.error("Failed to add passenger:", error);
        showSnackbar(error.message || "Failed to add passenger!", "error");
        return { success: false, error };
      }
    },
    [operatorId, navigate, showSnackbar, mutate, isPassengerExist]
  );

  return { createPassengerDetails, loading, error };
};

// ----------------------------------------------------------------------
// 6. UPDATE PASSENGER DETAILS (Replaces handelSectorSave)
// ----------------------------------------------------------------------

/**
 * Handles the mutation for updating passenger details (sectors, passengers, etc.).
 * Used by QuoteListPage (through a dialog) and PassengerEditPage.
 */
export const useUpdatePassengerDetails = () => {
  const showSnackbar = useSnackbar();
  // Use the reusable internal hook for state management
  const { loading, error, mutate } = useGqlMutation();

  // The logic from handelSectorSave is now wrapped in a memoized function
  const updatePassengerDetails = useCallback(
    async (payload: any) => {
      const gqlParams = {
        query: UPADTE_PASSANGER_DETAIL,
        queryName: "updatePassengerDetail",
        queryType: "mutation",
        variables: payload, // The payload is expected to already contain the 'variables' structure
      };

      const result = await mutate(gqlParams);

      // Handle side-effects based on the mutation result
      if (result.success) {
        showSnackbar("Details updated successfully", "success");
      } else {
        showSnackbar(
          result.error?.message || "Failed to update details!",
          "error"
        );
      }
      return result;
    },
    [showSnackbar, mutate]
  );

  return { updatePassengerDetails, loading, error };
};
