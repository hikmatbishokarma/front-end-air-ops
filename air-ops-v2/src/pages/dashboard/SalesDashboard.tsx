import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getStatusKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import Dbanner from "./Asset/Images/dash_banner.png";

const SalesDashboard = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Quotes");

  const [filter, setFilter] = useState({
    isLatest: { is: true },
    or: [{ status: { eq: "QUOTE" } }],
  });

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

  const fethSalesDashboardData = async () => {
    try {
      const data = await useGql({
        query: GET_SALES_DASHBOARD,
        queryName: "getSalesDashboardData",
        queryType: "query-without-edge",
        variables: {
          range: "lastMonth",
        },
      });
      console.log("data:::", data);
      setSalesDashboardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fethSalesDashboardData();
  }, []);

  const handelFilter = (data) => {
    setSelectedTab(data.name);

    const statusFilter = data.status.map((s) => ({
      status: { eq: getStatusKeyByValue(QuotationStatus, s) },
    }));

    const _filter = { isLatest: { is: true }, or: statusFilter };

    console.log("_filter:::", _filter);

    setFilter(_filter);
  };

  console.log("filter", filter);

  // const categories = ["Quote", "Invoice", "Cancelled", "Revenue"];

  const categories = [
    { status: ["Quote"], name: "Quotes" },
    { status: ["Tax Invoice", "Proforma Invoice"], name: "Invoices" },
    { status: ["Cancelled"], name: "Cancellations" },
    { status: [], name: "Revenue" },
  ];

  const handelCreate = (selectedTab) => {
    const redirectTo = selectedTab == "Quotes" ? "/quotes/create" : "";

    navigate(redirectTo);
  };

  return (
    <>

       <div className="dashboard_main_d">
            <div className="ban_img">
               
            </div>
            {/* <div className="heading">
              <div className="name">
                <h2>Hello</h2>
                <p> Welcome to Airops</p>
              </div>
            </div> */}

    <div style={{ padding: 20 }} className="v1_board">
      {/* Table Section */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Typography className="v1_h6" variant="h6">{selectedTab.toUpperCase()}</Typography>
        {(selectedTab == "Quotes" || selectedTab == "Invoices") && (
          <Button className="v1_quote_btn"
            variant="contained"
            color="primary"
            onClick={() => handelCreate(selectedTab)}
          >
            Create {selectedTab.slice(0, -1)}
          </Button>
        )}
      </Grid>

      {/* Top Section with Cards */}
      <Grid container spacing={2}>
        {categories.map((item) => (
          <Grid item xs={3} key={item.name}>
            <Card
              onClick={() => handelFilter(item)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedTab === item.name ? "#1976d2" : "#fff",
                color: selectedTab === item.name ? "#fff" : "#000",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography className="v1-card-h6" variant="h6">{item.name.toUpperCase()}</Typography>
                <Typography variant="body1">
                  {salesDashboardData?.summary[item.name.toLowerCase()]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <QuoteList filter={filter} />
    </div>
    </div>
    </>
  );
};

export default SalesDashboard;
