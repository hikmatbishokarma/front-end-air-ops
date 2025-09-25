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
  flightBlockTime,
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
  CHECK_FOR_PASSENGER,
  CREATE_PASSENGER_DETAILS,
  GET_PASSENGER_DETAIL_BY_ID,
  UPADTE_PASSANGER_DETAIL,
} from "../../lib/graphql/queries/passenger-detail";

import { Flight, AccessTime } from "@mui/icons-material";
import { InvoiceConfirmationModal } from "../../components/InvoiceConfirmationModel";

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

  const [invoiceModelOpen, setInvoiceModelOpen] = useState(false);

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

    console.log("invoiceee", result?.template, result);
    if (result?.errors?.length) {
      showSnackbar(
        result?.errors?.[0]?.message || "Internal server error!",
        "error"
      );
    } else {
      showSnackbar("Invoice Generated Successfully!", "success");
      setInvoicedata(result);
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

  const onGeneratePI = async (row) => {
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

  const onAddPassenger = async (row) => {
    setCurrentQuotationInfo({
      id: row.id,
      quotationNo: row.quotationNo,
      isLatest: row.isLatest,
      client: row.requestedBy,
      status: row.status,
    });

    const isPaxEsit = await isPassengerExist(row.quotationNo, row.id);

    if (isPaxEsit) {
      navigate(`/passenger-detail/${encodeURIComponent(row.quotationNo)}`);
      return;
    }

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
                // sectors: row.sectors.map((sector, index) => ({
                //   sectorNo: index + 1,
                //   source: sector.source,
                //   destination: sector.destination,
                //   depatureDate: sector.depatureDate,
                //   depatureTime: sector.depatureTime,
                //   arrivalTime: sector.arrivalTime,
                //   arrivalDate: sector.arrivalDate,
                //   pax: sector.paxNumber || 0,
                //   flightTime: calculateFlightTime(
                //     sector.depatureDate,
                //     sector.depatureTime,
                //     sector.arrivalDate,
                //     sector.arrivalTime
                //   ),
                // })),
                sectors: row.sectors.map((sector, index) => {
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
                }),
              },
            },
          },
        });

        if (data?.errors) {
          // Use optional chaining for safer access
          throw new Error(data.errors[0]?.message || "Something went wrong.");
        } else {
          navigate(`/passenger-detail/${encodeURIComponent(row.quotationNo)}`);
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
      setSelectedRowData(rowData);
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
    navigate(`/sales-confirmation-preview/${quotationNo}`);
  };

  const isPassengerExist = async (quotationNo, quotationId) => {
    try {
      const result = await useGql({
        query: CHECK_FOR_PASSENGER,
        variables: {
          filter: {
            quotationNo: { eq: quotationNo },
            ...(quotationId ? { quotation: { eq: quotationId } } : {}),
          },
        },
        queryName: "passengerDetails",
        queryType: "query-with-count",
      });

      if (result?.errors?.length) {
        console.warn("Passenger check error:", result?.errors?.[0]?.message);
        return false; // don’t block creation if check fails
      }

      return Array.isArray(result?.data) && result?.data?.length > 0;
    } catch (error) {
      console.error("Error checking passenger existence:", error);
      return false; // fallback to create
    }
  };

  // const SectorCell = ({ sectors }: any) => {
  //   const [open, setOpen] = useState(false);

  //   if (!sectors || sectors.length === 0) return <Typography>N/A</Typography>;

  //   const start = sectors[0].source.code;
  //   const end = sectors[sectors.length - 1].destination.code;

  //   return (
  //     <>
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="flex-end"
  //         sx={{ cursor: "pointer", color: "#1976d2" }}
  //         onClick={() => setOpen(true)}
  //       >
  //         <Typography variant="body2">
  //           {start} → {end} | 👤 {sectors?.paxNumber || 0}
  //         </Typography>
  //       </Box>

  //       <Modal open={open} onClose={() => setOpen(false)}>
  //         <Box
  //           sx={{
  //             position: "absolute",
  //             top: "50%",
  //             left: "50%",
  //             transform: "translate(-50%, -50%)",
  //             bgcolor: "background.paper",
  //             boxShadow: 24,
  //             p: 2,
  //             borderRadius: 2,
  //             minWidth: 320,
  //             maxWidth: 500,
  //           }}
  //         >
  //           <FlightRouteCard sectors={sectors} />
  //         </Box>
  //       </Modal>
  //     </>
  //   );
  // };

  // const FlightRouteCard = ({ sectors }: any) => {
  //   return (
  //     <Card variant="outlined" sx={{ borderRadius: 2, p: 1 }}>
  //       <CardContent sx={{ p: 1 }}>
  //         {/* Sectors Timeline */}
  //         <Box display="flex" flexDirection="column" gap={1}>
  //           {sectors.map((s: any, i: number) => (
  //             <>
  //               <Box
  //                 key={i}
  //                 display="flex"
  //                 flexDirection="column"
  //                 sx={{
  //                   borderBottom:
  //                     i < sectors.length - 1 ? "1px dashed #ccc" : "none",
  //                   pb: 1,
  //                 }}
  //               >
  //                 <Typography variant="subtitle2">
  //                   {s.source.code} → {s.destination.code}
  //                 </Typography>
  //                 <Typography variant="body2" color="text.secondary">
  //                   {s.source.name} → {s.destination.name}
  //                 </Typography>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Dep: {s.departureDate} {s.departureTime} | Arr:{" "}
  //                   {s.arrivalDate} {s.arrivalTime}
  //                 </Typography>
  //               </Box>

  //               <Box display="flex" justifyContent="flex-end" mt={1}>
  //                 <Typography variant="caption">
  //                   👤 {s.paxNumber || 0}
  //                 </Typography>
  //               </Box>
  //             </>
  //           ))}
  //         </Box>
  //       </CardContent>
  //     </Card>
  //   );
  // };

  // const SectorTooltip = ({ sectors }: any) => {
  //   if (!sectors || sectors.length === 0) return <Typography>N/A</Typography>;

  //   const start = sectors?.[0]?.source?.code;
  //   const end = sectors[sectors.length - 1].destination.code;

  //   return (
  //     <Tooltip
  //       title={
  //         <Box>
  //           {sectors.map((s: any, i: number) => (
  //             <Box
  //               key={i}
  //               sx={{
  //                 mb: i < sectors.length - 1 ? 1 : 0,
  //                 p: 0.5,
  //                 borderBottom:
  //                   i < sectors.length - 1 ? "1px dashed #ccc" : "none",
  //               }}
  //             >
  //               {/* First line: Source - Block Time - Destination */}
  //               <Typography variant="body2" fontWeight={600}>
  //                 {s.source.code} → {s.destination.code}
  //               </Typography>

  //               {/* Second line: Departure → Arrival */}
  //               <Typography variant="body2" color="text.secondary">
  //                 {moment(s.departureDate).format("Do MMM")} {s.depatureTime} →{" "}
  //                 {moment(s.arrivalDate).format("Do MMM")} {s.arrivalTime}
  //               </Typography>

  //               {/* Pax per sector */}
  //               <Typography variant="caption" color="text.secondary">
  //                 👤 {s.pax || 0} Pax
  //               </Typography>
  //             </Box>
  //           ))}
  //         </Box>
  //       }
  //       arrow
  //       placement="top"
  //     >
  //       <Box sx={{ cursor: "pointer", color: "#1976d2" }}>
  //         <Typography variant="body2">
  //           {start} → {end} | {sectors?.length}
  //           {/* {sectors.reduce((acc, s) => acc + (s.pax || 0), 0)} */}
  //         </Typography>
  //       </Box>
  //     </Tooltip>
  //   );
  // };

  const StyledTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: "#fff",
      color: "#333",
      maxWidth: 970,
      borderRadius: 16,
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      padding: 0,
    },
  }));

  const SectorTooltip = ({ sectors }: any) => {
    if (!sectors || sectors.length === 0) return <Typography>N/A</Typography>;

    const start = sectors[0].source.code;
    const end = sectors[sectors.length - 1].destination.code;
    const totalPax = sectors.reduce(
      (acc: number, s: any) => acc + (s.paxNumber || 0),
      0
    );

    return (
      <StyledTooltip
        title={
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3, // adjust for smoother curve (e.g., 4, 6, or 8)
              minWidth: 400, // increase width
              maxWidth: 970, // optional max width
              overflow: "hidden", // ensures border-radius applies
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {sectors.map((s: any, i: number) => (
                <Box key={i} sx={{ mb: i < sectors.length - 1 ? 2 : 0 }}>
                  {/* Route row */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {/* Source */}
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {s.source.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.source.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {s.depatureTime}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {/* {moment(s.depatureDate).format("Do MMM, YYYY")} */}
                        {moment(s.depatureDate).format("dddd, MMM D")}
                      </Typography>
                    </Box>

                    {/* Flight icon */}
                    <Box textAlign="center" mx={2}>
                      <Flight
                        sx={{ fontSize: 20, transform: "rotate(90deg)" }}
                      />
                    </Box>

                    {/* Destination */}
                    <Box textAlign="right">
                      <Typography variant="h6" fontWeight={700}>
                        {s.destination.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.destination.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {s.arrivalTime}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {/* {moment(s.arrivalDate).format("Do MMM, YYYY")} */}
                        {moment(s.arrivalDate).format("dddd, MMM D")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pax + duration row */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      color="text.secondary"
                      // variant="caption"
                      sx={{
                        background: "#f0f0f0",
                        px: 1,
                        borderRadius: "6px",
                      }}
                    >
                      <AccessTime fontSize="small" />
                      <Typography variant="caption">
                        {flightBlockTime([s])}
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        background: "#f0f0f0",
                        px: 1,
                        borderRadius: "6px",
                      }}
                    >
                      👤 {s.paxNumber || 0} Pax
                    </Typography>
                  </Box>

                  {i < sectors.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        }
        arrow
        placement="top"
      >
        <Box sx={{ cursor: "pointer", color: "#1976d2" }}>
          <Typography variant="body2" fontWeight={600}>
            {start} → {end} | 👤 {totalPax} Pax
          </Typography>
        </Box>
      </StyledTooltip>
    );
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
                {/* <TableCell align="right">{row.itinerary}</TableCell> */}
                <TableCell
                  align="right"
                  // onClick={(event) => event.stopPropagation()}
                >
                  <SectorTooltip sectors={row.sectors} />
                </TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {row.category === "CHARTER" || row.category === "IN_HOUSE" ? (
                    <>
                      {/* If the quote is a charter AND it's a new quote */}
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
                      {/* If the quote is an in-house flight OR a charter where PI has been sent */}
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
                      {/* If pax details have been added (and the user is ready to finalize) */}
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
            onSaveSector={handelSectorSave}
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
