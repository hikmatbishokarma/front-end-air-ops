// components/ReusableDrawer.tsx
import React from "react";
import { Drawer, IconButton, Typography, Box, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  title,
  width = 500,
  children,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: width, p: 2, position: "relative" },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      {title && (
        <>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {children}
    </Drawer>
  );
};

export default CustomDrawer;
