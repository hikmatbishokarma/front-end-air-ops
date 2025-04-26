import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import useGql from "../../lib/graphql/gql";
import {
  SEND_ACKNOWLEDGEMENT,
  GET_QUOTES,
  SHOW_PREVIEW,
  UPDATE_QUOTE_STATUS,
  UPGRAD_QUOTE,
} from "../../lib/graphql/queries/quote";
import QuoteCreate from "./create";
import { Outlet, useNavigate } from "react-router";
import { GET_LOGIN, SIGN_IN } from "../../lib/graphql/queries/auth";
import { useSnackbar } from "../../SnackbarContext";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../../components/quote-preview";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import QuotationWorkflowField from "./fields/quota-workflow-field";
import {
  getEnumKeyByValue,
  QuotationStatus,
  SalesDocumentType,
} from "../../lib/utils";

import QuotationWorkflowUpgradeConfirmation from "./quotation-workflow-upgrade-confirmation";
import QuotationCancellationConfirmation from "./quotation-cancellation";

export const QuoteList = ({ filter }) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [isNewQuote, setIsNewQuote] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [currentId, setCurrentId] = useState();
  const [currentQuotation, setCurrentQuotation] = useState();

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query",
        variables: {
          filter: filter,
        },
      });
      setRows(() => {
        return data?.map((quote: any) => {
          return {
            id: quote.id,
            quotationNo: quote?.quotationNo,
            status: QuotationStatus[quote.status],
            requester: quote.requestedBy.name,
            version: quote.version,
            revision: quote.revision,
            itinerary: quote.itinerary
              ?.map((itinerary: any) => {
                return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
              })
              .join(", "),
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
            code: quote.code,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, [filter]);

  const handelPreview = async (quotationNo, quoteId) => {
    const result = await useGql({
      query: SHOW_PREVIEW,
      queryName: "showPreview",
      queryType: "query-without-edge",
      variables: { quotationNo },
    });

    if (!result) {
      showSnackbar("Internal server error!", "error");
    }
    setCurrentId(quoteId);
    setCurrentQuotation(quotationNo);
    setPreviewData(result);
    setShowPreview(true);
  };

  // const validateEmail = (value: string) => {
  //   const emailRegex = /^\S+@\S+\.\S+$/;
  //   if (!value) {
  //     setError(true);
  //     setHelperText("Email is required");
  //   } else if (!emailRegex.test(value)) {
  //     setError(true);
  //     setHelperText("Invalid email format");
  //   } else {
  //     setError(false);
  //     setHelperText("");
  //   }
  // };

  // const handelEmailNotification = (id) => {
  //   setCurrentId(id);
  //   setShowEmailDialog(true);
  // };

  // const handelSendQuoteThroughEmail = async () => {
  //   const result = await useGql({
  //     query: SEND_ACKNOWLEDGEMENT,
  //     queryName: "",
  //     queryType: "query-without-edge",
  //     variables: {
  //       input: {
  //         quotationNo: currentQuotation,
  //         email: clientEmail,
  //         documentType: SalesDocumentType.QUOTATION,
  //       },
  //     },
  //   });

  //   if (!result) {
  //     showSnackbar("Internal server error!", "error");
  //   } else showSnackbar("Quote sent successfully!", "success");

  //   setShowEmailDialog(false);
  // };

  const refreshList = async () => {
    await getQuotes();
  };

  const updateQuoteStatus = async (id, toStatus) => {
    try {
      const data = await useGql({
        query: UPDATE_QUOTE_STATUS,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            id: id,
            status: getEnumKeyByValue(QuotationStatus, toStatus),
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    } finally {
      refreshList();
    }
  };

  const handelCancellation = async (id) => {
    try {
      await updateQuoteStatus(id, QuotationStatus.CANCELLED);
    } catch (error) {
      console.error("Error transitioning state:", error);
    } finally {
    }
  };

  const upgradQuote = async (code) => {
    try {
      const data = await useGql({
        query: UPGRAD_QUOTE,
        queryName: "",
        queryType: "mutation",
        variables: {
          code: code,
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Update status!", "error");
      } else showSnackbar("Update status!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Update Status!", "error");
    }
  };

  // const handleUpgradeClick = async (code) => {
  //   try {
  //     await upgradQuote(code);
  //   } catch (error) {
  //     console.error("Error upgrading quotation:", error);
  //   } finally {
  //     refreshList();
  //   }
  // };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Quotation No</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Requester</TableCell>
              <TableCell align="right">Itinenary</TableCell>
              {/* <TableCell align="right">Version</TableCell> */}
              {/* <TableCell align="right">Preview</TableCell> */}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                //onClick={() => handelPreview(row.id)}
              >
                <TableCell component="th" scope="row">
                  {row.quotationNo}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>

                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handelPreview(row.quotationNo, row.id)}
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>

                  {QuotationStatus.QUOTE == row.status && (
                    <>
                      <Tooltip title="Cancel">
                        <IconButton>
                          <QuotationCancellationConfirmation
                            onCancellation={() => handelCancellation(row.id)}
                            quotationNo={row.quotationNo}
                            quotationId={row.id}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* <Tooltip title="Upgrade">
                        <IconButton size="small">
                          <QuotationWorkflowUpgradeConfirmation
                            onUpgrade={() => handleUpgradeClick(row.code)}
                            currentState={row.status}
                            code={row.code}
                          />
                        </IconButton>
                      </Tooltip> */}
                    </>
                  )}

                  {/* <IconButton
                    color="primary"
                    onClick={() => handelEmailNotification(row.id)}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button variant="contained" onClick={() => setIsNewQuote(true)}>
          NEW QUOTE
        </Button>
      </Box> */}
      {/* <QuoteCreate isNewQuote={isNewQuote} setIsNewQuote={setIsNewQuote} /> */}

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Quote Preview</DialogTitle>

        <DialogContent>
          <QuotePreview
            htmlContent={previewData}
            currentId={currentId}
            currentQuotation={currentQuotation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        fullWidth
        maxWidth="xs" // Smaller size
        sx={{ "& .MuiDialog-paper": { width: "auto", padding: 2 } }} // Adjust width
      >
        <DialogTitle>Send Quote via email</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              size="small"
              margin="normal"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              error={error}
              helperText={helperText}
            />

            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handelSendQuoteThroughEmail}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default QuoteList;
