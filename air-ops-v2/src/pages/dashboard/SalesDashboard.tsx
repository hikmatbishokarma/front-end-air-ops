import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import { TRIP_CONFIRMATION } from "../../lib/graphql/queries/quote";
import TripConfirmationPreview from "../../components/trip-confirmation-preview";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from "moment";
const SalesDashboard = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [selectedTab, setSelectedTab] = useState("Quotes");

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const [filter, setFilter] = useState({
    ...(operatorId && {
      operatorId: { eq: operatorId },
    }),
  });
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

    console.log("statusFilter:::", statusFilter);

    const _filter = {
      ...filter,
      ...(statusFilter && statusFilter.length > 0 ? { or: statusFilter } : {}),
    };

    setFilter(_filter);
  };

  // const categories = ["Quote", "Invoice", "Cancelled", "Revenue"];

  const categories = [
    { status: [""], name: "Quotes" },
    { status: ["Proforma Invoice", "Tax Invoice"], name: "Invoices" },
    { status: ["Confirmed"], name: "Trip Confirmation" },
    { status: [""], name: "Reports" },
  ];

  const handelCreate = (selectedTab) => {
    // const redirectTo = selectedTab == "Quotes" ? "/quotes/create" : "";

    // navigate(redirectTo);

    if (selectedTab === "Quotes") {
      navigate("/quotes/create");
    } else if (selectedTab === "Invoices") {
      setOpenInvoiceDialog(true); // Open modal
    } else if (selectedTab === "Trip Confirmation") {
      setTripConfirmationOpen(true); // Open modal
    }
  };

  // const { control, handleSubmit, reset } = useForm({
  //   defaultValues: {
  //     type: "PROFORMA_INVOICE",
  //     quotationNo: "",
  //     proformaInvoiceNo: "",
  //   },
  // });

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

  // const onGenerateInvoice = ({ type, quotationNo, proformaInvoiceNo }) => {
  //   setOpenInvoiceDialog(false);
  //   if (type === "Proforma Invoice") {
  //     navigate(`/invoices/preview?quotationNo=${quotationNo}`);
  //   } else if (invoiceType === "Tax Invoice") {
  //     navigate(`/invoices/preview?piNo=${proformaInvoiceNo}`);
  //   }
  //   reset(); // reset form after submission
  // };

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For the dropdown menu anchor
  const openDateMenu = Boolean(anchorEl);

  const [dateFilterType, setDateFilterType] = useState("anyDate"); // 'anyDate', 'today', 'yesterday', 'lastMonth', 'custom'
  const [customFromDate, setCustomFromDate] = useState(""); // Stores the input from custom date picker
  const [customToDate, setCustomToDate] = useState(""); // Stores the input from custom date picker

  const [activeFromDate, setActiveFromDate] = useState<string | null>(null); // Initialize with null
  const [activeToDate, setActiveToDate] = useState<string | null>(null); // Initialize with null

  // Helper functions for formatting dates to ISO string with start/end of day
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

  // Effect to calculate activeFromDate and activeToDate based on selectedDateFilterType or custom dates
  // This runs whenever `dateFilterType` or the `customFromDate`/`customToDate` inputs change.
  useEffect(() => {
    const today = new Date();
    // Helper to format Date objects to YYYY-MM-DD strings
    const formatDate = (date) => date.toISOString().split("T")[0];

    let from: string | null = null;
    let to: string | null = null;

    switch (dateFilterType) {
      case "today":
        // from = formatDate(today);
        // to = formatDate(today);
        from = formatStartOfDayISO(today);
        to = formatEndOfDayISO(today);
        break;
      case "yesterday":
        // const yesterday = new Date(today);
        // yesterday.setDate(today.getDate() - 1);
        // from = formatDate(yesterday);
        // to = formatDate(yesterday);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        from = formatStartOfDayISO(yesterday);
        to = formatEndOfDayISO(yesterday);
        break;
      case "lastWeek": // NEW CASE FOR LAST WEEK
        // const lastWeekStart = new Date(today);
        // lastWeekStart.setDate(today.getDate() - 7);
        // from = formatDate(lastWeekStart);
        // to = formatDate(today); // End date is today
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7); // Start of day 7 days ago
        from = formatStartOfDayISO(lastWeekStart);
        to = formatEndOfDayISO(today); // End of today
        break;
      case "lastMonth":
        // const firstDayOfLastMonth = new Date(
        //   today.getFullYear(),
        //   today.getMonth() - 1,
        //   1
        // );
        // const lastDayOfLastMonth = new Date(
        //   today.getFullYear(),
        //   today.getMonth(),
        //   0
        // );
        // from = formatDate(firstDayOfLastMonth);
        // to = formatDate(lastDayOfLastMonth);

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
        // // Use the dates from the custom picker inputs. If empty, default to today.
        // from = customFromDate || formatDate(today);
        // to = customToDate || formatDate(today);
        // When customFromDate/customToDate are YYYY-MM-DD from TextField
        if (customFromDate) {
          // Create date from YYYY-MM-DD string directly.
          // This creates a Date object in local timezone at 00:00.
          // setUTCHours converts it to UTC 00:00 or 23:59.
          from = formatStartOfDayISO(new Date(customFromDate));
        }
        if (customToDate) {
          to = formatEndOfDayISO(new Date(customToDate));
        }
        break;
      case "anyDate":
      default:
        from = ""; // No date filter applied
        to = ""; // No date filter applied
        break;
    }

    console.log("from", from, "to", to);
    setActiveFromDate(from);
    setActiveToDate(to);
    setFilter({
      ...filter,
      ...(from &&
        to && {
          createdAt: {
            between: {
              lower: from,
              upper: to,
            },
          },
        }),
    });
  }, [
    dateFilterType,
    customFromDate,
    customToDate,
    formatStartOfDayISO,
    formatEndOfDayISO,
  ]);

  // --- Date Filter Dropdown Handlers ---
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateFilterSelect = (type: string) => {
    setDateFilterType(type);

    // Reset custom dates if not using custom range
    if (type !== "custom") {
      setCustomFromDate("");
      setCustomToDate("");
    }

    handleMenuClose(); // Close menu after selection
    // If 'custom' is selected, the custom date inputs will become relevant,
    // and the useEffect will pick up their values to set activeFrom/ToDate.
  };

  const handleCustomDateChange = (type: "from" | "to", value: string) => {
    setCustomFromDate((prev) => (type === "from" ? value : prev));
    setCustomToDate((prev) => (type === "to" ? value : prev));
    // Important: Do NOT set dateFilterType here. It will be set when the user clicks 'Apply Custom'
    // This allows them to type in dates without immediately triggering a filter.
  };

  // Determines the text to display on the date filter button
  const currentFilterText = (() => {
    switch (dateFilterType) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "lastWeek":
        return "Last Week"; // NEW TEXT FOR BUTTON
      case "lastMonth":
        return "Last Month";
      case "custom":
        if (customFromDate && customToDate) {
          return `${customFromDate} - ${customToDate}`;
        }
        return "Custom Date"; // Default text if custom is selected but dates aren't picked
      case "anyDate":
      default:
        return "Any Date";
    }
  })();

  useEffect(() => {
    fethSalesDashboardData({ activeFromDate, activeToDate });
  }, [activeFromDate, activeToDate]);

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

      <Box sx={{ p: 2 }}>
        {/* Date Filter Dropdown */}
        <Box
          sx={{
            mb: 2,
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap", // makes it responsive
            gap: 2, // spacing between items
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography>Filter:</Typography>
          <Button
            id="date-filter-button"
            aria-controls={openDateMenu ? "date-filter-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openDateMenu ? "true" : undefined}
            onClick={handleMenuClick}
            variant="outlined"
            sx={{
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
            }}
          >
            <CalendarTodayIcon fontSize="small" />
            <span>{currentFilterText}</span>
            <ArrowDropDownIcon fontSize="small" />
          </Button>
          <Menu
            id="date-filter-menu"
            anchorEl={anchorEl}
            open={openDateMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "date-filter-button",
              sx: {
                p: 1, // Adds padding around the menu items
              },
            }}
          >
            {/* <MenuItem onClick={() => handleDateFilterSelect("anyDate")}>
              Any Date
            </MenuItem> */}
            {/* Custom Date Range Inputs - rendered directly in the menu or conditionally */}
            <MenuItem>
              {" "}
              {/* This MenuItem acts as a container for inputs */}
              <Box
                sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  {" "}
                  {/* <<< This Box is the flex container */}
                  <TextField
                    type="date"
                    label="From"
                    size="small"
                    value={customFromDate}
                    onChange={(e) =>
                      handleCustomDateChange("from", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: moment().format("YYYY-MM-DD") }}
                    sx={{ flex: 1 }} // Each TextField takes equal width horizontally
                  />
                  <TextField
                    type="date"
                    label="To"
                    size="small"
                    value={customToDate}
                    onChange={(e) =>
                      handleCustomDateChange("to", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: moment().format("YYYY-MM-DD") }}
                    sx={{ flex: 1 }} // Each TextField takes equal width horizontally
                  />
                </Box>
                {/* Apply Button is below the horizontal date inputs */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleDateFilterSelect("custom")}
                  disabled={!customFromDate || !customToDate}
                  sx={{ mt: 1 }}
                >
                  Apply
                </Button>
              </Box>
            </MenuItem>
            <Divider /> {/* Separator */}
            <MenuItem
              onClick={() => handleDateFilterSelect("today")}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 1.5, // Adds rounded corners (equivalent to 4px)
                my: 1, // Adds margin between items
                backgroundColor:
                  dateFilterType === "today" ? "#e3f2fd" : "#fff", // Light blue on select
                color: dateFilterType === "today" ? "#1976d2" : "inherit", // Blue text if selected
                fontWeight: dateFilterType === "today" ? 600 : "normal", // Slight emphasis
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Light gray on hover
                },
              }}
              selected={dateFilterType === "today"}
            >
              Today
            </MenuItem>
            <MenuItem
              onClick={() => handleDateFilterSelect("yesterday")}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 1.5, // Adds rounded corners (equivalent to 4px)
                my: 1, // Adds margin between items
                backgroundColor:
                  dateFilterType === "yesterday" ? "#e3f2fd" : "#fff", // Light blue on select
                color: dateFilterType === "yesterday" ? "#1976d2" : "inherit", // Blue text if selected
                fontWeight: dateFilterType === "yesterday" ? 600 : "normal", // Slight emphasis
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Light gray on hover
                },
              }}
              selected={dateFilterType === "yesterday"}
            >
              Yesterday
            </MenuItem>
            <MenuItem
              onClick={() => handleDateFilterSelect("lastWeek")}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 1.5, // Adds rounded corners (equivalent to 4px)
                my: 1, // Adds margin between items
                backgroundColor:
                  dateFilterType === "lastWeek" ? "#e3f2fd" : "#fff", // Light blue on select
                color: dateFilterType === "lastWeek" ? "#1976d2" : "inherit", // Blue text if selected
                fontWeight: dateFilterType === "lastWeek" ? 600 : "normal", // Slight emphasis
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Light gray on hover
                },
              }}
              selected={dateFilterType === "lastWeek"}
            >
              Last Week
            </MenuItem>
            <MenuItem
              onClick={() => handleDateFilterSelect("lastMonth")}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 1.5, // Adds rounded corners (equivalent to 4px)
                my: 1, // Adds margin between items
                backgroundColor:
                  dateFilterType === "lastMonth" ? "#e3f2fd" : "#fff", // Light blue on select
                color: dateFilterType === "lastMonth" ? "#1976d2" : "inherit", // Blue text if selected
                fontWeight: dateFilterType === "lastMonth" ? 600 : "normal", // Slight emphasis
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Light gray on hover
                },
              }}
              selected={dateFilterType === "lastMonth"}
            >
              Last Month
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Quotes", "Invoices", "Trip Confirmation"]}
      />
      {(selectedTab == "Quotes" || selectedTab == "Trip Confirmation") && (
        <QuoteList filter={filter} isGenerated={isTripConfirmed} />
      )}
      {selectedTab == "Invoices" && (
        <InvoiceList filter={filter} isGenerated={isInvoiceGenerated} />
      )}

      <Dialog
        open={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Invoice Preview</DialogTitle>

        <DialogContent>
          <InvoicePreview
            htmlContent={invoiceData?.template}
            currentQuotation={invoiceData?.quotationNo}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowInvoicePreview(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showTripConfirmationPreview}
        onClose={() => setShowTripConfirmationPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Trip Confirmation Preview</DialogTitle>

        <DialogContent>
          <TripConfirmationPreview
            htmlContent={tripConfirmationData?.confirmationTemplate}
            currentQuotation={tripConfirmationData?.quotationNo}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowTripConfirmationPreview(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesDashboard;
