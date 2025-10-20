import React, { useEffect, useState } from "react";

import QuoteList from "../../features/quotes/pages/List";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { GET_STAFF_CERTIFICATION } from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import { StaffCertificationList } from "../crew-detail/CertificationList";

const TrainingDashboard = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const navigate = useNavigate();

  const operatorId = session?.user.operator?.id || null;

  const [trainingAndSalesSummary, setTrainingAndSalesSummary] = useState<any>({
    summary: {
      staff: 0,
      leaves: 0,
      renewals: 0,
    },
  });

  const [staffCertificates, setStaffCertification] = useState<any>();

  const [selectedTab, setSelectedTab] = useState("Renewals");

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
    { status: [], name: "Renewals", countLabel: "renewals" },
    { status: [], name: "Reports", countLabel: "Reports" },
  ];

  const handelCreate = (selectedTab) => {
    console.log("selectedTab::", selectedTab);
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
              ...(operatorId && { operatorId: { eq: operatorId } }),
            },
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Certification!", "error");
      setTrainingAndSalesSummary((prev) => ({
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
  }, []);

  return (
    <>
      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={trainingAndSalesSummary}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Renewals"]}
      />
      <StaffCertificationList list={staffCertificates} />
    </>
  );
};

export default TrainingDashboard;
