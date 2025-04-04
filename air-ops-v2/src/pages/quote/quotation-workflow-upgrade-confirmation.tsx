import React from "react";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";

type UpgradeConfirmationProps = {
  onUpgrade: (code: string) => void;
  currentState: string;
  code: string;
};
function QuotationWorkflowUpgradeConfirmation({
  onUpgrade,
  currentState,
  code,
}: UpgradeConfirmationProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    setOpen(false);
    onUpgrade(code);
  };
  return (
    <div>
      <UpgradeIcon style={{ color: "green" }} onClick={handleClickOpen} />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Upgrade</DialogTitle>
        <DialogContent>
          {" "}
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to upgrade this quotate
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default QuotationWorkflowUpgradeConfirmation;
