import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DocumentPreviewDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
  apiBaseUrl?: string;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  url,
  onClose,
  apiBaseUrl = "",
}) => {
  if (!url) return null;

  const fullUrl = `${apiBaseUrl}${url}`;
  let previewType: "pdf" | "doc" | "image" | "other" = "other";

  if (url.endsWith(".pdf")) previewType = "pdf";
  else if (url.endsWith(".doc") || url.endsWith(".docx")) previewType = "doc";
  else if (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg")
  )
    previewType = "image";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Document Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
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
      <DialogContent dividers style={{ height: "80vh" }}>
        {previewType === "pdf" && (
          <iframe
            src={fullUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}

        {previewType === "doc" && (
          <iframe
            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
              fullUrl
            )}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}

        {previewType === "image" && (
          <img
            src={fullUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )}

        {previewType === "other" && <p>Cannot preview this file type.</p>}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
