import React, { useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { CrewDetailList } from "../crew-detail/List";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import {
  GET_CREW_DETAILS,
  GET_STAFF_CERTIFICATION,
} from "../../lib/graphql/queries/crew-detail";
import { StaffCertificationList } from "../crew-detail/CertificationList";
import { GET_LEAVES } from "../../lib/graphql/queries/leave";
import LeaveApprovalRequestTable from "../crew-detail/leave-approval/LeaveApprovalList";

const CrewDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;

  const [selectedTab, setSelectedTab] = useState("Staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [crewData, setCrewData] = useState({ totalCount: {}, data: [] });
  const [loading, setLoading] = useState(false);
  const [staffCertificates, setStaffCertification] = useState<any>();
  const [crewSummary, setCrewSummary] = useState<any>({
    summary: {
      staff: 0,
      leaves: 0,
      renewals: 0,
    },
  });

  const getCrewDetails = async () => {
    try {
      const result = await useGql({
        query: GET_CREW_DETAILS,
        queryName: "crewDetails",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Crew Details!", "error");
      setCrewData(result);
      setCrewSummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          staff: result.totalCount,
        },
      }));
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Crew Details!", "error");
    }
  };

  useEffect(() => {
    getCrewDetails();
  }, [selectedTab, searchTerm, filters]);

  const handelFilter = (data) => {
    setSelectedTab(data.name);

    const statusFilter = data.status.map((s) => ({
      status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    }));

    const _filter = {
      // isLatest: { is: true },
      or: statusFilter,
    };
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const refreshList = async () => {
    // Fetch updated categories from API
    await getCrewDetails();
    await getLeaves();
    await getStaffCertifications();
  };

  const categories = [
    { status: [], name: "Staff", countLabel: "staff" },
    {
      status: [],
      name: "Leaves",
      countLabel: "leaves",
    },
    { status: [], name: "Renewals", countLabel: "renewals" },
    { status: [], name: "Reports", countLabel: "Reports" },
  ];

  const [open, setOpen] = useState(false);

  const handelCreate = (selectedTab) => {
    setOpen(true);
  };

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
      setCrewSummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          renewals: result.totalCount,
        },
      }));
      setStaffCertification(result.data);
    } catch (error) {
      showSnackbar(
        error.message || "Failed to fetch fetch Certification!",
        "error"
      );
    }
  };

  useEffect(() => {
    getStaffCertifications();
  }, [selectedTab]);

  //#region  Leaves Approval

  const [leaveList, setLeaveList] = useState<any>({ data: [], totalCount: 0 });
  const [leavePage, setLeavePage] = useState(0);
  const [leavePageSize, setLeavePageSize] = useState(10);

  const [leaveFilters, setLeaveFilters] = useState({ type: "", status: "" });

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
      setCrewSummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          leaves: result.totalCount,
        },
      }));
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Leaves!", "error");
    }
  };

  useEffect(() => {
    getLeaves();
  }, [leaveFilters, selectedTab]);

  //#endregion

  return (
    <>
      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={crewSummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Staff"]}
      />
      {selectedTab == "Staff" && (
        <CrewDetailList
          open={open}
          setOpen={setOpen}
          list={crewData.data}
          loading={loading}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          refreshList={refreshList}
        />
      )}
      {selectedTab == "Renewals" && (
        <StaffCertificationList list={staffCertificates} />
      )}
      {selectedTab == "Leaves" && (
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

export default CrewDashboard;
