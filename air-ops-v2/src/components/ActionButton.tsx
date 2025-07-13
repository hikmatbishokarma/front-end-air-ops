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
import { useSnackbar } from "../SnackbarContext";
import { getEnumKeyByValue, SalesDocumentType } from "../lib/utils";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

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
}

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
}) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);

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
        queryName: "",
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
        showSnackbar("Quote sent successfully!", "success");
      }
    } catch (err) {
      showSnackbar("Internal server error!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!htmlRef.current) return;

    const canvas = await html2canvas(htmlRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${documentType}_Document.pdf`);
  };

  const handleAfterPrint = useCallback(() => {
    console.log("Printed");
  }, []);

  const printFn = useReactToPrint({
    contentRef: htmlRef,
    documentTitle: `${documentType}_Preview`,
    onAfterPrint: handleAfterPrint,
  });

  return (
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
          <IconButton color="primary" onClick={() => setShowEmailDialog(true)}>
            <EmailIcon fontSize="small" />
          </IconButton>

          <Dialog
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
        <IconButton color="secondary" onClick={handleDownloadPDF}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      )}
      {showGeneratePI && (
        <Tooltip
          title={`Generate Proforma Invoice for QuotationNo: ${currentQuotation}`}
          arrow
        >
          <IconButton
            color="info"
            onClick={() =>
              onGenerateInvoice?.({
                type: "PROFORMA_INVOICE",
                quotationNo: currentQuotation,
              })
            }
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
      )}
    </Box>
  );
};

export default ActionButton;
