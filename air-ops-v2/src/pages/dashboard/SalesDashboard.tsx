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
import {
  getEnumKeyByValue,
  QuotationStatus,
  SalesCategoryLabels,
} from "../../lib/utils";
import { useLocation, useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { useSession } from "../../SessionContext";
import { Controller, set, useForm, useWatch } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";
import { useSnackbar } from "../../SnackbarContext";
import InvoicePreview from "../../components/invoice-preview";
import InvoiceList from "../quote/invoice-list";
import { GET_QUOTES, SALE_CONFIRMATION } from "../../lib/graphql/queries/quote";
import SaleConfirmationPreview from "../../components/SaleConfirmationPreview";

import moment from "moment";
import { CustomDialog } from "../../components/CustomeDialog";
import { useQuoteData } from "../../hooks/useQuoteData";
import FilterPanel from "../quote/FilterPanel";
import { Iclient } from "../../interfaces/quote.interface";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

const SalesDashboard = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const location = useLocation();

  const { clients } = useQuoteData();

  const [selectedTab, setSelectedTab] = useState("Quotes");
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

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
    } else if (data.name === "Sale Confirmation") {
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
    {
      status: [""],
      name: SalesCategoryLabels.QUOTES,
      countLabel: "totalQuotations",
    },
    {
      status: [QuotationStatus.PROFOMA_INVOICE, QuotationStatus.TAX_INVOICE],
      name: SalesCategoryLabels.INVOICES,
      countLabel: "invoices",
    },
    {
      status: [QuotationStatus.SALE_CONFIRMED],
      name: SalesCategoryLabels.SALE_CONFIRMATION,
      countLabel: "saleConfirmations",
    },
    { status: [""], name: SalesCategoryLabels.REPORTS, countLabel: "reports" },
  ];

  const handelCreate = (selectedTab) => {
    if (selectedTab === "Quotes") {
      navigate("/quotes/create");
    } else if (selectedTab === "Invoices") {
      setOpenInvoiceDialog(true); // Open modal
    } else if (selectedTab === "Sale Confirmation") {
      setTripConfirmationOpen(true); // Open modal
    }
  };

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
  const [saleConfirmationData, setSaleConfirmationData] = useState<any>(null);
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
      query: SALE_CONFIRMATION,
      queryName: "saleConfirmation",
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
      setSaleConfirmationData(result?.data?.saleConfirmation);
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

  useEffect(() => {
    fethSalesDashboardData({ activeFromDate, activeToDate });
  }, [activeFromDate, activeToDate]);

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

  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey(Date.now()); // forces getQuotes to re-run
      // optional: clear the refresh flag so it doesn't trigger again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <>
      <CustomDialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        title="Generate Invoice"
      >
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
        </form>
      </CustomDialog>

      <CustomDialog
        open={tripConfirmationOpen}
        onClose={() => setTripConfirmationOpen(false)}
        title="Sale Confirmation"
      >
        <Box
          component="form"
          onSubmit={handleTripSubmit(handelTripConfirmation)}
          sx={{ width: "100%" }}
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
      </CustomDialog>

      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Quotes", "Invoices", "Sale Confirmation"]}
      />

      <Box
        className="search_quo1"
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

        <Button
          variant="outlined"
          onClick={handleFilterOpen}
          className="filter-date-range"
        >
          <FilterAltOutlinedIcon />
        </Button>
      </Box>

      {(selectedTab == SalesCategoryLabels.QUOTES ||
        selectedTab == SalesCategoryLabels.SALE_CONFIRMATION) && (
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
            selectedTab={selectedTab}
          />
        </Box>
      )}
      {selectedTab == SalesCategoryLabels.INVOICES && (
        <InvoiceList
          filter={filter}
          isGenerated={isInvoiceGenerated}
          setSelectedTab={setSelectedTab}
          refreshKey={refreshKey}
          setRefreshKey={() => setRefreshKey(Date.now())}
          setFilter={setFilter}
          setShowTripConfirmationPreview={setShowTripConfirmationPreview}
          setSaleConfirmationData={setSaleConfirmationData}
        />
      )}

      <CustomDialog
        open={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        title="Invoice Preview"
        width="900px"
        maxWidth="md"
      >
        <InvoicePreview
          htmlContent={invoiceData?.template}
          currentQuotation={invoiceData?.quotationNo}
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
          htmlContent={saleConfirmationData?.confirmationTemplate}
          currentQuotation={saleConfirmationData?.quotationNo}
        />
      </CustomDialog>

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
