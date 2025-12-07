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
  Modal,
  Card,
  CardContent,
  Divider,
  styled,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "@/lib/graphql/gql";
import {
  GET_QUOTES,
  PREVIEW_SALES_CONFIRMATION,
  SALE_CONFIRMATION,
  SHOW_PREVIEW,
  UPDATE_QUOTE_STATUS,
} from "@/lib/graphql/queries/quote";

import { Outlet, useNavigate } from "react-router";

import { useSnackbar } from "@/app/providers";

import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../components/QuotePreview";

import {
  calculateFlightTime,
  flightBlockTime,
  FlightCategoryEnum,
  getEnumKeyByValue,
  QuotationStatus,
  QuotationStatusMap,
  SalesCategoryLabels,
} from "@/shared/utils";

import { useSession } from "@/app/providers";

import moment from "moment";
import SaleConfirmationPreview from "../components/SaleConfirmationPreview";

import { CustomDialog } from "@/components/CustomeDialog";
import PassengerDetails from "@/shared/components/passenger/passanger-detail";

import { InvoiceConfirmationModal } from "@/components/InvoiceConfirmationModel";
import SectorTooltip from "@/components/SectorTooltip";
import {
  usePassengerExistenceCheck,
  useQuoteListData,
  useQuotePreview,
} from "../hooks/useQuoteQueries";
import {
  useConfirmSale,
  useCreateInitialPassengerDetails,
  useUpdatePassengerDetails,
} from "../hooks/useQuoteMutations";
import { useGenerateInvoice } from "@/features/invoices/hooks/useInvoiceMutations";
import { QuoteFilter } from "@/features/quotes/types/interfaces";
import { Setter } from "@/shared/types/common";

type currentQuotationInfo = {
  id: string;
  quotationNo: string;
  status?: string;
  client: any;
  isLatest: boolean;
};

// 3. QuoteList Props Interface
interface QuoteListProps {
  // Data/Filter Management Props
  filter: QuoteFilter; // The current active filter object passed from the parent.
  refreshKey: number; // Value used to force data refetch inside the component's hook.
  setRefreshKey: () => void; // Function to trigger a data refresh.
  setFilter: Setter<QuoteFilter>; // Function to update the main filter object.

  // UI/Flow Control Props
  isGenerated?: boolean; // Optional flag, set to true by default, indicating a state change.
  setSelectedTab: Setter<string>; // Function to switch the active dashboard tab.
  selectedTab: string; // The currently selected dashboard tab name.

  // Invoice Preview Modal Handlers
  setShowInvoicePreview: Setter<boolean>; // Opens/closes the Invoice Preview modal.
  setInvoiceData: Setter<any | null>; // Sets the data/template for the Invoice Preview.
}

