// AccessRequestModal.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress, // For loading spinner
} from "@mui/material";

function AccessRequestModal({
  open,
  onClose,
  documentTitle,
  onRequestAccess,
  isLoading,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="simple-access-request-dialog-title"
    >
      <DialogTitle id="simple-access-request-dialog-title">
        Document: {documentTitle || "This Document"}
      </DialogTitle>
      <DialogContent dividers>
        {" "}
        {/* Using 'dividers' for a clean separation */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          This document requires special access. Please request permission to
          view its full content.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onRequestAccess}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : "Request Access"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccessRequestModal;
