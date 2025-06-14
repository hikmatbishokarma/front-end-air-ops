import React, { useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { CrewDetailList } from "../crew-detail/List";

const CrewDashboard = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Staff");

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

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

  const categories = [
    { status: [], name: "Staff", countLabel: "Staff" },
    {
      status: [],
      name: "Leaves",
      countLabel: "Leaves",
    },
    { status: [], name: "Renewals", countLabel: "Renewals" },
    { status: [], name: "Reports", countLabel: "Reports" },
  ];

  const handelCreate = (selectedTab) => {
    // const redirectTo = selectedTab == "Quotes" ? "/quotes/create" : "";

    // navigate(redirectTo);

    if (selectedTab === "Quotes") {
      navigate("/quotes/create");
    } else if (selectedTab === "Invoices") {
    }
  };

  return (
    <>
      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Ops", "Invoices"]}
      />
      <CrewDetailList />
    </>
  );
};

export default CrewDashboard;
