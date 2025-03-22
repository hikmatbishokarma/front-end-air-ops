import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { CreateClient } from "./create";
import { EditClient } from "./edit";

const ClientDialog = ({
  subDialogOpen,
  handleSubDialogClose,
  clientId,
  isEdit = false,
}) => {
  return (
    <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
      <DialogTitle>{isEdit ? "Edit" : "Add"} Requested By Details</DialogTitle>
      <DialogContent>
        {isEdit ? <CreateClient /> : <EditClient id={clientId} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubDialogClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDialog;
