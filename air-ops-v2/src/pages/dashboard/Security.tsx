import React, { useCallback, useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import {
  DEPARTMENT_TYPES,
  getEnumKeyByValue,
  QuotationStatus,
  SECURITY_TYPES,
} from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { CrewDetailList } from "../crew-detail/List";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import { GET_CREW_DETAILS } from "../../lib/graphql/queries/crew-detail";
import { ManualList } from "../manual/List";
import AddIcon from "@mui/icons-material/Add";
import { GET_SECURITIES } from "../../lib/graphql/queries/security";
import { SecurityList } from "../security/List";
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
import DashboardTabs from "../../components/DashboardTab";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ReusableFilterPanel from "../../components/ReusableFilterPanel";
import moment from "moment";

const SecurityDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const [selectedTab, setSelectedTab] = useState("All");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const [selectedTab, setSelectedTab] = useState("Securities");
  const [searchTerm, setSearchTerm] = useState("");

  const [securityData, setSecurityData] = useState({
    totalCount: {},
    data: [],
  });

  const getSecurity = async () => {
    try {
      const result = await useGql({
        query: GET_SECURITIES,
        queryName: "securities",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
            ...(selectedTab &&
              selectedTab != "All" && { type: { eq: selectedTab } }),
            ...(searchTerm
              ? {
                  or: [
                    { name: { iLike: searchTerm } },
                    { department: { iLike: searchTerm } },
                  ],
                }
              : {}),
            ...(filter ? filter : {}),
          },
          paging: {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          sorting: [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Security!", "error");
      setSecurityData(result);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Security!", "error");
    }
  };

  const refreshList = async () => {
    // Fetch updated categories from API
    await getSecurity();
  };

  const [open, setOpen] = useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // --- DATE FILTER STATES ---
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>();

  const [dateFilterType, setDateFilterType] = useState("anyDate");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

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

  const handleFilterOpen = (e) => {
    setFilterAnchorEl(e.currentTarget);
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const handelOnApply = () => {
    const today = new Date();

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

    const newFilter = {
      ...(selectedDepartment && {
        department: { eq: selectedDepartment },
      }),

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
  };

  useEffect(() => {
    getSecurity();
  }, [selectedTab, searchTerm, filter]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <DashboardTabs
          tabsData={SECURITY_TYPES}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />
        {/* 
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, minWidth: "180px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
            Upload Document
          </Button>
        </Box> */}

        <Box
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
              Upload Document
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
          <SecurityList
            open={open}
            setOpen={setOpen}
            list={securityData.data}
            loading={loading}
            refreshList={refreshList}
          />
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
        onApply={() => {
          // your apply logic
          handelOnApply();
          handleFilterClose();
        }}
        onReset={() => {
          setDateFilterType("anyDate");
          setCustomFromDate("");
          setCustomToDate("");
          setSelectedDepartment("");
        }}
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

export default SecurityDashboard;
