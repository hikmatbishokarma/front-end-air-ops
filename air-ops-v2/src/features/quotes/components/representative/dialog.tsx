import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { EditRepresentative } from "./edit";
import { CreateRepresentative } from "./create";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Business } from "@mui/icons-material";

const RepresentativeDialog = ({
  dialogOpen,
  handleDialogClose,
  client,
  representativeId = "",
  isEdit = false,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose} className="panel-one">
      <DialogTitle>
        <Typography variant="subtitle2" color="text.secondary">
          Adding representative for
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Business fontSize="small" color="primary" />
          <Chip
            label={client?.name}
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>

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
          <CloseIcon className="ground-handlers" />
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