export const QuoteList = ({
  filter,
  isGenerated = true,
  setSelectedTab,
  refreshKey,
  setRefreshKey,
  setFilter,
  setShowInvoicePreview,
  setInvoiceData,

  selectedTab,
}: QuoteListProps) => {
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
    useState<string | null>(null);

  const [showPassengerDetail, setShowPassengerDetail] = useState(false);

  const [invoiceModelOpen, setInvoiceModelOpen] = useState(false);

  // 1. Pagination State (Owned by the list view)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 2. Data Fetching (Use the new hook)
  const {
    quoteList,
    totalCount,
    loading: isListLoading,
  } = useQuoteListData({
    filter,
    page,
    rowsPerPage,
    refreshKey,
  });

  // const handelPreview = async (row:any) => {
  //   setSelectedRowData(row);

  //   setCurrentQuotationInfo({
  //     id: row.id,
  //     quotationNo: row.quotationNo,
  //     isLatest: row.isLatest,
  //     client: row.requestedBy,
  //     status: row.status,
  //   });

  //   if (
  //     row.status == QuotationStatus.SALE_CONFIRMED &&
  //     selectedTab == SalesCategoryLabels.SALE_CONFIRMATION
  //   ) {
  //     setSaleConfirmationPreviewTemplate(row.confirmationTemplate);
  //     setShowTripConfirmationPreview(true);
  //   } else {
  //     const result = await useGql({
  //       query: SHOW_PREVIEW,
  //       queryName: "showPreview",
  //       queryType: "query-without-edge",
  //       variables: { quotationNo: row.quotationNo },
  //     });

  //     if (!result) {
  //       showSnackbar("Internal server error!", "error");
  //     }
  //     setPreviewData(result);
  //     setShowPreview(true);
  //   }
  // };

  const { fetchAndShowPreview } = useQuotePreview({
    setSaleConfirmationPreviewTemplate,
    setShowTripConfirmationPreview,
    setPreviewData,
    setShowPreview,
  });

  // The simplified component handler:
  const handelPreview = async (row: any) => {
    // 1. LOCAL UI STATE UPDATES (Stay in the component)
    setSelectedRowData(row);

    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });

    // 2. CALL BUSINESS LOGIC HOOK (Handles API, conditions, and dialog updates)
    await fetchAndShowPreview(row, selectedTab); // Pass the required local state (selectedTab)
  };

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

  // const onGenerateInvoice = async ({
  //   type,
  //   quotationNo,
  //   proformaInvoiceNo = "",
  // }) => {
  //   const result = await useGql({
  //     query: GENERATE_INVOICE,
  //     queryName: "generateInvoice",
  //     queryType: "mutation",
  //     variables: {
  //       args: {
  //         type,
  //         quotationNo,
  //         ...(proformaInvoiceNo && { proformaInvoiceNo }),
  //         ...(operatorId && { operatorId }),
  //       },
  //     },
  //   });

  //   console.log("invoiceee", result?.template, result);
  //   if (result?.errors?.length) {
  //     showSnackbar(
  //       result?.errors?.[0]?.message || "Internal server error!",
  //       "error"
  //     );
  //   } else {
  //     showSnackbar("Invoice Generated Successfully!", "success");
  //     setInvoicedata(result);
  //     setShowPreview(false);
  //     setShowInvoicePreview(true);
  //     setSelectedTab("Invoices");
  //     setRefreshKey();

  //     setFilter({
  //       "or": [
  //         {
  //           "status": {
  //             "eq": "PROFOMA_INVOICE",
  //           },
  //         },
  //         {
  //           "status": {
  //             "eq": "TAX_INVOICE",
  //           },
  //         },
  //       ],
  //     });
  //   }
  // };

  const { onGenerateInvoice } = useGenerateInvoice({
    setInvoiceData,
    setShowInvoicePreview,
    setSelectedTab,
    setFilter,
    setRefreshKey,
  });

  const onGeneratePI = async (row: any) => {
    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });
    setInvoiceModelOpen(true);

    // await onGenerateInvoice({
    //   type: "PROFORMA_INVOICE",
    //   quotationNo: rowData.quotationNo,
    // });
    setRefreshKey();
  };


  const handelSaveAndPreview = async (quotationNo: string) => {
    navigate(`/app/sales-confirmation-preview/${quotationNo}`);
  };



  const { isPassengerExist } = usePassengerExistenceCheck();
  const { createPassengerDetails } =
    useCreateInitialPassengerDetails(isPassengerExist);

  // The simplified component handler:
  const onAddPassenger = async (row: any) => {
    // 1. LOCAL UI STATE (Stays in component)
    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });

    // 2. CALL BUSINESS LOGIC HOOK (Handles check, mutation, navigation, snackbars)
    await createPassengerDetails(row);
  };

  const { updatePassengerDetails } = useUpdatePassengerDetails();

  const { confirmSale, loading: isConfirming } = useConfirmSale({
    setSaleConfirmationPreviewTemplate,
    setShowTripConfirmationPreview,
    setRefreshKey,
  });

  // 2. The handler in the component is now simplified:
  const onGenerateSalesConfirmation = async (rowData: any) => {
    // A. Handle the essential local UI state update
    setSelectedRowData(rowData);

    // B. Execute the business logic hook
    await confirmSale(rowData.quotationNo);
  };

  console.log("quoteList::::", quoteList);

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
            {quoteList?.map((row: any) => (
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
                  {
                    FlightCategoryEnum[
                    row.category as keyof typeof FlightCategoryEnum
                    ]
                  }
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row?.aircraft?.name} (${row?.aircraft?.code})`}
                </TableCell>

                <TableCell align="right">{row?.requester ?? "N/A"}</TableCell>
                {/* <TableCell align="right">{row.itinerary}</TableCell> */}
                <TableCell
                  align="right"
                // onClick={(event) => event.stopPropagation()}
                >
                  <SectorTooltip sectors={row.sectors} />
                </TableCell>

                <TableCell align="right">
                  {moment(row.createdAt).format("DD-MM-YYYY HH:mm")}
                </TableCell>
                {/* <TableCell onClick={(e) => e.stopPropagation()}>
                  
                  {row.category === "CHARTER" || row.category === "IN_HOUSE" ? (
                    <>

                      {row.category === "CHARTER" &&
                        row.status === QuotationStatus.QUOTE && (
                          <Button
                            className="generate_pi11"
                            variant="outlined"
                            onClick={() => onGeneratePI(row)}
                          >
                            Generate PI
                          </Button>
                        )}
                     
                      {((row.category !== "CHARTER" &&
                        row.status === QuotationStatus.QUOTE) ||
                        (row.category === "CHARTER" &&
                          row.status === QuotationStatus.PROFOMA_INVOICE)) && (
                        <Button
                          className="generate_pi11"
                          variant="outlined"
                          onClick={() => onAddPassenger(row)}
                        >
                          Add Pax
                        </Button>
                      )}
                     
                      {row.status === QuotationStatus.PAX_ADDED && (
                        <Button
                          className="generate_pi11"
                          variant="outlined"
                          onClick={() => onGenerateSalesConfirmation(row)}
                        >
                          Generate SC
                        </Button>
                      )}
                      {(row.status === QuotationStatus.SALE_CONFIRMED ||
                        row.status === QuotationStatus.TRIP_GENERATED) && (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          {row.status}
                        </span>
                      )}
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell> */}

                <TableCell onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const status = QuotationStatusMap[row.status] ?? row.status;

                    if (
                      row.category !== "CHARTER" &&
                      row.category !== "IN_HOUSE"
                    ) {
                      return "N/A";
                    }

                    // Generate PI button
                    if (
                      row.category === "CHARTER" &&
                      status === QuotationStatus.QUOTE
                    ) {
                      return (
                        <Button
                          className="generate_pi11"
                          variant="outlined"
                          onClick={() => onGeneratePI(row)}
                        >
                          Generate PI
                        </Button>
                      );
                    }

                    // Add Pax button
                    if (
                      (row.category !== "CHARTER" &&
                        status === QuotationStatus.QUOTE) ||
                      (row.category === "CHARTER" &&
                        status === QuotationStatus.PROFOMA_INVOICE)
                    ) {
                      return (
                        <Button
                          className="generate_pi11"
                          variant="outlined"
                          onClick={() => onAddPassenger(row)}
                        >
                          Add Pax
                        </Button>
                      );
                    }

                    // Generate SC button
                    if (status === QuotationStatus.PAX_ADDED) {
                      return (
                        <Button
                          className="generate_pi11"
                          variant="outlined"
                          onClick={() => onGenerateSalesConfirmation(row)}
                        >
                          Generate SC
                        </Button>
                      );
                    }

                    // Final statuses
                    if (
                      status === QuotationStatus.SALE_CONFIRMED ||
                      status === QuotationStatus.TRIP_GENERATED
                    ) {
                      return (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          {status}
                        </span>
                      );
                    }

                    return "N/A";
                  })()}
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
        width="950px"
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
            // onSaveSector={handelSectorSave}
            onSaveSector={updatePassengerDetails}
            onPreview={handelSaveAndPreview}
          />
        )}
      </CustomDialog>

      <InvoiceConfirmationModal
        open={invoiceModelOpen}
        handelInvoiceModelClose={() => setInvoiceModelOpen(false)}
        onGenerateInvoice={onGenerateInvoice}
        invoiceType={"PROFORMA_INVOICE"}
        currentRecord={currentQuotationInfo}
      />
    </>
  );
};

export default QuoteList;
