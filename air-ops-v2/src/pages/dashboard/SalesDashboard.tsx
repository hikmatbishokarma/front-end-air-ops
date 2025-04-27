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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";

const SalesDashboard = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Quotes");

  const [filter, setFilter] = useState({
    // isLatest: { is: true },
    or: [{ status: { eq: "QUOTE" } }],
  });
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState("");

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
      status: { eq: getEnumKeyByValue(QuotationStatus, s) },
    }));

    const _filter = {
      // isLatest: { is: true },
      or: statusFilter,
    };

    setFilter(_filter);
  };

  // const categories = ["Quote", "Invoice", "Cancelled", "Revenue"];

  const categories = [
    { status: ["Quote"], name: "Quotes" },
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
      setOpenInvoiceDialog(true); // Open modal
    }
  };

  return (
    <>
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
      >
        <DialogTitle>Enter Quotation Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quotation Number"
            type="text"
            fullWidth
            variant="outlined"
            value={quotationNumber}
            onChange={(e) => setQuotationNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoiceDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenInvoiceDialog(false);
              navigate(`/invoices/preview?quotationNo=${quotationNumber}`);
            }}
            color="primary"
            variant="contained"
            disabled={!quotationNumber}
          >
            Generate Invoice
          </Button>
        </DialogActions>
      </Dialog>
      {/* <div className="dashboard_main_d">
        <div className="ban_img"></div>

        <div style={{ padding: 20 }} className="v1_board">
          
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Typography className="v1_h6" variant="h6">
              {selectedTab.toUpperCase()}
            </Typography>
            {(selectedTab == "Quotes" || selectedTab == "Invoices") && (
              <Button
                className="v1_quote_btn"
                variant="contained"
                color="primary"
                onClick={() => handelCreate(selectedTab)}
              >
                Create {selectedTab.slice(0, -1)}
              </Button>
            )}
          </Grid>

         
          <Grid container spacing={2}>
            {categories.map((item) => (
              <Grid item xs={3} key={item.name}>
                <Card
                  onClick={() => handelFilter(item)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedTab === item.name ? "#1976d2" : "#fff",
                    color: selectedTab === item.name ? "#fff" : "#000",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography className="v1-card-h6" variant="h6">
                      {item.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body1">
                      {salesDashboardData?.summary[item.name.toLowerCase()]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div> */}

      <DashboardBoardSection 
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Quotes", "Invoices"]}
      />
      <QuoteList  filter={filter} />
    </>
  );
};

export default SalesDashboard;
