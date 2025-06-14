import React, { useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import AccountList from "../accounts/List";

const AccountsDashboard = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<any>();

  const [selectedTab, setSelectedTab] = useState("Invoices");

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
    setFilter(_filter);
  };

  const categories = [
    {
      status: ["Tax Invoice", "Proforma Invoice"],
      name: "Invoices",
      countLabel: "Invoices",
    },

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
        createEnabledTabs={["Invoices"]}
      />
      <AccountList filter={filter} />
    </>
  );
};

export default AccountsDashboard;
