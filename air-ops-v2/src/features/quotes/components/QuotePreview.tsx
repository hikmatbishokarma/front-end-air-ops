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
import useGql from "@/lib/graphql/gql";
import { SEND_ACKNOWLEDGEMENT } from "@/lib/graphql/queries/quote";
import { useSnackbar } from "@/app/providers";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getEnumKeyByValue, SalesDocumentType } from "@/shared/utils";
import ActionButton from "@/components/ActionButton";

const QuotePreview = ({
  htmlContent,
  currentId,
  currentQuotation,
  showEdit = true,
  showEmail = true,
  showPrint = true,
  showDownload = true,
  showGeneratePI = false,
  onGenerateInvoice,
  currentRecord,
  onPressGeneratePI,
  onPressAddPax,
  onPressGenerateSC,
}) => {
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
        document.head.removeChild(styleElement)
      );
    };
  }, [htmlContent]);

  const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ["style"],
  });

  const componentRef = React.useRef(null);

  return (
    <Box>
      <ActionButton
        currentId={currentId}
        currentQuotation={currentQuotation}
        htmlRef={componentRef}
        documentType="QUOTATION"
        editPath="/app/quotes/edit"
        showEdit={showEdit}
        showEmail={showEmail}
        showPrint={showPrint}
        showDownload={showDownload}
        showGeneratePI={showGeneratePI}
        onGenerateInvoice={onGenerateInvoice}
        currentRecord={currentRecord}
        onPressGeneratePI={onPressGeneratePI}
        onPressAddPax={onPressAddPax}
        onPressGenerateSC={onPressGenerateSC}
      />

      <Paper elevation={3} sx={{ padding: 2, overflow: "auto" }}>
        <div
          ref={componentRef}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </Paper>
    </Box>
  );
};

export default QuotePreview;
