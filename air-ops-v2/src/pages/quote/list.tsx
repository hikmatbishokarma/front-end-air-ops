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

import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";

import QuotationCancellationConfirmation from "./quotation-cancellation";
import SearchIcon from "@mui/icons-material/Search";
import { useQuoteData } from "../../hooks/useQuoteData";
import { useSession } from "../../SessionContext";
import { Iclient } from "../../interfaces/quote.interface";
import moment from "moment";
import TripConfirmationPreview from "../../components/trip-confirmation-preview";
import CloseIcon from "@mui/icons-material/Close";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";

export const QuoteList = ({
  filter,
  isGenerated = true,
  setSelectedTab,
  refreshKey,
  setRefreshKey,
  setFilter,
  setShowInvoicePreview,
  setInvoicedata,
}) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const [selectedRequester, setSelectedRequester] = useState<Iclient | null>();

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [tripConfirmationPreviewTemplate, setTripConfirmationPreviewTemplate] =
    useState(null);

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...filter,
            ...(selectedRequester?.id && {
              requestedBy: { eq: selectedRequester.id },
            }),
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          "paging": {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      const result = data?.data?.map((quote: any) => {
        return {
          ...quote,
          id: quote.id,
          quotationNo: quote?.quotationNo,
          status: QuotationStatus[quote.status],
          requester: quote.requestedBy.name,
          requesterId: quote.requestedBy.id,
          version: quote.version,
          revision: quote.revision,
          itinerary: quote.itinerary
            ?.map((itinerary: any) => {
              return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
            })
            .join(", "),
          createdAt: moment(quote.createdAt).format("DD-MM-YYYY HH:mm"),
          updatedAt: quote.updatedAt,
          code: quote.code,
        };
      });
      console.log("result:::", result);
      setTotalCount(data?.totalCount || 0);
      setRows(result);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, [filter, selectedRequester, page, rowsPerPage, isGenerated, refreshKey]);

  const handelPreview = async (row) => {
    setSelectedRowData(row);

    if (row.status == QuotationStatus.CONFIRMED) {
      setTripConfirmationPreviewTemplate(row.confirmationTemplate);
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

  const refreshList = async () => {
    await getQuotes();
  };

  const updateQuoteStatus = async (id, toStatus) => {
    try {
      const data = await useGql({
        query: UPDATE_QUOTE_STATUS,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            id: id,
            status: getEnumKeyByValue(QuotationStatus, toStatus),
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    } finally {
      refreshList();
    }
  };

  const handelCancellation = async (id) => {
    try {
      await updateQuoteStatus(id, QuotationStatus.CANCELLED);
    } catch (error) {
      console.error("Error transitioning state:", error);
    } finally {
    }
  };

  const filteredRows = rows?.filter((row) =>
    row.quotationNo?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <TextField
            variant="outlined"
            size="small"
            label="Search Quotation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <Autocomplete
              size="small"
              options={clients}
              getOptionLabel={(option) => option.name || ""}
              value={selectedRequester}
              onChange={(_, newValue) => setSelectedRequester(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Requester" />
              )}
              sx={{ minWidth: 200 }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>
        </Box>
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
            {filteredRows?.map((row) => (
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

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {" "}
          Quote Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowPreview(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <QuotePreview
            htmlContent={previewData}
            currentId={selectedRowData?.id}
            currentQuotation={selectedRowData?.quotationNo}
            showEdit={selectedRowData?.isLatest}
            showGeneratePI={selectedRowData?.isLatest}
            onGenerateInvoice={onGenerateInvoice}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setShowPreview(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>

      <Dialog
        open={showTripConfirmationPreview}
        onClose={() => setShowTripConfirmationPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {" "}
          Trip Confirmation Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowTripConfirmationPreview(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TripConfirmationPreview
            htmlContent={tripConfirmationPreviewTemplate}
            currentQuotation={selectedRowData?.quotationNo}
            showGenerateTI={selectedRowData?.isLatest}
            onGenerateInvoice={onGenerateInvoice}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button
            onClick={() => setShowTripConfirmationPreview(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default QuoteList;
