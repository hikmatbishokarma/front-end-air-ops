import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { EditRepresentative } from "./edit";
import { CreateRepresentative } from "./create";

const RepresentativeDialog = ({
  dialogOpen,
  handleDialogClose,
  client,
  representativeId = "",
  isEdit = false,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>
        {isEdit ? "Edit" : "Add"} representative for {client?.name}
      </DialogTitle>

      <DialogContent>
        {isEdit ? (
          <EditRepresentative
            client={client}
            id={representativeId}
            handleDialogClose={handleDialogClose}
          />
        ) : (
          <CreateRepresentative
            client={client}
            handleDialogClose={handleDialogClose}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepresentativeDialog;
