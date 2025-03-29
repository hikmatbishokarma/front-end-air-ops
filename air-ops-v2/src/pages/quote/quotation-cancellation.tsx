import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';

type CancellationConfirmationProps = {
onCancellation: (id:string) => void;
  quotationNo: string;
  quotationId:string
};
function QuotationCancellationConfirmation({
  onCancellation,
  quotationNo,
  quotationId
}: CancellationConfirmationProps) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handelCancellation = () => {

   
    setOpen(false);
    onCancellation(quotationId);
  };
  return (
    <div>
      <CancelIcon style={{ color: "red" }} onClick={handleClickOpen} />

      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel {quotationNo}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">No</Button>
          <Button onClick={handelCancellation} color="secondary">Yes</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default QuotationCancellationConfirmation;
