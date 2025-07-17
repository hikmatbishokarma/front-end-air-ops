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
import { ManualList } from "../manual/List";
import { GET_MANUALS } from "../../lib/graphql/queries/manual";

const ManualDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;

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
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Manual!", "error");
      setManualData(result);
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

  useEffect(() => {
    getManual();
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
    await getManual();
  };

  const categories = [
    { status: [], name: "Manuals", countLabel: "manuals" },

    { status: [], name: "Reports", countLabel: "Reports" },
  ];

  const [open, setOpen] = useState(false);

  const handelCreate = (selectedTab) => {
    setOpen(true);
  };

  return (
    <>
      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={crewSummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Manuals"]}
      />
      <ManualList
        open={open}
        setOpen={setOpen}
        list={manualData.data}
        loading={loading}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        refreshList={refreshList}
      />
    </>
  );
};

export default ManualDashboard;
