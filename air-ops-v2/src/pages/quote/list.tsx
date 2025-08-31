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
  PREVIEW_SALES_CONFIRMATION,
  SALE_CONFIRMATION,
  SHOW_PREVIEW,
  UPDATE_QUOTE_STATUS,
} from "../../lib/graphql/queries/quote";

import { Outlet, useNavigate } from "react-router";

import { useSnackbar } from "../../SnackbarContext";

import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../../components/quote-preview";

import {
  calculateFlightTime,
  FlightCategoryEnum,
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
import PassengerDetails from "./passanger-detail";
import {
  CREATE_PASSENGER_DETAILS,
  GET_PASSENGER_DETAIL_BY_ID,
  UPADTE_PASSANGER_DETAIL,
} from "../../lib/graphql/queries/passenger-detail";

type currentQuotationInfo = {
  id: string;
  quotationNo: string;
  status?: string;
  client: any;
  isLatest: boolean;
};

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

  const operatorId = session?.user.operator?.id || null;

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);

  const [currentQuotationInfo, setCurrentQuotationInfo] =
    useState<currentQuotationInfo>();

  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [saleConfirmationPreviewTemplate, setSaleConfirmationPreviewTemplate] =
    useState(null);

  const [showPassengerDetail, setShowPassengerDetail] = useState(false);

  const handelPreview = async (row) => {
    setSelectedRowData(row);

    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });

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

  const onGeneratePI = async (rowData) => {
    await onGenerateInvoice({
      type: "PROFORMA_INVOICE",
      quotationNo: rowData.quotationNo,
    });
    setRefreshKey();
  };

  const onAddPassenger = async (row) => {
    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });

    try {
      {
        const data = await useGql({
          query: CREATE_PASSENGER_DETAILS,
          queryName: "",
          queryType: "mutation",
          variables: {
            input: {
              passengerDetail: {
                operatorId,
                quotation: row.id,
                quotationNo: row.quotationNo,
                sectors: row.sectors.map((sector, index) => ({
                  sectorNo: index + 1,
                  source: sector.source,
                  destination: sector.destination,
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
                })),
              },
            },
          },
        });

        if (data?.errors) {
          // Use optional chaining for safer access
          throw new Error(data.errors[0]?.message || "Something went wrong.");
        } else {
          setShowPassengerDetail(true);
        }
      }
    } catch (error) {
      // Catch and handle all errors from API call or state updates
      console.error("Failed to add passenger:", error);
      showSnackbar(error.message || "Failed to add passenger!", "error");
    }
  };

  const onGenerateSalesConfirmation = async (rowData) => {
    try {
      const result = await useGql({
        query: SALE_CONFIRMATION,
        queryName: "saleConfirmation",
        queryType: "mutation",
        variables: {
          args: {
            quotationNo: rowData.quotationNo,
            ...(operatorId && { operatorId }),
          },
        },
      });

      if (!result || result?.errors?.length) {
        showSnackbar(
          result?.errors?.[0]?.message || "Internal server error!",
          "error"
        );
      } else {
        showSnackbar("Sale confirmed successfully!", "success");

        setSaleConfirmationPreviewTemplate(result?.confirmationTemplate);

        setShowTripConfirmationPreview(true);
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to Add!", "error");
    } finally {
      setRefreshKey();
    }
  };

  const handelSectorSave = async (payload) => {
    try {
      const data = await useGql({
        query: UPADTE_PASSANGER_DETAIL,
        queryName: "updatePassengerDetail",
        queryType: "mutation",
        variables: payload,
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else showSnackbar("Add successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to Add!", "error");
    }
  };

  const handelSaveAndPreview = async (quotationNo) => {
    try {
      const data = await useGql({
        query: PREVIEW_SALES_CONFIRMATION,
        queryName: "previewSalesConfirmation",
        queryType: "query-without-edge",
        variables: { quotationNo: quotationNo },
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else {
        setSaleConfirmationPreviewTemplate(data);
        setShowTripConfirmationPreview(true);
        setShowPassengerDetail(false);
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to Add!", "error");
    } finally {
      setRefreshKey();
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="dash-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Operator</TableCell>
              <TableCell sx={headerStyle}>Quotation No</TableCell>
              <TableCell sx={headerStyle}>Category</TableCell>
              <TableCell sx={headerStyle}>Aircraft</TableCell>
              <TableCell sx={headerStyle}>Enquiry From</TableCell>
              <TableCell sx={headerStyle}>Sectors</TableCell>
              <TableCell sx={headerStyle}>Created On</TableCell>
              <TableCell sx={headerStyle}>Action</TableCell>
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
                  {row.operator?.companyName ?? "AirOps"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell component="th" scope="row">
                  {FlightCategoryEnum[row.category]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row?.aircraft?.name} (${row?.aircraft?.code})`}
                </TableCell>

                <TableCell align="right">{row?.requester ?? "N/A"}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {/* If the quote is a charter AND it's a new quote */}
                  {row.category === "CHARTER" &&
                    row.status === QuotationStatus.QUOTE && (
                      <Button
                        variant="outlined"
                        onClick={() => onGeneratePI(row)}
                      >
                        Generate PI
                      </Button>
                    )}
                  {/* If the quote is an in-house flight OR a charter where PI has been sent */}
                  {((row.category !== "CHARTER" &&
                    row.status === QuotationStatus.QUOTE) ||
                    (row.category === "CHARTER" &&
                      row.status === QuotationStatus.PROFOMA_INVOICE)) && (
                    <Button
                      variant="outlined"
                      onClick={() => onAddPassenger(row)}
                    >
                      Add Pax
                    </Button>
                  )}
                  {/* If pax details have been added (and the user is ready to finalize) */}
                  {row.status === QuotationStatus.PAX_ADDED && (
                    <Button
                      variant="outlined"
                      onClick={() => onGenerateSalesConfirmation(row)}
                    >
                      Generate SC
                    </Button>
                  )}
                  {row.status === QuotationStatus.SALE_CONFIRMED && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {QuotationStatus.SALE_CONFIRMED}
                    </span>
                  )}
                </TableCell>
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
        width="100%"
        maxWidth="md"
      >
        <QuotePreview
          htmlContent={previewData}
          currentId={selectedRowData?.id}
          currentQuotation={selectedRowData?.quotationNo}
          showEdit={selectedRowData?.isLatest}
          showGeneratePI={selectedRowData?.isLatest}
          onGenerateInvoice={onGenerateInvoice}
          currentRecord={currentQuotationInfo}
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

      <CustomDialog
        open={showPassengerDetail}
        onClose={() => setShowPassengerDetail(false)}
        title="Passenger Details"
        width="1200px"
        maxWidth="md"
      >
        {currentQuotationInfo && (
          <PassengerDetails
            logoColors={{ primary: "#0A58CA", accent: "#E11D48" }}
            quotation={currentQuotationInfo?.id}
            quotationNo={currentQuotationInfo?.quotationNo}
            onSaveSector={handelSectorSave}
            onPreview={handelSaveAndPreview}
          />
        )}
      </CustomDialog>
    </>
  );
};

export default QuoteList;
