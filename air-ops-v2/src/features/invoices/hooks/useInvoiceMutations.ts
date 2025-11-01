import { useCallback } from "react";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import { GENERATE_INVOICE } from "@/lib/graphql/queries/invoice";
import { useGqlMutation } from "@/shared/hooks/useGqlMutation";

// Define the arguments the hook will accept for managing list state
interface InvoiceMutationOptions {
  setInvoiceData: (data: any) => void;
  setShowInvoicePreview: (show: boolean) => void;
  setSelectedTab: (tab: string) => void;
  setFilter: (filter: any) => void;
  setRefreshKey: () => void;
}

interface GenerateInvoiceArgs {
  type: string;
  quotationNo: string;
  proformaInvoiceNo?: string; // Optional field
}

export const useGenerateInvoice = ({
  setInvoiceData,
  setShowInvoicePreview,
  setSelectedTab,
  setFilter,
  setRefreshKey,
}: InvoiceMutationOptions) => {
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;
  const { loading, mutate } = useGqlMutation(); // Assuming useGqlMutation is available

  const onGenerateInvoice = useCallback(
    async ({
      type,
      quotationNo,
      proformaInvoiceNo = "",
    }: GenerateInvoiceArgs) => {
      const gqlParams = {
        query: GENERATE_INVOICE,
        queryName: "generateInvoice",
        queryType: "mutation",
        variables: {
          args: {
            type,
            quotationNo,
            ...(proformaInvoiceNo && { proformaInvoiceNo }),
            ...(operatorId && { operatorId }),
          },
        },
      };

      const result = await mutate(gqlParams);

      if (result.success) {
        showSnackbar("Invoice Generated Successfully!", "success");

        // Complex state updates moved from component to hook options
        setInvoiceData(result.data);
        setShowInvoicePreview(true);
        setSelectedTab("Invoices");
        setRefreshKey();

        // Set complex filter state for the Invoices tab
        setFilter({
          "or": [
            { "status": { "eq": "PROFOMA_INVOICE" } },
            { "status": { "eq": "TAX_INVOICE" } },
          ],
        });
      } else {
        showSnackbar(
          result.error?.message || "Internal server error!",
          "error"
        );
      }
      return result;
    },
    [
      operatorId,
      showSnackbar,
      mutate,
      setInvoiceData,
      setShowInvoicePreview,
      setSelectedTab,
      setFilter,
      setRefreshKey,
    ]
  );

  return { onGenerateInvoice, loading };
};
