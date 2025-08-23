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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

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
        representative for {client?.name}
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
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
      {/* <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Cancel
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default RepresentativeDialog;
