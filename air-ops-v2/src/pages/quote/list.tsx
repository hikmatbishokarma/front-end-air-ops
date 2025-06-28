import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TablePagination,
  Typography,
  Autocomplete,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "../../lib/graphql/gql";
import {
  GET_QUOTES,
  SHOW_PREVIEW,
  UPDATE_QUOTE_STATUS,
} from "../../lib/graphql/queries/quote";

import { Outlet, useNavigate } from "react-router";

import { useSnackbar } from "../../SnackbarContext";

import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../../components/quote-preview";

import {
  getEnumKeyByValue,
  QuotationStatus,
  SalesCategoryLabels,
} from "../../lib/utils";

import QuotationCancellationConfirmation from "./quotation-cancellation";
import SearchIcon from "@mui/icons-material/Search";
import { useQuoteData } from "../../hooks/useQuoteData";
import { useSession } from "../../SessionContext";
import { Iclient } from "../../interfaces/quote.interface";
import moment from "moment";
import SaleConfirmationPreview from "../../components/SaleConfirmationPreview";
import CloseIcon from "@mui/icons-material/Close";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";
import { CustomDialog } from "../../components/CustomeDialog";

export const QuoteList = ({
  filter,
  isGenerated = true,
  setSelectedTab,
  refreshKey,
  setRefreshKey,
  setFilter,
  setShowInvoicePreview,
  setInvoicedata,
  quoteList,
  totalCount,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  selectedTab,
}) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [saleConfirmationPreviewTemplate, setSaleConfirmationPreviewTemplate] =
    useState(null);

  const handelPreview = async (row) => {
    setSelectedRowData(row);

    if (
      row.status == QuotationStatus.SALE_CONFIRMED &&
      selectedTab == SalesCategoryLabels.SALE_CONFIRMATION
    ) {
      setSaleConfirmationPreviewTemplate(row.confirmationTemplate);
      setShowTripConfirmationPreview(true);
    } else {
      const result = await useGql({
        query: SHOW_PREVIEW,
        queryName: "showPreview",
        queryType: "query-without-edge",
        variables: { quotationNo: row.quotationNo },
      });

      if (!result) {
        showSnackbar("Internal server error!", "error");
      }
      setPreviewData(result);
      setShowPreview(true);
    }
  };

  const { clients } = useQuoteData();

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

  /** INVOICE */

  const onGenerateInvoice = async ({
    type,
    quotationNo,
    proformaInvoiceNo = "",
  }) => {
    const result = await useGql({
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
    });

    if (!result.data) {
      showSnackbar(
        result?.errors?.[0]?.message || "Internal server error!",
        "error"
      );
    } else {
      showSnackbar("Invoice Generated Successfully!", "success");
      setInvoicedata(result?.data?.generateInvoice);
      setShowPreview(false);
      setShowInvoicePreview(true);
      setSelectedTab("Invoices");
      setRefreshKey();

      setFilter({
        "or": [
          {
            "status": {
              "eq": "PROFOMA_INVOICE",
            },
          },
          {
            "status": {
              "eq": "TAX_INVOICE",
            },
          },
        ],
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Quotation No</TableCell>

              <TableCell sx={headerStyle}>Requester</TableCell>
              <TableCell sx={headerStyle}>Sectors</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              {/* <TableCell sx={headerStyle}>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteList?.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: !row.isLatest ? "#f9f9f9" : "inherit",
                  opacity: !row.isLatest ? 0.6 : 1,
                  cursor: "pointer",
                }}
                onClick={() => handelPreview(row)}
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>

                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                {/* <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handelPreview(row)}
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>
                </TableCell> */}
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
        title="Quote Preview"
        width="900px"
        maxWidth="md"
      >
        <QuotePreview
          htmlContent={previewData}
          currentId={selectedRowData?.id}
          currentQuotation={selectedRowData?.quotationNo}
          showEdit={selectedRowData?.isLatest}
          showGeneratePI={selectedRowData?.isLatest}
          onGenerateInvoice={onGenerateInvoice}
        />
      </CustomDialog>

      <CustomDialog
        open={showTripConfirmationPreview}
        onClose={() => setShowTripConfirmationPreview(false)}
        title="Sale Confirmation Preview"
        width="900px"
        maxWidth="md"
      >
        <SaleConfirmationPreview
          htmlContent={saleConfirmationPreviewTemplate}
          currentQuotation={selectedRowData?.quotationNo}
          showGenerateTI={selectedRowData?.isLatest}
          onGenerateInvoice={onGenerateInvoice}
        />
      </CustomDialog>
    </>
  );
};

export default QuoteList;
