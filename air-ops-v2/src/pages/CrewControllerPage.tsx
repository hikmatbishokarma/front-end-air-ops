import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useCrewSummaryData } from "@/features/crew-detail";
import { useSession } from "@/app/providers";
import StatCard from "@/components/DashboardBoardSection";
import {
  CrewDetailList,
  StaffCertificationList,
  LeaveApprovalRequestTable,
} from "@/features/crew-detail";
import { IBaseFilter, useAppFilter } from "@/hooks/useAppFilter";
import ReusableFilterPanel from "@/components/ReusableFilterPanel";
import useGql from "@/lib/graphql/gql";
import { GET_STAFF_CERTIFICATION } from "@/lib/graphql/queries/crew-detail";
import { GET_LEAVES } from "@/lib/graphql/queries/leave";
import { useSnackbar } from "@/app/providers";

interface ICrewFilter extends IBaseFilter {
  department?: { eq: string };
}

const CrewControllerPage = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user.operator?.id || null;

  const [selectedTab, setSelectedTab] = useState("Staff");
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // For other tabs (Leaves, Renewals)
  const [staffCertificates, setStaffCertification] = useState<any>();
  const [leaveList, setLeaveList] = useState<any>({ data: [], totalCount: 0 });
  const [leavePage, setLeavePage] = useState(0);
  const [leavePageSize, setLeavePageSize] = useState(10);
  const [leaveFilters, setLeaveFilters] = useState({ type: "", status: "" });

  // --- DATE FILTER STATES ---
  const [finalGqlFilter, setFinalGqlFilter] = useState<ICrewFilter>({});
  const [selectedDepartment, setSelectedDepartment] = useState<any>();

  // --- STABLE FILTER MERGE FUNCTION ---
  const handleFilterChange = useCallback(
    (newBaseFilter: IBaseFilter) => {
      const { searchTermValue, ...rest } = newBaseFilter;

      const searchFilter = searchTermValue
        ? {
            or: [
              { fullName: { iLike: searchTermValue.iLike } },
              { displayName: { iLike: searchTermValue.iLike } },
              { email: { iLike: searchTermValue.iLike } },
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

      setFinalGqlFilter(mergedFilter);
    },
    [selectedDepartment]
  );

  // Use the minimal hook
  const {
    filter: baseFilter,
    searchTerm: hookSearchTerm,
    setSearchTerm: setHookSearchTerm,
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
  } = useAppFilter<IBaseFilter>({}, handleFilterChange);

  // Handle search input change
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      setHookSearchTerm(value);
    },
    [setHookSearchTerm]
  );

  // Update filter when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchFilter = searchTerm
        ? {
            or: [
              { fullName: { iLike: `%${searchTerm}%` } },
              { displayName: { iLike: `%${searchTerm}%` } },
              { email: { iLike: `%${searchTerm}%` } },
            ],
          }
        : {};

      const departmentFilter = selectedDepartment
        ? { department: { eq: selectedDepartment } }
        : {};

      const currentFilter = baseFilter || {};
      const { searchTermValue, ...rest } = currentFilter;

      const mergedFilter = {
        ...rest, // Contains date filter (createdAt)
        ...searchFilter,
        ...departmentFilter,
      };

      setFinalGqlFilter(mergedFilter);
    }, 400); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, selectedDepartment, baseFilter]);

  // Update filter when department changes
  const handleDepartmentChange = useCallback(
    (e: any) => {
      const newDepartment = e.target.value;
      setSelectedDepartment(newDepartment);
      handelOnApply();
    },
    [handelOnApply]
  );

  const handleFinalReset = useCallback(() => {
    setSelectedDepartment("");
    handelOnReset();
  }, [handelOnReset]);

  const statCards = [
    { status: [], name: "Staff", countLabel: "staff" },
    { status: [], name: "Leaves", countLabel: "leaves" },
    { status: [], name: "Renewals", countLabel: "renewals" },
    { status: [], name: "Reports", countLabel: "Reports" },
  ];

  const { summaryData, loading: loadingDashboard } = useCrewSummaryData(
    finalGqlFilter,
    refreshKey
  );

  const handleStatCardSelect = (data: any) => {
    setSelectedTab(data.name);
  };

  const handelCreate = (selectedTab: string) => {
    if (selectedTab === "Staff") {
      setOpen(true);
    }
  };

  // Fetch data for other tabs
  const getStaffCertifications = async () => {
    try {
      const result = await useGql({
        query: GET_STAFF_CERTIFICATION,
        queryName: "staffCertificates",
        queryType: "query-without-edge",
        variables: {
          args: {
            where: {
              ...(operatorId && { operatorId }),
            },
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Certification!", "error");
      setStaffCertification(result.data);
    } catch (error: any) {
      showSnackbar(error.message || "Failed to fetch Certification!", "error");
    }
  };

  const getLeaves = async () => {
    try {
      const result = await useGql({
        query: GET_LEAVES,
        queryName: "leaves",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(leaveFilters?.type &&
              leaveFilters?.type !== "ALL" && {
                type: { eq: leaveFilters.type },
              }),
            ...(leaveFilters?.status &&
              leaveFilters?.status !== "ALL" && {
                status: { eq: leaveFilters.status },
              }),
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Leaves!", "error");
      setLeaveList(result);
    } catch (error: any) {
      showSnackbar(error.message || "Failed to fetch Leaves!", "error");
    }
  };

  useEffect(() => {
    if (selectedTab === "Renewals") {
      getStaffCertifications();
    }
    if (selectedTab === "Leaves") {
      getLeaves();
    }
  }, [selectedTab, leaveFilters]);

  useEffect(() => {
    setRefreshKey(Date.now());
  }, [finalGqlFilter]);

  const refreshList = async () => {
    setRefreshKey(Date.now());
    if (selectedTab === "Renewals") {
      await getStaffCertifications();
    }
    if (selectedTab === "Leaves") {
      await getLeaves();
    }
  };

  return (
    <>
      <StatCard
        selectedTab={selectedTab}
        categories={statCards}
        statData={summaryData}
        onCreate={handelCreate}
        handleStatCardSelect={handleStatCardSelect}
        createEnabledTabs={["Staff"]}
      />

      {selectedTab === "Staff" && (
        <>
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
                label="Search Staff"
                value={searchTerm}
                onChange={handleSearchChange}
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
            <CrewDetailList
              filter={finalGqlFilter}
              searchTerm={searchTerm}
              open={open}
              setOpen={setOpen}
            />
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
            onReset={handleFinalReset}
          >
            {/* Add custom filter fields here if needed */}
          </ReusableFilterPanel>
        </>
      )}

      {selectedTab === "Renewals" && (
        <StaffCertificationList list={staffCertificates} />
      )}

      {selectedTab === "Leaves" && (
        <LeaveApprovalRequestTable
          data={leaveList.data}
          total={leaveList.totalCount}
          page={leavePage}
          pageSize={leavePageSize}
          onPageChange={setLeavePage}
          onPageSizeChange={setLeavePageSize}
          refreshList={refreshList}
          filters={leaveFilters}
          onChange={setLeaveFilters}
        />
      )}
    </>
  );
};

export default CrewControllerPage;
