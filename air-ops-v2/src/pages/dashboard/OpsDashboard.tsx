import React, { useEffect, useState } from "react";

import QuoteList from "../../features/quotes/pages/List";
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
import SalesConfirmationList from "../ops/tables/SalesConfirmation";
import { Box } from "@mui/material";
import { GET_TRIP_DETAILS } from "../../lib/graphql/queries/trip-detail";
import TripDetailList from "../ops/tables/TripDetail";

const OpsDashboard = () => {
  const navigate = useNavigate();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [filter, setFilter] = useState({});

  const [selectedTab, setSelectedTab] = useState("Sale Confirmation");

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

  const [quoteList, setQuoteList] = useState<any[]>([]);

  const [tripDetailList, setTripDetailList] = useState<any[]>([]);

  const [page, setPage] = useState(0); // page number starting at 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // default 10

  const [salesConfirmTotalCount, setSalesConfirmTotalCount] = useState(0); // total count from backend
  const [tripDetailTotalCount, setTripDetailTotalCount] = useState(0); // total count from backend

  const handelFilter = (data) => {
    setSelectedTab(data.name);

    // const statusFilter = data.status.map((s) => ({
    //   status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    // }));

    // const _filter = {
    //   // isLatest: { is: true },
    //   or: statusFilter,
    // };
  };

  const getQuotes = async (customFilter?: any) => {
    const finalFilter = customFilter || {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
      or: [
        {
          status: {
            eq: "SALE_CONFIRMED",
          },
        },
        {
          status: {
            eq: "TRIP_GENERATED",
          },
        },
      ],
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
          requester: quote?.requestedBy?.name ?? "N/A",
          requesterId: quote?.requestedBy?.id ?? "",
          version: quote.version,
          revision: quote.revision,
          // itinerary: quote.itinerary
          //   ?.map((itinerary: any) => {
          //     return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
          //   })
          //   .join(", "),
          sectors: quote.sectors,
          createdAt: moment(quote.createdAt).format("DD-MM-YYYY HH:mm"),
          updatedAt: quote.updatedAt,
          code: quote.code,
          category: quote?.category ?? "",
        };
      });

      setSalesConfirmTotalCount(data?.totalCount || 0);
      setQuoteList(result);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTripDetails = async (customFilter?: any) => {
    const finalFilter = customFilter || {
      ...filter,
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    try {
      const result = await useGql({
        query: GET_TRIP_DETAILS,
        queryName: "tripDetails",
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

      setTripDetailTotalCount(result?.totalCount || 0);
      setTripDetailList(result.data);
      // Extract unique requesters for dropdown
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedTab == "Sale Confirmation") {
      getQuotes();
    }
  }, [filter, page, rowsPerPage, selectedTab]);

  useEffect(() => {
    if (selectedTab == "Trip Details") {
      getTripDetails();
    }
  }, [filter, page, rowsPerPage, selectedTab]);

  const categories = [
    {
      name: SalesCategoryLabels.SALE_CONFIRMATION,
      countLabel: "saleConfirmations",
    },
    { name: "Trip Details", countLabel: "tripDetails" },
    { name: SalesCategoryLabels.REPORTS, countLabel: "reports" },
  ];

  return (
    <>
      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        onFilter={handelFilter}
        salesDashboardData={salesDashboardData}
        createEnabledTabs={[]}
      />
      <Box mt={1}>
        {selectedTab == "Sale Confirmation" && (
          <SalesConfirmationList
            quoteList={quoteList}
            totalCount={salesConfirmTotalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            selectedTab={selectedTab}
          />
        )}
        {selectedTab == "Trip Details" && (
          <TripDetailList
            tripDetailList={tripDetailList}
            totalCount={tripDetailTotalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            selectedTab={selectedTab}
          />
        )}
      </Box>
    </>
  );
};

export default OpsDashboard;
