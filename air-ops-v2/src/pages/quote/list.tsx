import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
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
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { QuoteStatus } from "../../lib/utils";
import useGql from "../../lib/graphql/gql";
import { GENERATE_QUOTE_PDF, GET_QUOTES, SHOW_PREVIEW } from "../../lib/graphql/queries/quote";
import QuoteCreate from "./create";
import { Outlet, useNavigate } from "react-router";
import { GET_LOGIN, SIGN_IN } from "../../lib/graphql/queries/auth";
import { useSnackbar } from "../../SnackbarContext";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import QuotePreview from "../../components/quote-preview";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

export const QuoteList = () => {
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

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query",
        variables: {},
      });
      setRows(() => {
        return data.map((quote: any) => {
          return {
            id: quote.id,
            refrenceNo: quote.referenceNumber,
            status: QuoteStatus[quote.status],
            requester: quote.requestedBy.name,
            version: quote.version,
            itinerary: quote.itinerary
              .map((itinerary: any) => {
                return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
              })
              .join(", "),
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, []);

  const handelPreview = async (quoteId) => {
    const result = await useGql({
      query: SHOW_PREVIEW,
      queryName: "showPreview",
      queryType: "query-without-edge",
      variables: { id: quoteId },
    });

    if (!result) {
      showSnackbar("Internal server error!", "error");
    }
    setPreviewData(result);
    setShowPreview(true);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!value) {
      setError(true);
      setHelperText("Email is required");
    } else if (!emailRegex.test(value)) {
      setError(true);
      setHelperText("Invalid email format");
    } else {
      setError(false);
      setHelperText("");
    }
  };

  const handelEmailNotification = (id) => {
    setCurrentId(id);
    setShowEmailDialog(true);
  };

  const handelSendQuoteThroughEmail = async () => {
    const result = await useGql({
      query: GENERATE_QUOTE_PDF,
      queryName: "",
      queryType: "query-without-edge",
      variables: {
        input: {
          id: currentId,
          email: clientEmail,
        },
      },
    });

    if (!result) {
      showSnackbar("Internal server error!", "error");
    } else showSnackbar("Quote sent successfully!", "success");

    setShowEmailDialog(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Requester</TableCell>
              <TableCell align="right">Itinenary</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">Preview</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                // onClick={() => navigate(`/quotes/edit/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {row.refrenceNo}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
                <TableCell align="right">{row.version}</TableCell>
                <TableCell align="right">
                <IconButton
                    color="primary"
                    onClick={() => handelPreview(row.id)}
                  >
                    <PreviewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                 
                
                  <IconButton
                    color="secondary"
                    onClick={() => navigate(`/quotes/edit/${row.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handelEmailNotification(row.id)}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button variant="contained" onClick={() => setIsNewQuote(true)}>
          NEW QUOTE
        </Button>
      </Box>
      <QuoteCreate isNewQuote={isNewQuote} setIsNewQuote={setIsNewQuote} />

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Quote Preview</DialogTitle>
        <DialogContent>
          <QuotePreview htmlContent={previewData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
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
      </Dialog>
    </>
  );
};

export default QuoteList;
