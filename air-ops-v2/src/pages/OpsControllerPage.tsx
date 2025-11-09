import React, { useCallback, useEffect, useMemo, useState } from "react";

import StatCard from "@/components/DashboardBoardSection";
import { IStatCard } from "@/shared/types/common";
import { useNavigate } from "react-router";
import { useSession } from "@/app/providers";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SalesConfirmationList from "@/features/ops/tables/SalesConfirmation";
import TripDetailList from "@/features/ops/tables/TripDetail";
import ReusableFilterPanel from "@/components/ReusableFilterPanel";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import moment from "moment";
import { SalesCategoryLabels } from "@/shared/utils";
import { IBaseFilter, useAppFilter } from "@/hooks/useAppFilter";
import CrewTripList from "@/features/ops/tables/CrewTrip";

const OpsControllerPage = () => {
  const { session } = useSession();

  const [refreshKey, setRefreshKey] = useState(Date.now());

  const operatorId = session?.user.operator?.id || null;

  const [selectedTab, setSelectedTab] = useState("Sale Confirmation");

  const handleStatCardSelect = (data: IStatCard) => {
    setSelectedTab(data.name);

    // const statusFilter = data.status.map((s) => ({
    //   status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    // }));

    // const _filter = {
    //   // isLatest: { is: true },
    //   or: statusFilter,
    // };
  };

  // 1. Define the mandatory status filter for Ops "Sale Confirmation"
  const SALE_CONFIRMATION_BASE_FILTER = {
    or: [
      { status: { eq: "SALE_CONFIRMED" } },
      { status: { eq: "TRIP_GENERATED" } },
    ],
  };

  const statCards = [
    {
      status: ["SALE_CONFIRMED", "TRIP_GENERATED"],
      name: SalesCategoryLabels.SALE_CONFIRMATION,
      countLabel: "saleConfirmations",
    },

    {
      status: ["DRAFT", "PUBLISHED"],
      name: "Trip Details",
      countLabel: "tripDetails",
    },
    {
      status: [""],
      name: "Crew Trips Doc",
      countLabel: "crewTripsDoc",
    },
    { status: [""], name: SalesCategoryLabels.REPORTS, countLabel: "reports" },
  ];

  // --- State for the filter passed to the data layer ---
  const [finalGqlFilter, setFinalGqlFilter] = useState<IBaseFilter>({});

  // --- STABLE FILTER MERGE FUNCTION (The core fix) ---
  const handleFilterChange = useCallback(
    (newBaseFilter: IBaseFilter) => {
      // 1. Map the generic properties from the hook's output
      const { searchTermValue, ...rest } = newBaseFilter;

      // 2. Map the generic searchTermValue to the specific GQL field (quotationNo)
      const searchFilter = searchTermValue
        ? { quotationNo: { eq: searchTermValue } }
        : {};

      const mergedFilter = {
        ...rest, // Contains date filter (createdAt)
        ...searchFilter,
      };

      // 3. Update the final state, breaking the useEffect loop
      setFinalGqlFilter(mergedFilter);
    },
    [setFinalGqlFilter]
  );

  // 2. Use the minimal hook
  const {
    filter: baseFilter, // Renaming to baseFilter for clarity
    searchTerm,
    setSearchTerm,
    handleFilterOpen,
    filterAnchorEl,
    handleFilterClose,
    dateFilterType,
    setDateFilterType,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    handelOnApply,
    handelOnReset,
    openFilter,
  } = useAppFilter<IBaseFilter>(
    {},
    handleFilterChange // The hook updates the final GQL filter state
  );

  //   // 3. EFFECT: When the base filter or department state changes, MERGE them.
  //   useEffect(() => {
  //     const { searchTermValue, ...rest } = baseFilter;

  //     // 3a. Map the generic properties to the specific GQL field names
  //     const searchFilter = searchTermValue
  //       ? { quotationNo: { eq: searchTerm } }
  //       : {};

  //     const mergedFilter = {
  //       ...rest,
  //       ...searchFilter,
  //     };

  //     setFinalGqlFilter(mergedFilter);

  //     // Note: You might want to call your data fetching here or use a separate refreshKey state.
  //     // fetchData(mergedFilter);
  //   }, [baseFilter]);

  const saleConfirmationFilter = useMemo(() => {
    return {
      ...finalGqlFilter,
      ...SALE_CONFIRMATION_BASE_FILTER,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };
  }, [finalGqlFilter, operatorId]);

  const tripDetailsFilter = useMemo(() => {
    return {
      ...finalGqlFilter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };
  }, [finalGqlFilter, operatorId]);

  return (
    <>
      <StatCard
        selectedTab={selectedTab}
        categories={statCards}
        handleStatCardSelect={handleStatCardSelect}
        statData={{}}
        createEnabledTabs={[]}
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

      <Box mt={1}>
        {selectedTab == "Sale Confirmation" && (
          <SalesConfirmationList
            filter={saleConfirmationFilter}
            refreshKey={refreshKey}
          />
        )}
        {selectedTab == "Trip Details" && (
          <TripDetailList filter={tripDetailsFilter} refreshKey={refreshKey} />
        )}
        {selectedTab == "Crew Trips Doc" && (
          <CrewTripList filter={tripDetailsFilter} refreshKey={refreshKey} />
        )}
      </Box>

      <ReusableFilterPanel
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        title="Filter"
        showDateFilter
        dateFilterType={dateFilterType}
        onDateFilterChange={setDateFilterType}
        fromDate={customFromDate ? moment(customFromDate) : null}
        toDate={customToDate ? moment(customToDate) : null}
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
        onApply={() => {
          // your apply logic
          handelOnApply();
        }}
        onReset={() => {
          handelOnReset();
        }}
      >
        <></>
      </ReusableFilterPanel>
    </>
  );
};

export default OpsControllerPage;
