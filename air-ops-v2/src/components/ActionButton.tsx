import React, { useState, useCallback } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  CircularProgress,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useGql from "../lib/graphql/gql";
import { SEND_ACKNOWLEDGEMENT } from "../lib/graphql/queries/quote";
import { useSnackbar } from "@/app/providers";
import { getEnumKeyByValue, SalesDocumentType } from "../shared/utils";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { InvoiceConfirmationModal } from "./InvoiceConfirmationModel";
import { useSession } from "@/app/providers";
import axios from "axios";

interface ActionButtonProps {
  currentId: string;
  currentQuotation: any;
  htmlRef: React.MutableRefObject<any>;
  documentType?: string;
  editPath?: string;
  showEdit?: boolean;
  showEmail?: boolean;
  showPrint?: boolean;
  showDownload?: boolean;
  showGeneratePI?: boolean;
  onGenerateInvoice?: ({ type, quotationNo }) => void; // ✅ make optional
  showGenerateTripConfirmation?: boolean;
  handelSaleConfirmation?: ({ quotationNo }) => void; // ✅ make optional
  showGenerateTI?: boolean;
  currentRecord?: any;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ActionButton: React.FC<ActionButtonProps> = ({
  currentId,
  currentQuotation,
  htmlRef,
  documentType = "",
  editPath = "",
  showEdit = true,
  showEmail = true,
  showPrint = true,
  showDownload = true,
  showGeneratePI = false,
  showGenerateTripConfirmation = false,
  showGenerateTI = false,
  onGenerateInvoice,
  handelSaleConfirmation,
  currentRecord,
}) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;
  const operatorName = session?.user.operator?.name || null;

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);

  const [invoiceModelOpen, setInvoiceModelOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState("");

  const [downloading, setDownloading] = useState(false);

  const handelInvoice = (type) => {
    setInvoiceModelOpen(true);
    setInvoiceType(type);
  };

  const validateEmail = (value) => {
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

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const result = await useGql({
        query: SEND_ACKNOWLEDGEMENT,
        queryName: "sendAcknowledgement",
        queryType: "mutation",
        variables: {
          input: {
            quotationNo: currentQuotation,
            email: clientEmail,
            documentType: getEnumKeyByValue(
              SalesDocumentType,
              SalesDocumentType[documentType]
            ),
          },
        },
      });

      setShowEmailDialog(false);
      if (!result) {
        showSnackbar("Internal server error!", "error");
      } else {
        showSnackbar("Email sent successfully!", "success");
      }
    } catch (err) {
      showSnackbar("Internal server error!", "error");
    } finally {
      setLoading(false);
    }
  };

  // const handleDownloadPDF = async () => {
  //   if (!htmlRef.current) return;

  //   const canvas = await html2canvas(htmlRef.current, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`${documentType}_Document.pdf`);
  // };

  const loadImages = () =>
    Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => (img.onload = res))
      )
    );

  // const handleDownloadPDF = async () => {
  //   if (!htmlRef.current) return;
  //   await loadImages(); // ✅ ensure all images are loaded

  //   const canvas = await html2canvas(htmlRef.current, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   const imgWidth = pdfWidth;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   let heightLeft = imgHeight;
  //   let position = 0;

  //   // Add first page
  //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //   heightLeft -= pdfHeight;

  //   // Add more pages if needed
  //   while (heightLeft > 0) {
  //     position = heightLeft - imgHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pdfHeight;
  //   }

  //   pdf.save(
  //     `${currentRecord?.client?.name || operatorName || "Airops"}_${currentQuotation}.pdf`
  //   );
  // };

  const handleDownloadPDF = async () => {
    try {
      const _documentType = SalesDocumentType[documentType];

      setDownloading(true); // start animation
      const response = await axios.get(
        `${apiBaseUrl}api/document/quote/download?quotationNo=${currentQuotation}&documentType=${_documentType}`,
        {
          responseType: "blob", // important for binary data
        }
      );

      // Create a link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${currentRecord?.client?.name || operatorName || "Airops"}_${currentQuotation}.pdf`
      ); // file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Failed to download PDF", err);
    } finally {
      setDownloading(false); // stop animation
    }
  };

  const handleAfterPrint = useCallback(() => {
    console.log("Printed");
  }, []);

  const printFn = useReactToPrint({
    contentRef: htmlRef,
    documentTitle: `${currentRecord?.client?.name || operatorName || "Airops"}${currentQuotation}`,
    onAfterPrint: handleAfterPrint,
  });

  return (
    <>
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
        {showEdit && (
          <IconButton
            color="secondary"
            onClick={() => navigate(`${editPath}/${currentId}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}

        {showEmail && (
          <>
            <IconButton
              color="primary"
              onClick={() => setShowEmailDialog(true)}
            >
              <EmailIcon fontSize="small" />
            </IconButton>

            <Dialog
              className="panel-one"
              open={showEmailDialog}
              onClose={() => setShowEmailDialog(false)}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>
                Send via Email
                <IconButton
                  className="popup-quote-model"
                  aria-label="close"
                  onClick={() => setShowEmailDialog(false)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon className="popup-close-panel" />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Box display="flex" gap={2} alignItems="center">
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleSendEmail}
                            edge="end"
                            color="primary"
                            disabled={!clientEmail || error || loading}
                            size="small"
                          >
                            {loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <SendIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </DialogContent>
            </Dialog>
          </>
        )}

        {showPrint && (
          <IconButton color="primary" onClick={printFn}>
            <PrintIcon fontSize="small" />
          </IconButton>
        )}

        {showDownload && (
          <IconButton
            color="secondary"
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {/* <DownloadIcon fontSize="small" /> */}
            {downloading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DownloadIcon fontSize="small" />
            )}
          </IconButton>
        )}
        {/* {showGeneratePI && (
          <Tooltip
            title={`Generate Proforma Invoice for QuotationNo: ${currentQuotation}`}
            arrow
          >
            <IconButton
              color="info"
              onClick={() => handelInvoice("PROFORMA_INVOICE")}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
        {showGenerateTI && (
          <Tooltip
            title={`Generate Tax Invoice for QuotationNo: ${currentQuotation}`}
            arrow
          >
            <IconButton
              color="info"
              onClick={() =>
                onGenerateInvoice?.({
                  type: "TAX_INVOICE",
                  quotationNo: currentQuotation,
                })
              }
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
        {showGenerateTripConfirmation && (
          <Tooltip
            title={`Generate Sale Confirmation for QuotationNo: ${currentQuotation}`}
            arrow
          >
            <IconButton
              color="info"
              onClick={() =>
                handelSaleConfirmation?.({ quotationNo: currentQuotation })
              }
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )} */}
      </Box>

      <InvoiceConfirmationModal
        open={invoiceModelOpen}
        handelInvoiceModelClose={() => setInvoiceModelOpen(false)}
        onGenerateInvoice={onGenerateInvoice}
        invoiceType={invoiceType}
        currentRecord={currentRecord}
      />
    </>
  );
};

export default ActionButton;
