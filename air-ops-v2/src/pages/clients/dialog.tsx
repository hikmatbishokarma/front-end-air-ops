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
  return (
    <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
      <DialogTitle>
        {/* {isEdit ? "Edit" : "Add"} Enquiry From */}
        Enquiry From
        <IconButton
          aria-label="close"
          onClick={handleSubDialogClose}
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
