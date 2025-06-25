import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { useSession } from "../../SessionContext";
import { Controller, set, useForm, useWatch } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";
import { useSnackbar } from "../../SnackbarContext";
import InvoicePreview from "../../components/invoice-preview";
import InvoiceList from "../quote/invoice-list";
import { GET_QUOTES, TRIP_CONFIRMATION } from "../../lib/graphql/queries/quote";
import TripConfirmationPreview from "../../components/trip-confirmation-preview";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from "moment";
import { useQuoteData } from "../../hooks/useQuoteData";
import FilterPanel from "../quote/FilterPanel";
import { Iclient } from "../../interfaces/quote.interface";
import SearchIcon from "@mui/icons-material/Search";

const SalesDashboard = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const { clients } = useQuoteData();

  const [selectedTab, setSelectedTab] = useState("Quotes");
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const [filter, setFilter] = useState({});
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);

  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

  const [tripConfirmationOpen, setTripConfirmationOpen] = useState(false);

  const fethSalesDashboardData = async ({ activeFromDate, activeToDate }) => {
    try {
      const data = await useGql({
        query: GET_SALES_DASHBOARD,
        queryName: "getSalesDashboardData",
        queryType: "query-without-edge",
        variables: {
          range: "custom",
          operatorId: operatorId,
          ...(activeFromDate &&
            activeToDate && {
              startDate: activeFromDate,
              endDate: activeToDate,
            }),
        },
      });

      setSalesDashboardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handelFilter = (data) => {
    setSelectedTab(data.name);

    const statusFilter = data.status.map((s) => ({
      status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    }));

    if (data.name === "Invoices") {
      setFilter({
        ...(statusFilter && statusFilter.length > 0
          ? { or: statusFilter }
          : {}),
      });
    } else if (data.name === "Trip Confirmation") {
      setFilter({
        ...(statusFilter && statusFilter.length > 0
          ? { or: statusFilter }
          : {}),
      });
    } else if (data.name === "Reports") {
      setFilter({
        ...(statusFilter && statusFilter.length > 0
          ? { or: statusFilter }
          : {}),
      });
    }
    const _filter = {
      ...filter,
      ...(statusFilter && statusFilter.length > 0 ? { or: statusFilter } : {}),
    };

    setFilter(_filter);
  };

  const categories = [
    { status: [""], name: "Quotes", countLabel: "totalQuotations" },
    {
      status: ["Proforma Invoice", "Tax Invoice"],
      name: "Invoices",
      countLabel: "invoices",
    },
    {
      status: ["Confirmed"],
      name: "Trip Confirmation",
      countLabel: "tripConfirmations",
    },
    { status: [""], name: "Reports", countLabel: "reports" },
  ];

  const handelCreate = (selectedTab) => {
    if (selectedTab === "Quotes") {
      navigate("/quotes/create");
    } else if (selectedTab === "Invoices") {
      setOpenInvoiceDialog(true); // Open modal
    } else if (selectedTab === "Trip Confirmation") {
      setTripConfirmationOpen(true); // Open modal
    }
  };

  // For Trip Confirmation Dialog
  const {
    control: tripControl,
    handleSubmit: handleTripSubmit,
    reset: resetTripForm,
  } = useForm({
    defaultValues: {
      quotationNo: "",
    },
  });

  // For Proforma Invoice Dialog
  const {
    control: proformaControl,
    handleSubmit: handleProformaSubmit,
    reset: resetProformaForm,
  } = useForm({
    defaultValues: {
      type: "PROFORMA_INVOICE",
      quotationNo: "",
      proformaInvoiceNo: "",
    },
  });

  const invoiceType = useWatch({ control: proformaControl, name: "type" });

  const [invoiceData, setInvoicedata] = useState<any>(null);
  const [tripConfirmationData, setTripConfirmationData] = useState<any>(null);
  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [isTripConfirmed, setIsTripConfirmed] = useState(false);

  const onGenerateInvoice = async ({
    type,
    quotationNo,
    proformaInvoiceNo,
  }) => {
    setOpenInvoiceDialog(false);

    const result = await useGql({
      query: GENERATE_INVOICE,
      queryName: "generateInvoice",
      queryType: "mutation",
      variables: {
        args: {
          type,
          quotationNo,
          proformaInvoiceNo,
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
      setInvoicedata(result?.data?.generateInvoice);
      setShowInvoicePreview(true);
      setIsInvoiceGenerated(true);
    }
  };

  const handelTripConfirmation = async ({ quotationNo }) => {
    setTripConfirmationOpen(false);

    const result = await useGql({
      query: TRIP_CONFIRMATION,
      queryName: "tripConfirmation",
      queryType: "mutation",
      variables: {
        args: {
          quotationNo,
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
      setTripConfirmationData(result?.data?.tripConfirmation);
      setShowTripConfirmationPreview(true);
      setIsTripConfirmed(true);
    }
  };

  // --- DATE FILTER STATES ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDateMenu = Boolean(anchorEl);

  const [dateFilterType, setDateFilterType] = useState("anyDate");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  const [activeFromDate, setActiveFromDate] = useState<string | null>(null);
  const [activeToDate, setActiveToDate] = useState<string | null>(null);

  const formatStartOfDayISO = useCallback((date: Date): string => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0); // Set to start of UTC day
    return d.toISOString();
  }, []);

  const formatEndOfDayISO = useCallback((date: Date): string => {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999); // Set to end of UTC day
    return d.toISOString();
  }, []);

  // useEffect(() => {
  //   const today = new Date();
  //   // Helper to format Date objects to YYYY-MM-DD strings
  //   const formatDate = (date) => date.toISOString().split("T")[0];

  //   let from: string | null = null;
  //   let to: string | null = null;

  //   switch (dateFilterType) {
  //     case "today":
  //       from = formatStartOfDayISO(today);
  //       to = formatEndOfDayISO(today);
  //       break;
  //     case "yesterday":
  //       const yesterday = new Date(today);
  //       yesterday.setDate(today.getDate() - 1);
  //       from = formatStartOfDayISO(yesterday);
  //       to = formatEndOfDayISO(yesterday);
  //       break;
  //     case "lastWeek": // NEW CASE FOR LAST WEEK
  //       const lastWeekStart = new Date(today);
  //       lastWeekStart.setDate(today.getDate() - 7); // Start of day 7 days ago
  //       from = formatStartOfDayISO(lastWeekStart);
  //       to = formatEndOfDayISO(today); // End of today
  //       break;
  //     case "lastMonth":
  //       const firstDayOfLastMonth = new Date(
  //         today.getFullYear(),
  //         today.getMonth() - 1,
  //         1
  //       );
  //       const lastDayOfLastMonth = new Date(
  //         today.getFullYear(),
  //         today.getMonth(),
  //         0
  //       ); // Day 0 of current month is last day of previous
  //       from = formatStartOfDayISO(firstDayOfLastMonth);
  //       to = formatEndOfDayISO(lastDayOfLastMonth);
  //       break;
  //     case "custom":
  //       if (customFromDate) {
  //         from = formatStartOfDayISO(new Date(customFromDate));
  //       }
  //       if (customToDate) {
  //         to = formatEndOfDayISO(new Date(customToDate));
  //       }
  //       break;
  //     case "anyDate":
  //     default:
  //       from = "";
  //       to = "";
  //       break;
  //   }

  //   setActiveFromDate(from);
  //   setActiveToDate(to);
  //   setFilter({
  //     ...filter,
  //     ...(from &&
  //       to && {
  //         createdAt: {
  //           between: {
  //             lower: from,
  //             upper: to,
  //           },
  //         },
  //       }),
  //   });
  // }, [
  //   dateFilterType,
  //   customFromDate,
  //   customToDate,
  //   formatStartOfDayISO,
  //   formatEndOfDayISO,
  // ]);

  // --- Date Filter Dropdown Handlers ---
  // const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleDateFilterSelect = (type: string) => {
  //   setDateFilterType(type);

  //   // Reset custom dates if not using custom range
  //   if (type !== "custom") {
  //     setCustomFromDate("");
  //     setCustomToDate("");
  //   }

  //   handleMenuClose();
  // };

  // const handleCustomDateChange = (type: "from" | "to", value: string) => {
  //   setCustomFromDate((prev) => (type === "from" ? value : prev));
  //   setCustomToDate((prev) => (type === "to" ? value : prev));
  // };

  // // Determines the text to display on the date filter button
  // const currentFilterText = (() => {
  //   switch (dateFilterType) {
  //     case "today":
  //       return "Today";
  //     case "yesterday":
  //       return "Yesterday";
  //     case "lastWeek":
  //       return "Last Week"; // NEW TEXT FOR BUTTON
  //     case "lastMonth":
  //       return "Last Month";
  //     case "custom":
  //       if (customFromDate && customToDate) {
  //         return `${customFromDate} - ${customToDate}`;
  //       }
  //       return "Custom Date"; // Default text if custom is selected but dates aren't picked
  //     case "anyDate":
  //     default:
  //       return "Any Date";
  //   }
  // })();

  useEffect(() => {
    fethSalesDashboardData({ activeFromDate, activeToDate });
  }, [activeFromDate, activeToDate]);

  // const handelOnFilterApply = () => {
  //   if (activeFromDate && activeToDate) {
  //     fethSalesDashboardData({ activeFromDate, activeToDate });
  //   }
  // };

  /** new filter */
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<Iclient | null>();
  //const [anchorEl, setAnchorEl] = useState(null);

  const handleFilterOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const [searchTerm, setSearchTerm] = useState("");

  /** API CALL */

  const [quoteList, setQuoteList] = useState<any[]>([]);

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const getQuotes = async (customFilter?: any) => {
    const finalFilter = customFilter || {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,
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

      setTotalCount(data?.totalCount || 0);
      setQuoteList(result);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, [filter, selectedRequester, page, rowsPerPage, refreshKey]);

  const filteredRows = quoteList?.filter((row) =>
    row.quotationNo?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handelOnApply = () => {
    const today = new Date();
    // Helper to format Date objects to YYYY-MM-DD strings
    const formatDate = (date) => date.toISOString().split("T")[0];

    let from: string | null = null;
    let to: string | null = null;

    switch (dateFilterType) {
      case "today":
        from = formatStartOfDayISO(today);
        to = formatEndOfDayISO(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        from = formatStartOfDayISO(yesterday);
        to = formatEndOfDayISO(yesterday);
        break;
      case "lastWeek": // NEW CASE FOR LAST WEEK
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7); // Start of day 7 days ago
        from = formatStartOfDayISO(lastWeekStart);
        to = formatEndOfDayISO(today); // End of today
        break;
      case "lastMonth":
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ); // Day 0 of current month is last day of previous
        from = formatStartOfDayISO(firstDayOfLastMonth);
        to = formatEndOfDayISO(lastDayOfLastMonth);
        break;
      case "custom":
        if (customFromDate) {
          from = formatStartOfDayISO(new Date(customFromDate));
        }
        if (customToDate) {
          to = formatEndOfDayISO(new Date(customToDate));
        }
        break;
      case "anyDate":
      default:
        from = "";
        to = "";
        break;
    }

    if (dateFilterType !== "custom") {
      setCustomFromDate("");
      setCustomToDate("");
    }

    setActiveFromDate(from);
    setActiveToDate(to);

    const newFilter = {
      ...(selectedRequester?.id && {
        requestedBy: { eq: selectedRequester.id },
      }),
      ...(operatorId && { operatorId: { eq: operatorId } }),
      ...(from &&
        to && {
          createdAt: {
            between: {
              lower: from,
              upper: to,
            },
          },
        }),
    };

    setFilter(newFilter);
    getQuotes(newFilter); // pass filter directly
  };

  return (
    <>
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
      >
        <DialogTitle>
          Generate Invoice
          <IconButton
            aria-label="close"
            onClick={() => setOpenInvoiceDialog(false)}
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
          <form onSubmit={handleProformaSubmit(onGenerateInvoice)}>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel>Select Invoice Type</FormLabel>
              <Controller
                control={proformaControl}
                name="type"
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="PROFORMA_INVOICE"
                      control={<Radio />}
                      label="Proforma Invoice"
                    />
                    <FormControlLabel
                      value="TAX_INVOICE"
                      control={<Radio />}
                      label="Tax Invoice"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {invoiceType === "PROFORMA_INVOICE" && (
              <Controller
                name="quotationNo"
                control={proformaControl}
                rules={{ required: "Quotation No is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Quotation No"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            )}

            {invoiceType === "TAX_INVOICE" && (
              <Controller
                name="proformaInvoiceNo"
                control={proformaControl}
                rules={{ required: "Proforma Invoice No is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Proforma Invoice No"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            )}

            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={tripConfirmationOpen}
        onClose={() => setTripConfirmationOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "600px", // or 768px, 800px – adjust as you like
            maxWidth: "80%", // responsive fallback
          },
        }}
      >
        <DialogTitle>
          Trip Confirmation
          <IconButton
            aria-label="close"
            onClick={() => setTripConfirmationOpen(false)}
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
        {/* <DialogContent>
          <form onSubmit={handleTripSubmit(handelTripConfirmation)}>
            <Controller
              name="quotationNo"
              control={tripControl}
              rules={{ required: "Quotation No is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Quotation No"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </form>
        </DialogContent> */}
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleTripSubmit(handelTripConfirmation)}
            sx={{ width: "80%" }}
          >
            <Controller
              name="quotationNo"
              control={tripControl}
              rules={{ required: "Quotation No is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Quotation No"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Quotes", "Invoices", "Trip Confirmation"]}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mt: 4,
          mb: 2,
          px: 2,
          py: 1,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ flex: "1 1 auto", maxWidth: 300 }}>
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
        </Box>

        <Button variant="outlined" onClick={handleFilterOpen}>
          Filter
        </Button>
      </Box>

      {(selectedTab == "Quotes" || selectedTab == "Trip Confirmation") && (
        <Box mt={1}>
          <QuoteList
            filter={filter}
            isGenerated={isTripConfirmed}
            setSelectedTab={setSelectedTab}
            refreshKey={refreshKey}
            setRefreshKey={() => setRefreshKey(Date.now())}
            setFilter={setFilter}
            setShowInvoicePreview={setShowInvoicePreview}
            setInvoicedata={setInvoicedata}
            quoteList={filteredRows}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Box>
      )}
      {selectedTab == "Invoices" && (
        <InvoiceList
          filter={filter}
          isGenerated={isInvoiceGenerated}
          setSelectedTab={setSelectedTab}
          refreshKey={refreshKey}
          setRefreshKey={() => setRefreshKey(Date.now())}
          setFilter={setFilter}
          setShowTripConfirmationPreview={setShowTripConfirmationPreview}
          setTripConfirmationData={setTripConfirmationData}
        />
      )}

      <Dialog
        open={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {" "}
          Invoice Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowInvoicePreview(false)}
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
          <InvoicePreview
            htmlContent={invoiceData?.template}
            currentQuotation={invoiceData?.quotationNo}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button
            onClick={() => setShowInvoicePreview(false)}
            color="secondary"
          >
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
            htmlContent={tripConfirmationData?.confirmationTemplate}
            currentQuotation={tripConfirmationData?.quotationNo}
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

      <FilterPanel
        open={openFilter}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        dateFilterType={dateFilterType}
        onDateFilterChange={setDateFilterType}
        fromDate={customFromDate ? moment(customFromDate) : null}
        toDate={customToDate ? moment(customToDate) : null}
        // onFromDateChange={(date) =>
        //   setCustomFromDate(date ? date.format("YYYY-MM-DD") : "")
        // }

        onFromDateChange={(date) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomFromDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomFromDate("");
          }
        }}
        // onToDateChange={(date) =>
        //   setCustomToDate(date ? date.format("YYYY-MM-DD") : "")
        // }

        onToDateChange={(date) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomToDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomToDate("");
          }
        }}
        requester={selectedRequester}
        onRequesterChange={setSelectedRequester}
        clients={clients}
        onApply={() => {
          // your apply logic
          handelOnApply();
          handleFilterClose();
        }}
        onReset={() => {
          setDateFilterType("anyDate");
          setCustomFromDate("");
          setCustomToDate("");
          setSelectedRequester(null);
        }}
      />
    </>
  );
};

export default SalesDashboard;
