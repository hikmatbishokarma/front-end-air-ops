import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
// 💡 ASSUMPTION: Update paths to your shared utilities and GQL definitions
import useGql from "@/lib/graphql/gql";
import { CHECK_FOR_PASSENGER } from "@/lib/graphql/queries/passenger-detail";
import { useSession, useSnackbar } from "@/app/providers";
import { QuotationStatus, SalesCategoryLabels } from "@/shared/utils";
import { GET_QUOTES, SHOW_PREVIEW } from "@/lib/graphql/queries/quote";

/**
 * Hook to check the existence of a Passenger Details record for a given quotation.
 * This function is used by the useCreateInitialPassengerDetails mutation hook.
 */
export const usePassengerExistenceCheck = () => {
  /**
   * Executes the GraphQL query to check if a passenger record exists.
   * @param quotationNo The quotation number.
   * @param quotationId The ID of the quotation record.
   * @returns A promise resolving to true if passenger record exists, false otherwise.
   */
  const isPassengerExist = useCallback(
    async (quotationNo: string, quotationId: string): Promise<boolean> => {
      try {
        // 1. Build and execute the query using custom useGql
        const result = await useGql({
          query: CHECK_FOR_PASSENGER,
          variables: {
            filter: {
              quotationNo: { eq: quotationNo },
              // Conditionally include quotationId if it exists
              ...(quotationId ? { quotation: { eq: quotationId } } : {}),
            },
          },
          queryName: "passengerDetails",
          queryType: "query-with-count", // Expects totalCount and data (nodes)
        });

        // 2. Error Check (if GQL returns errors)
        if (result?.errors?.length) {
          console.warn("Passenger check error:", result?.errors?.[0]?.message);
          return false; // Safely fail: don’t block creation if check fails
        }

        // 3. Data Check (result.data contains the 'nodes' array for 'query-with-count')
        return Array.isArray(result?.data) && result?.data?.length > 0;
      } catch (error) {
        // Catch network or unexpected errors
        console.error("Error checking passenger existence:", error);
        return false; // Safely fail: fallback to creation logic
      }
    },
    []
  ); // Empty dependency array as dependencies are passed as arguments

  return { isPassengerExist };
};

interface PreviewOptions {
  // These setters are passed from the component state
  setSaleConfirmationPreviewTemplate: Dispatch<SetStateAction<string | null>>;
  setShowTripConfirmationPreview: Dispatch<SetStateAction<boolean>>;
  setPreviewData: Dispatch<SetStateAction<any>>; // Type should match your preview data structure
  setShowPreview: Dispatch<SetStateAction<boolean>>;
}

export const useQuotePreview = ({
  setSaleConfirmationPreviewTemplate,
  setShowTripConfirmationPreview,
  setPreviewData,
  setShowPreview,
}: PreviewOptions) => {
  const showSnackbar = useSnackbar();

  // The function that encapsulates the original logic
  const fetchAndShowPreview = useCallback(
    async (
      row: any,
      selectedTab: string // Must be passed from the component
    ) => {
      // 1. Check if Sale Confirmation Preview should be shown
      if (
        row.status === QuotationStatus.SALE_CONFIRMED && // Assumed imported enum
        selectedTab === SalesCategoryLabels.SALE_CONFIRMATION // Assumed imported constant
      ) {
        setSaleConfirmationPreviewTemplate(row.confirmationTemplate);
        setShowTripConfirmationPreview(true); // Show the Trip Confirmation Dialog
        return;
      }

      // 2. Fetch standard quote preview
      try {
        const result = await useGql({
          query: SHOW_PREVIEW,
          queryName: "showPreview",
          queryType: "query-without-edge",
          variables: { quotationNo: row.quotationNo },
        });

        if (!result) {
          showSnackbar("Internal server error!", "error");
          setPreviewData(null);
          setShowPreview(false);
          return;
        }

        // Set the standard preview data and show the standard preview dialog
        setPreviewData(result);
        setShowPreview(true);
      } catch (error) {
        console.error("Preview error:", error);
        showSnackbar("Internal server error!", "error");
        setPreviewData(null);
        setShowPreview(false);
      }
    },
    [
      showSnackbar,
      setSaleConfirmationPreviewTemplate,
      setShowTripConfirmationPreview,
      setPreviewData,
      setShowPreview,
    ]
  );

  return { fetchAndShowPreview };
};

interface QuoteListQueryArgs {
  filter: any;
  page: number;
  rowsPerPage: number;
  refreshKey: number;
}

/**
 * Fetches paginated quote list data based on provided filters.
 */
export const useQuoteListData = ({
  filter,
  page,
  rowsPerPage,
  refreshKey,
}: QuoteListQueryArgs) => {
  const [quoteList, setQuoteList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();

  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...filter,
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          offset: page * rowsPerPage,
          limit: rowsPerPage,
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      if (result?.errors?.length) {
        throw new Error(
          result.errors[0]?.message || "Failed to load quote list."
        );
      }

      setQuoteList(result?.data || []);
      setTotalCount(result?.totalCount || 0);
    } catch (error: any) {
      console.error("Quote list fetch error:", error);
      showSnackbar(error.message || "Failed to load quote list.", "error");
      setQuoteList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filter, page, rowsPerPage, refreshKey]); // Dependencies for refetching

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return { quoteList, totalCount, loading };
};
