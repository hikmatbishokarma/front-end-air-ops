import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";

import moment from "moment";
import { useLocation, useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useQuoteSummaryData } from "@/features/quotes/hooks/useQuoteSummaryData";
import { useQuoteData } from "@/features/quotes/hooks/useQuoteData";
import { useSession } from "@/app/providers";
import { Iclient } from "@/features/quotes/types/interfaces";
import DashboardBoardSection from "@/components/DashboardBoardSection";
import {
  getEnumKeyByValue,
  QuotationStatus,
  SalesCategoryLabels,
} from "@/shared/utils";
import QuoteList from "@/features/quotes/pages/List";
import { CustomDialog } from "@/components/CustomeDialog";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import SaleConfirmationPreview from "@/features/quotes/components/SaleConfirmationPreview";
import FilterPanel from "@/features/quotes/components/FilterPanel";
import InvoiceList from "@/features/invoices/pages/List";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { IStatCard } from "@/shared/types/common";
import { QuoteFilter } from "@/features/quotes/types/interfaces";
import StatCard from "@/components/DashboardBoardSection";

export const singularMap = {
  Quotes: "Quote",
  Invoices: "Invoice",
  tripconfirmation: "Sale Confirmation",
};

// Defines the expected payload when clicking a summary card in DashboardBoardSection

const QuoteControllerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients } = useQuoteData();
  const [selectedTab, setSelectedTab] = useState("Quotes");
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;
  const [filter, setFilter] = useState<QuoteFilter>({});
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [saleConfirmationData, setSaleConfirmationData] = useState<any>(null);
  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [isTripConfirmed, setIsTripConfirmed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATE FILTER STATES ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** new filter */
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<Iclient | null>();

  const statCards = [
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

  const { summaryData, loading: loadingDashboard } = useQuoteSummaryData(
    filter,
    refreshKey
  );

  const handleStatCardSelect = (data: IStatCard) => {
    setSelectedTab(data.name);

    const statusFilter = data.status.map((s) => ({
      status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    }));

    setFilter({
      ...(statusFilter.length ? { or: statusFilter } : {}),
    });
  };

  const handelCreate = (selectedTab: string) => {
    if (selectedTab === "Quotes") {
      navigate("/app/quotes/create");
    }
    // else if (selectedTab === "Invoices") {

    //   setOpenInvoiceDialog(true); // Open modal
    // } else if (selectedTab === "Sale Confirmation") {
    //   setTripConfirmationOpen(true); // Open modal
    // }
  };

  const handleFilterOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  // Use the dedicated date filter hook
  const {
    dateFilterType,
    setDateFilterType,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    getCalculatedDateFilter,
    resetDateFilter,
  } = useDateRangeFilter();

  const handelOnApplyFilter = useCallback(() => {
    const { from, to } = getCalculatedDateFilter();

    const newFilter: QuoteFilter = {
      ...(selectedRequester?.id && {
        requestedBy: { eq: selectedRequester.id },
      }),
      ...(operatorId && { operatorId: { eq: operatorId } }),
      ...(searchTerm && { quotationNo: { iLike: searchTerm } }),
      ...(from && to && { createdAt: { between: { lower: from, upper: to } } }),
    };

    setFilter(newFilter);
  }, [selectedRequester, operatorId, searchTerm, getCalculatedDateFilter]);

  useEffect(() => {
    setRefreshKey(Date.now());
  }, [filter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        ...(searchTerm ? { quotationNo: { iLike: searchTerm } } : {}),
      }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <>
      <StatCard
        selectedTab={selectedTab}
        categories={statCards}
        statData={summaryData}
        onCreate={handelCreate}
        handleStatCardSelect={handleStatCardSelect}
        singularMap={singularMap}
        createEnabledTabs={["Quotes"]}
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
            setInvoiceData={setInvoiceData}
            // quoteList={filteredRows}
            // totalCount={totalCount}
            // rowsPerPage={rowsPerPage}
            // page={page}
            // setPage={setPage}
            // setRowsPerPage={setRowsPerPage}
            selectedTab={selectedTab}
          />
        </Box>
      )}
      {selectedTab == SalesCategoryLabels.INVOICES && (
        <InvoiceList
          filter={filter}
          isGenerated={false}
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

        onFromDateChange={(date: any) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomFromDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomFromDate("");
          }
        }}
        onToDateChange={(date: any) => {
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
          handelOnApplyFilter();
          handleFilterClose();
        }}
        onReset={() => {
          resetDateFilter(); // Resets date state inside the hook
          setSelectedRequester(null);
          setFilter({}); // Reset the global filter object
          setRefreshKey(Date.now()); // Force refresh
        }}
      />
    </>
  );
};

export default QuoteControllerPage;
