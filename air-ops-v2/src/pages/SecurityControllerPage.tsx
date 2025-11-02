import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import moment from "moment";
import { IBaseFilter, useAppFilter } from "@/hooks/useAppFilter";
import { useSession } from "@/app/providers";
import DashboardTabs from "@/components/DashboardTab";
import { DEPARTMENT_TYPES, SECURITY_TYPES } from "@/shared/utils";
import { SecurityList } from "@/features/security";
import ReusableFilterPanel from "@/components/ReusableFilterPanel";

interface ISecurityFilter extends IBaseFilter {
  department?: { eq: string };
}

const SecurityControllerPage = () => {
  const { session, setSession } = useSession();

  const [selectedTab, setSelectedTab] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const [selectedDepartment, setSelectedDepartment] = useState<any>();

  // --- DATE FILTER STATES ---
  const [finalGqlFilter, setFinalGqlFilter] = useState<ISecurityFilter>({});

  // --- STABLE FILTER MERGE FUNCTION (The core fix) ---
  const handleFilterChange = useCallback(
    (newBaseFilter: IBaseFilter) => {
      // 1. Map the generic properties from the hook's output
      const { searchTermValue, ...rest } = newBaseFilter;

      // 2. Map the generic searchTermValue to the specific GQL field (quotationNo)
      const searchFilter = searchTermValue
        ? {
            or: [
              { name: { iLike: searchTerm } },
              { department: { iLike: searchTerm } },
            ],
          }
        : {};

      const departmentFilter = selectedDepartment
        ? { department: { eq: selectedDepartment } }
        : {};

      const mergedFilter = {
        ...rest, // Contains date filter (createdAt)
        ...searchFilter,
        ...departmentFilter,
      };

      // 3. Update the final state, breaking the useEffect loop
      setFinalGqlFilter(mergedFilter);
    },
    [setFinalGqlFilter, selectedDepartment]
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

  const handleFinalReset = useCallback(() => {
    setSelectedDepartment(""); // Reset local state
    handelOnReset(); // Reset hook state (date/search)
  }, [handelOnReset]);

  return (
    <>
      <h3>Security</h3>
      <Box sx={{ p: 3 }}>
        <DashboardTabs
          tabsData={SECURITY_TYPES}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />

        <Box
          className="security_filter_bar"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 300, mr: 2 }} // Removed flexGrow and added a right margin
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {" "}
            {/* New wrapper for buttons */}
            <Button
              variant="outlined"
              onClick={handleFilterOpen}
              className="filter-date-range"
            >
              <FilterAltOutlinedIcon />
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              color="primary"
            >
              Add Docs
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            Error: {error}
          </Typography>
        ) : (
          <SecurityList filter={finalGqlFilter} open={open} setOpen={setOpen} />
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
        onFromDateChange={(date: moment.Moment | null) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomFromDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomFromDate("");
          }
        }}
        onToDateChange={(date: moment.Moment | null) => {
          if (date) {
            if (dateFilterType !== "custom") {
              setDateFilterType("custom");
            }
            setCustomToDate(date.format("YYYY-MM-DD"));
          } else {
            setCustomToDate("");
          }
        }}
        onApply={handelOnApply}
        onReset={handleFinalReset} // 💡 Use the custom reset handler
      >
        <Typography variant="subtitle2" gutterBottom>
          Department
        </Typography>
        <Select
          fullWidth
          size="small"
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
          }}
          sx={{ mb: 3 }}
        >
          <MenuItem value="">All</MenuItem>
          {DEPARTMENT_TYPES.map((dept) => (
            <MenuItem key={dept.value} value={dept.value}>
              {dept.label}
            </MenuItem>
          ))}
        </Select>
      </ReusableFilterPanel>
    </>
  );
};

export default SecurityControllerPage;
