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
import { GET_CREW_DETAILS } from "../../lib/graphql/queries/crew-detail";

const CrewDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.agent?.id || null;

  const [selectedTab, setSelectedTab] = useState("Staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [crewData, setCrewData] = useState({ totalCount: {}, data: [] });
  const [loading, setLoading] = useState(false);
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

      console.log("crewww::", result);

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

  console.log("crewSummary:::", crewSummary);

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
      <CrewDetailList
        open={open}
        setOpen={setOpen}
        list={crewData.data}
        loading={loading}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        refreshList={refreshList}
      />
    </>
  );
};

export default CrewDashboard;
