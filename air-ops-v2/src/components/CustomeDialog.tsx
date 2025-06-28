// components/CustomDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  showActions?: boolean;
  width?: string;
  maxWidth?: "sm" | "md" | "lg" | false;
  submitLabel?: string;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  showActions = false,
  width = "600px",
  maxWidth = "md",
  submitLabel = "Generate",
}) => {
  return (
    <Dialog className="panel-one"
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          width,
          maxWidth: "90%",
        },
      }}
    >
      <DialogTitle>
        {title}
        <IconButton className="popup-quote-model"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon className="popup-close-panel"/>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>

      {showActions && (
        <DialogActions>
          <Button onClick={onSubmit} color="primary" variant="contained">
            {submitLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
