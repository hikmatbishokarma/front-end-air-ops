// src/features/invoices/hooks/useInvoiceListData.ts

import { useState, useEffect, useCallback } from "react";
import moment from "moment";
// 💡 Adjust paths to your GQL utility, queries, and session context
import useGql from "@/lib/graphql/gql";
import { GET_INVOICES } from "@/lib/graphql/queries/invoice";
import { useSession } from "@/app/providers";

interface InvoiceListQueryArgs {
  filter: any;
  page: number;
  rowsPerPage: number;
  refreshKey: number; // For manual refetching
}

export const useInvoiceListData = ({
  filter,
  page,
  rowsPerPage,
  refreshKey,
}: InvoiceListQueryArgs) => {
  // Get operatorId from session context
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  // State to hold the invoice data and total count
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getInvoices = useCallback(async () => {
    setLoading(true);

    try {
      // 1. GQL Call: Identical to your original logic
      const data = await useGql({
        query: GET_INVOICES,
        queryName: "invoices",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...filter,
            // Include operatorId in the filter if available
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          "paging": {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      // Handle map and formatting logic
      const result = data?.data?.map((invoice: any) => {
        return {
          ...invoice,
          id: invoice.id,
          quotationNo: invoice?.quotationNo,
          requester: invoice?.quotation?.requestedBy?.name,
          createdAt: moment(invoice.createdAt).format("DD-MM-YYYY HH:mm"),
          updatedAt: moment(invoice.updatedAt).format("DD-MM-YYYY HH:mm"),
        };
      });

      // 2. Update state
      setTotalCount(data?.totalCount || 0);
      setInvoiceList(result || []);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      setInvoiceList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    // Dependencies: Hook re-runs whenever any of these values change
    filter,
    page,
    rowsPerPage,
    operatorId,
    refreshKey,
  ]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  return { invoiceList, totalCount, loading };
};
