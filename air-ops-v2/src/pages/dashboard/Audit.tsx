import React, { useEffect, useState } from "react";

import QuoteList from "../../features/quotes/pages/List";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";

const AuditDashboard = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Quotes");

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
    { status: ["Ops"], name: "Ops" },
    { status: ["Tax Invoice", "Proforma Invoice"], name: "Invoices" },
    { status: ["Cancelled"], name: "Cancellations" },
    { status: [], name: "Revenue" },
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
      <p className="coming-soon">Comming soon</p>
    </>
  );
};

export default AuditDashboard;
