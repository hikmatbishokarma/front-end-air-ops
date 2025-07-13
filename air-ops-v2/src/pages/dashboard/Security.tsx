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

import { GET_SECURITIES } from "../../lib/graphql/queries/security";
import { SecurityList } from "../security/List";

const SecurityDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;

  const [selectedTab, setSelectedTab] = useState("Securities");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [securityData, setSecurityData] = useState({
    totalCount: {},
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [securitySummary, setSecuritySummary] = useState<any>({
    summary: {
      securities: 0,
    },
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
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Security!", "error");
      setSecurityData(result);
      setSecuritySummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          securities: result.totalCount,
        },
      }));
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Security!", "error");
    }
  };

  useEffect(() => {
    getSecurity();
  }, [selectedTab, searchTerm, filters]);

  const handelFilter = (data) => {
    setSelectedTab(data.name);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const refreshList = async () => {
    // Fetch updated categories from API
    await getSecurity();
  };

  const categories = [
    { status: [], name: "Securities", countLabel: "securities" },

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
        salesDashboardData={securitySummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Securities"]}
      />
      <SecurityList
        open={open}
        setOpen={setOpen}
        list={securityData.data}
        loading={loading}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        refreshList={refreshList}
      />
    </>
  );
};

export default SecurityDashboard;
