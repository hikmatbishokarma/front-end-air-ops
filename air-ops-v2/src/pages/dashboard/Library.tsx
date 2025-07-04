import React, { useEffect, useState } from "react";

import useGql from "../../lib/graphql/gql";

import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";

import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";

import { GET_LIBRARIES } from "../../lib/graphql/queries/library";
import { LibraryList } from "../library/List";

const LibraryDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.agent?.id || null;

  const [selectedTab, setSelectedTab] = useState("Libraries");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [libraryData, setLibraryData] = useState({
    totalCount: {},
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [librarySummary, setLibrarySummary] = useState<any>({
    summary: {
      libraries: 0,
    },
  });

  const getLibrary = async () => {
    try {
      const result = await useGql({
        query: GET_LIBRARIES,
        queryName: "libraries",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Library!", "error");
      setLibraryData(result);
      setLibrarySummary((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          libraries: result.totalCount,
        },
      }));
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Library!", "error");
    }
  };

  useEffect(() => {
    getLibrary();
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
    await getLibrary();
  };

  const categories = [
    { status: [], name: "Libraries", countLabel: "libraries" },

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
        salesDashboardData={librarySummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Libraries"]}
      />
      <LibraryList
        open={open}
        setOpen={setOpen}
        list={libraryData.data}
        loading={loading}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        refreshList={refreshList}
      />
    </>
  );
};

export default LibraryDashboard;
