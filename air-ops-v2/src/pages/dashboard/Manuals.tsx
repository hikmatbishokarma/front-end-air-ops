import React, { useCallback, useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import {
  DEPARTMENT_TYPES,
  getEnumKeyByValue,
  QuotationStatus,
} from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { CrewDetailList } from "../crew-detail/List";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import { GET_CREW_DETAILS } from "../../lib/graphql/queries/crew-detail";
import { ManualList } from "../manual/List";
import { GET_MANUALS } from "../../lib/graphql/queries/manual";
import ReusableFilterPanel from "../../components/ReusableFilterPanel";
import moment from "moment";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";

const ManualDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;
  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

  const [selectedTab, setSelectedTab] = useState("Manuals");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [manualData, setManualData] = useState({ totalCount: {}, data: [] });
  const [loading, setLoading] = useState(false);
  const [crewSummary, setCrewSummary] = useState<any>({
    summary: {
      manuals: 0,
    },
  });

  const getManual = async () => {
    try {
      const result = await useGql({
        query: GET_MANUALS,
        queryName: "manuals",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
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

      if (!result.data) showSnackbar("Failed to fetch Manual!", "error");
      setManualData(result);
      setTotalCount(result.totalCount);
      setCrewSummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          manuals: result.totalCount,
        },
      }));
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Manual!", "error");
    }
  };

  // const handelFilter = (data) => {
  //   setSelectedTab(data.name);

  //   const statusFilter = data.status.map((s) => ({
  //     status: { eq: getEnumKeyByValue(QuotationStatus, s) },
  //   }));

  //   const _filter = {
  //     // isLatest: { is: true },
  //     or: statusFilter,
  //   };
  // };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // const handleFilterChange = (newFilters) => {
  //   setFilters(newFilters);
  // };

  const refreshList = async () => {
    // Fetch updated categories from API
    await getManual();
  };

  // const categories = [
  //   { status: [], name: "Manuals", countLabel: "manuals" },

  //   { status: [], name: "Reports", countLabel: "Reports" },
  // ];

  const [open, setOpen] = useState(false);

  // const handelCreate = (selectedTab) => {
  //   setOpen(true);
  // };

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

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
    getManual();
  }, [searchTerm, filter, page, rowsPerPage]);

  return (
    <>
      {/* <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={crewSummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Manuals"]}
      /> */}
      <h3>Manuals</h3>
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
            Add Docs
          </Button>
        </Box>
      </Box>

      <ManualList
        open={open}
        setOpen={setOpen}
        list={manualData.data}
        loading={loading}
        refreshList={refreshList}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

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

export default ManualDashboard;
