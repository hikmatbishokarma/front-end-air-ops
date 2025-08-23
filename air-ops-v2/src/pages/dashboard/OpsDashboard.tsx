import React, { useEffect, useState } from "react";

import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import {
  getEnumKeyByValue,
  QuotationStatus,
  SalesCategoryLabels,
} from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import moment from "moment";
import { GET_QUOTES } from "../../lib/graphql/queries/quote";
import { useSession } from "../../SessionContext";
import SalesConfirmationList from "../ops/tables/sales-confirmation";
import { Box } from "@mui/material";

const OpsDashboard = () => {
  const navigate = useNavigate();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [filter, setFilter] = useState({});

  const [selectedTab, setSelectedTab] = useState("Quotes");

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

  const [quoteList, setQuoteList] = useState<any[]>([]);

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [totalCount, setTotalCount] = useState(0); // total count from backend

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

  const getQuotes = async (customFilter?: any) => {
    const finalFilter = customFilter || {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query-with-count",
        variables: {
          filter: finalFilter,
          "paging": {
            "offset": page * rowsPerPage,
            "limit": rowsPerPage,
          },
          "sorting": [{ "field": "createdAt", "direction": "DESC" }],
        },
      });

      const result = data?.data?.map((quote: any) => {
        return {
          ...quote,
          id: quote.id,
          quotationNo: quote?.quotationNo,
          status: QuotationStatus[quote.status],
          requester: quote.requestedBy.name,
          requesterId: quote.requestedBy.id,
          version: quote.version,
          revision: quote.revision,
          itinerary: quote.itinerary
            ?.map((itinerary: any) => {
              return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
            })
            .join(", "),
          createdAt: moment(quote.createdAt).format("DD-MM-YYYY HH:mm"),
          updatedAt: quote.updatedAt,
          code: quote.code,
        };
      });

      setTotalCount(data?.totalCount || 0);
      setQuoteList(result);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, [filter, page, rowsPerPage]);

  const categories = [
    {
      status: [QuotationStatus.SALE_CONFIRMED],
      name: SalesCategoryLabels.SALE_CONFIRMATION,
      countLabel: "saleConfirmations",
    },
    { status: [""], name: SalesCategoryLabels.REPORTS, countLabel: "reports" },
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
        createEnabledTabs={[""]}
      />
      <Box mt={1}>
        <SalesConfirmationList
          quoteList={quoteList}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          selectedTab={selectedTab}
        />
      </Box>
    </>
  );
};

export default OpsDashboard;
