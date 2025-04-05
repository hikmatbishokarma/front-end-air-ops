import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import useGql from "../lib/graphql/gql";
import { GENERATE_QUOTE_PDF } from "../lib/graphql/queries/quote";
import { useSnackbar } from "../SnackbarContext";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FlightQuotePreview = ({ htmlContent, currentId }) => {
  // useEffect(() => {
  //   // Extract styles and apply them to the document head
  //   const tempDiv = document.createElement("div");
  //   tempDiv.innerHTML = htmlContent;
  //   const styleTags = tempDiv.getElementsByTagName("style");

  //   const styleElements = [];

  //   if (styleTags.length > 0) {
  //     const styleContent = styleTags[0].innerHTML;
  //     const styleElement = document.createElement("style");
  //     styleElement.innerHTML = styleContent;
  //     document.head.appendChild(styleElement);
  //   }

  //   return () => {
  //     // Cleanup styles when component unmounts or htmlContent updates
  //     styleElements.forEach((styleElement) => document.head.removeChild(styleElement));
  //   };

  // }, [htmlContent]);

  // const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
  //   ADD_TAGS: ["style"],
  // });

  // const contentRef = useRef<HTMLDivElement>(null);

  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    // Extract styles and apply them to the document head
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const styleTags = tempDiv.getElementsByTagName("style");

    const styleElements: HTMLStyleElement[] = [];

    for (let i = 0; i < styleTags.length; i++) {
      const styleContent = styleTags[i].innerHTML;
      const styleElement = document.createElement("style");
      styleElement.innerHTML = styleContent;
      document.head.appendChild(styleElement);
      styleElements.push(styleElement);
    }

    return () => {
      // Cleanup styles when component unmounts or htmlContent updates
      styleElements.forEach((styleElement) =>
        document.head.removeChild(styleElement),
      );
    };
  }, [htmlContent]);

  const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ["style"],
  });

  const componentRef = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  const handelSendQuoteThroughEmail = async () => {
    const result = await useGql({
      query: GENERATE_QUOTE_PDF,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          id: currentId,
          email: clientEmail,
        },
      },
    });
    setShowEmailDialog(false);
    if (!result) {
      showSnackbar("Internal server error!", "error");
    } else showSnackbar("Quote sent successfully!", "success");
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

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Flight_Quote.pdf");
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
        <IconButton
          color="secondary"
          onClick={() => navigate(`/quotes/edit/${currentId}`)}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton color="primary" onClick={() => setShowEmailDialog(true)}>
          <EmailIcon fontSize="small" />
        </IconButton>

        <IconButton color="primary" onClick={printFn}>
          <PrintIcon fontSize="small" />
        </IconButton>

        <IconButton color="secondary" onClick={handleDownloadPDF}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ padding: 2, overflow: "auto" }}>
        <div
          ref={componentRef}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </Paper>

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
    </Box>
  );
};

export default FlightQuotePreview;
