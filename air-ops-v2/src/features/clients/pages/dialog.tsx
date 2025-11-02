import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { CreateClient } from "./create";
import { EditClient } from "./edit";
import CloseIcon from "@mui/icons-material/Close";

const ClientDialog = ({
  subDialogOpen,
  handleSubDialogClose,
  clientId = "",
  isEdit = false,
}) => {
  console.log("ClientDialog:::", isEdit, clientId);

  console.log("isss", isEdit ? "this is true" : "this is false");
  return (
    <Dialog
      open={subDialogOpen}
      onClose={handleSubDialogClose}
      className="panel-one"
    >
      <DialogTitle>
        {/* {isEdit ? "Edit" : "Add"} Enquiry From */}
        Enquiry From
        <IconButton
          className="popup-quote-model"
          aria-label="close"
          onClick={handleSubDialogClose}
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
        {isEdit ? (
          <EditClient
            id={clientId}
            handleSubDialogClose={handleSubDialogClose}
          />
        ) : (
          <CreateClient handleSubDialogClose={handleSubDialogClose} />
        )}
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleSubDialogClose} color="primary">
          Cancel
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ClientDialog;
