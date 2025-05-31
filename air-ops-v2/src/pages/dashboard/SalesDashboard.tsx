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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Box,
} from "@mui/material";
import QuoteList from "../quote/list";
import useGql from "../../lib/graphql/gql";
import { GET_SALES_DASHBOARD } from "../../lib/graphql/queries/dashboard";
import { getEnumKeyByValue, QuotationStatus } from "../../lib/utils";
import { useNavigate } from "react-router";
import DashboardBoardSection from "../../components/DashboardBoardSection";
import { useSession } from "../../SessionContext";
import { Controller, set, useForm, useWatch } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";
import { useSnackbar } from "../../SnackbarContext";
import InvoicePreview from "../../components/invoice-preview";
import InvoiceList from "../quote/invoice-list";
import { TRIP_CONFIRMATION } from "../../lib/graphql/queries/quote";
import TripConfirmationPreview from "../../components/trip-confirmation-preview";

const SalesDashboard = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [selectedTab, setSelectedTab] = useState("Quotes");

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const [filter, setFilter] = useState({
    ...(operatorId && {
      operatorId: { eq: operatorId },
    }),
  });
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);

  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const [salesDashboardData, setSalesDashboardData] = useState<any>();

  const [tripConfirmationOpen, setTripConfirmationOpen] = useState(false);

  const fethSalesDashboardData = async () => {
    try {
      const data = await useGql({
        query: GET_SALES_DASHBOARD,
        queryName: "getSalesDashboardData",
        queryType: "query-without-edge",
        variables: {
          operatorId: operatorId,
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

    console.log("statusFilter:::", statusFilter);

    const _filter = {
      ...filter,
      ...(statusFilter && statusFilter.length > 0 ? { or: statusFilter } : {}),
    };

    setFilter(_filter);
  };

  // const categories = ["Quote", "Invoice", "Cancelled", "Revenue"];

  const categories = [
    { status: [""], name: "Quotes" },
    { status: ["Proforma Invoice", "Tax Invoice"], name: "Invoices" },
    { status: ["Confirmed"], name: "Trip Confirmation" },
    { status: [""], name: "Reports" },
  ];

  const handelCreate = (selectedTab) => {
    // const redirectTo = selectedTab == "Quotes" ? "/quotes/create" : "";

    // navigate(redirectTo);

    if (selectedTab === "Quotes") {
      navigate("/quotes/create");
    } else if (selectedTab === "Invoices") {
      setOpenInvoiceDialog(true); // Open modal
    } else if (selectedTab === "Trip Confirmation") {
      setTripConfirmationOpen(true); // Open modal
    }
  };

  // const { control, handleSubmit, reset } = useForm({
  //   defaultValues: {
  //     type: "PROFORMA_INVOICE",
  //     quotationNo: "",
  //     proformaInvoiceNo: "",
  //   },
  // });

  // For Trip Confirmation Dialog
  const {
    control: tripControl,
    handleSubmit: handleTripSubmit,
    reset: resetTripForm,
  } = useForm({
    defaultValues: {
      quotationNo: "",
    },
  });

  // For Proforma Invoice Dialog
  const {
    control: proformaControl,
    handleSubmit: handleProformaSubmit,
    reset: resetProformaForm,
  } = useForm({
    defaultValues: {
      type: "PROFORMA_INVOICE",
      quotationNo: "",
      proformaInvoiceNo: "",
    },
  });

  const invoiceType = useWatch({ control: proformaControl, name: "type" });

  const [invoiceData, setInvoicedata] = useState<any>(null);
  const [tripConfirmationData, setTripConfirmationData] = useState<any>(null);
  const [showTripConfirmationPreview, setShowTripConfirmationPreview] =
    useState(false);
  const [isTripConfirmed, setIsTripConfirmed] = useState(false);

  // const onGenerateInvoice = ({ type, quotationNo, proformaInvoiceNo }) => {
  //   setOpenInvoiceDialog(false);
  //   if (type === "Proforma Invoice") {
  //     navigate(`/invoices/preview?quotationNo=${quotationNo}`);
  //   } else if (invoiceType === "Tax Invoice") {
  //     navigate(`/invoices/preview?piNo=${proformaInvoiceNo}`);
  //   }
  //   reset(); // reset form after submission
  // };

  const onGenerateInvoice = async ({
    type,
    quotationNo,
    proformaInvoiceNo,
  }) => {
    setOpenInvoiceDialog(false);

    const result = await useGql({
      query: GENERATE_INVOICE,
      queryName: "generateInvoice",
      queryType: "mutation",
      variables: {
        args: {
          type,
          quotationNo,
          proformaInvoiceNo,
          ...(operatorId && { operatorId }),
        },
      },
    });

    if (!result.data) {
      showSnackbar(
        result?.errors?.[0]?.message || "Internal server error!",
        "error"
      );
    } else {
      setInvoicedata(result?.data?.generateInvoice);
      setShowInvoicePreview(true);
      setIsInvoiceGenerated(true);
    }
  };

  const handelTripConfirmation = async ({ quotationNo }) => {
    setTripConfirmationOpen(false);

    const result = await useGql({
      query: TRIP_CONFIRMATION,
      queryName: "tripConfirmation",
      queryType: "mutation",
      variables: {
        args: {
          quotationNo,
          ...(operatorId && { operatorId }),
        },
      },
    });

    if (!result.data) {
      showSnackbar(
        result?.errors?.[0]?.message || "Internal server error!",
        "error"
      );
    } else {
      setTripConfirmationData(result?.data?.tripConfirmation);
      setShowTripConfirmationPreview(true);
      setIsTripConfirmed(true);
    }
  };

  return (
    <>
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
      >
        <DialogTitle>
          Generate Invoice
          <IconButton
            aria-label="close"
            onClick={() => setOpenInvoiceDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleProformaSubmit(onGenerateInvoice)}>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel>Select Invoice Type</FormLabel>
              <Controller
                control={proformaControl}
                name="type"
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="PROFORMA_INVOICE"
                      control={<Radio />}
                      label="Proforma Invoice"
                    />
                    <FormControlLabel
                      value="TAX_INVOICE"
                      control={<Radio />}
                      label="Tax Invoice"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {invoiceType === "PROFORMA_INVOICE" && (
              <Controller
                name="quotationNo"
                control={proformaControl}
                rules={{ required: "Quotation No is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Quotation No"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            )}

            {invoiceType === "TAX_INVOICE" && (
              <Controller
                name="proformaInvoiceNo"
                control={proformaControl}
                rules={{ required: "Proforma Invoice No is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label="Proforma Invoice No"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            )}

            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={tripConfirmationOpen}
        onClose={() => setTripConfirmationOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "600px", // or 768px, 800px – adjust as you like
            maxWidth: "80%", // responsive fallback
          },
        }}
      >
        <DialogTitle>
          Trip Confirmation
          <IconButton
            aria-label="close"
            onClick={() => setTripConfirmationOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* <DialogContent>
          <form onSubmit={handleTripSubmit(handelTripConfirmation)}>
            <Controller
              name="quotationNo"
              control={tripControl}
              rules={{ required: "Quotation No is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Quotation No"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </form>
        </DialogContent> */}
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleTripSubmit(handelTripConfirmation)}
            sx={{ width: "80%" }}
          >
            <Controller
              name="quotationNo"
              control={tripControl}
              rules={{ required: "Quotation No is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Quotation No"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button type="submit" color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <DashboardBoardSection
        selectedTab={selectedTab}
        categories={categories}
        salesDashboardData={salesDashboardData}
        onCreate={handelCreate}
        onFilter={handelFilter}
        createEnabledTabs={["Quotes", "Invoices", "Trip Confirmation"]}
      />
      {(selectedTab == "Quotes" || selectedTab == "Trip Confirmation") && (
        <QuoteList filter={filter} isGenerated={isTripConfirmed} />
      )}
      {selectedTab == "Invoices" && (
        <InvoiceList isGenerated={isInvoiceGenerated} />
      )}

      <Dialog
        open={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Invoice Preview</DialogTitle>

        <DialogContent>
          <InvoicePreview
            htmlContent={invoiceData?.template}
            currentQuotation={invoiceData?.quotationNo}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowInvoicePreview(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showTripConfirmationPreview}
        onClose={() => setShowTripConfirmationPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Trip Confirmation Preview</DialogTitle>

        <DialogContent>
          <TripConfirmationPreview
            htmlContent={tripConfirmationData?.confirmationTemplate}
            currentQuotation={tripConfirmationData?.quotationNo}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowTripConfirmationPreview(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesDashboard;
