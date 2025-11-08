import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "@/lib/graphql/gql";

import { useNavigate } from "react-router";

import { useSnackbar } from "@/app/providers";

import SearchIcon from "@mui/icons-material/Search";

import { useSession } from "@/app/providers";

import moment from "moment";
import InvoicePreview from "../components/InvoicePreview";
import { GET_INVOICES } from "@/lib/graphql/queries/invoice";
import CloseIcon from "@mui/icons-material/Close";
import { SALE_CONFIRMATION } from "@/lib/graphql/queries/quote";
import { CustomDialog } from "@/components/CustomeDialog";
import { calculateFlightTime, SalesCategoryLabels } from "@/shared/utils";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PassengerDetails from "@/shared/components/passenger/passanger-detail";
import {
  CREATE_PASSENGER_DETAILS,
  GET_PASSENGER_DETAILS,
  UPADTE_PASSANGER_DETAIL,
} from "@/lib/graphql/queries/passenger-detail";
import { useInvoiceListData } from "../hooks/useInvoiceQueries";
import { useConfirmSale } from "../../quotes/hooks/useQuoteMutations";
import { QuoteFilter } from "@/features/quotes/types/interfaces";
import { Setter } from "@/shared/types/common";

// 3. Interface for InvoiceList Props
interface InvoiceListProps {
  // Data/Filter Management Props
  filter: QuoteFilter;
  refreshKey: number;
  setFilter: Setter<QuoteFilter>;
  setRefreshKey: () => void; // Function to trigger a data refresh (e.g., setRefreshKey(Date.now()))

  // UI/Flow Control Props
  isGenerated: boolean; // Flag indicating if a related action (e.g., invoice generation) occurred
  setSelectedTab: Setter<string>; // Function to switch the active dashboard tab

  // Sale Confirmation Modal Handlers (These props link the InvoiceList to the Sale Confirmation preview)
  setShowTripConfirmationPreview: Setter<boolean>; // Opens/closes the Sale Confirmation Preview modal
  setSaleConfirmationData: Setter<any | null>; // Sets the data/template for the Sale Confirmation Preview
}
export const InvoiceList = ({
  filter,
  isGenerated,
  setSelectedTab,
  refreshKey,
  setRefreshKey,
  setFilter,
  setShowTripConfirmationPreview,
  setSaleConfirmationData,
}: InvoiceListProps) => {
  const { session } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const { confirmSale: apiConfirmSale, loading: confirmingSale } =
    useConfirmSale({
      setShowTripConfirmationPreview,
      setRefreshKey,
    });

  // const [totalCount, setTotalCount] = useState(0); // total count from backend

  // const getInvoices = async () => {
  //   try {
  //     const data = await useGql({
  //       query: GET_INVOICES,
  //       queryName: "invoices",
  //       queryType: "query-with-count",
  //       variables: {
  //         filter: {
  //           ...filter,
  //           ...(operatorId && { operatorId: { eq: operatorId } }),
  //         },
  //         "paging": {
  //           "offset": page * rowsPerPage,
  //           "limit": rowsPerPage,
  //         },
  //         "sorting": [{ "field": "createdAt", "direction": "DESC" }],
  //       },
  //     });

  //     const result = data?.data?.map((invoice: any) => {
  //       return {
  //         ...invoice,
  //         id: invoice.id,
  //         quotationNo: invoice?.quotationNo,
  //         requester: invoice?.quotation?.requestedBy?.name,
  //         createdAt: moment(invoice.createdAt).format("DD-MM-YYYY HH:mm"),
  //         updatedAt: moment(invoice.updatedAt).format("DD-MM-YYYY HH:mm"),
  //       };
  //     });

  //     setTotalCount(data?.totalCount || 0);
  //     setRows(result);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getInvoices();
  // }, [filter, page, rowsPerPage, isGenerated, refreshKey]);

  // 2. Call the Hook

  const { invoiceList, totalCount, loading } = useInvoiceListData({
    filter,
    page,
    rowsPerPage,
    refreshKey,
  });

  if (loading) return <p>Loading Invoices...</p>;

  const handelPreview = (row: any) => {
    setSelectedRowData(row);
    setShowPreview(true);
  };

  const filteredRows = invoiceList?.filter((row) =>
    row.quotationNo?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headerStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: 700,
    borderBottom: "2px solid #ccc",
  };

  /** SALE CONFIRMATION */

  // const handelSaleConfirmation = async ({ quotationNo }) => {
  //   const result = await useGql({
  //     query: SALE_CONFIRMATION,
  //     queryName: "saleConfirmation",
  //     queryType: "mutation",
  //     variables: {
  //       args: {
  //         quotationNo,
  //         ...(operatorId && { operatorId }),
  //       },
  //     },
  //   });

  //   if (!result.data) {
  //     showSnackbar(
  //       result?.errors?.[0]?.message || "Internal server error!",
  //       "error"
  //     );
  //   } else {
  //     showSnackbar("Sale confirmed successfully!", "success");
  //     setSaleConfirmationData(result?.data?.saleConfirmation);
  //     setShowPreview(false);
  //     setShowTripConfirmationPreview(true);
  //     setFilter({
  //       status: {
  //         eq: "SALE_CONFIRMED",
  //       },
  //     });

  //     setSelectedTab(SalesCategoryLabels.SALE_CONFIRMATION);
  //     setRefreshKey();
  //   }
  // };

  // --- 2. Refactored Handler to replace your original 'handelSaleConfirmation' ---
  const handelSaleConfirmation = async ({
    quotationNo,
  }: {
    quotationNo: string;
  }) => {
    // 💡 The API call, snackbar, and local preview state changes are now INSIDE the hook.
    // The hook returns the success status and data.
    const result = await apiConfirmSale(quotationNo);

    // If the hook reports success, execute the application flow control
    if (result.success) {
      // These steps MUST remain here because they involve state outside the hook's scope:

      // 1. Set local data
      setSaleConfirmationData(result?.data);

      // 2. Close the current modal
      setShowPreview(false);

      // 3. Update the global filter (to switch the list view)
      setFilter({
        or: [
          {
            status: {
              eq: "SALE_CONFIRMED",
            },
          },
        ],
      });

      // 4. Switch the selected tab
      setSelectedTab(SalesCategoryLabels.SALE_CONFIRMATION);

      // NOTE: setRefreshKey() is already handled by the hook's 'finally' block
    }
    // If result.success is false, the hook already showed the error snackbar.
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Quotation No</TableCell>
              <TableCell>Aircarft</TableCell>
              <TableCell sx={headerStyle}>Proforma Invoice No</TableCell>
              <TableCell sx={headerStyle}>Tax Invoice No</TableCell>
              <TableCell sx={headerStyle}>Requester</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              {/* <TableCell sx={headerStyle}>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handelPreview(row)}
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell> {row?.quotation?.aircraft?.code}</TableCell>
                <TableCell align="right">{row.proformaInvoiceNo}</TableCell>
                <TableCell align="right">
                  {row.taxInvoiceNo ? row.taxInvoiceNo : "NA"}
                </TableCell>
                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <CustomDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        width="900px"
        maxWidth="md"
      >
        <InvoicePreview
          htmlContent={selectedRowData?.template}
          currentQuotation={selectedRowData?.quotationNo}
          type={selectedRowData?.type}
          handelSaleConfirmation={handelSaleConfirmation}
        />
      </CustomDialog>
    </>
  );
};

export default InvoiceList;
