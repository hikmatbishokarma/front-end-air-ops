// LeaveFormDrawer.tsx
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { LeaveType } from "../lib/utils";
import FileUpload from "./fileupload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

type LeaveFormInputs = {
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  attachment?: File | null;
};

type LeaveFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormInputs) => void;
};

const LeaveFormDrawer: React.FC<LeaveFormDrawerProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset } = useForm<LeaveFormInputs>({
    defaultValues: {
      type: undefined,
      fromDate: "",
      toDate: "",
      reason: "",
      attachment: null,
    },
  });

  const handleFormSubmit = (data: LeaveFormInputs) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const leaveOptions = Object.entries(LeaveType).map(([key, value]) => ({
    label: value,
    value: key as LeaveType,
  }));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      keepMounted
      PaperProps={{
        sx: {
          width: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.modal + 10,
        },
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Leave Request</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 3,
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Form fields */}
            <Controller
              name="type"
              control={control}
              rules={{ required: "Leave type is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Leave Type"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                  SelectProps={{
                    MenuProps: { disablePortal: true }, // ✅ fix
                  }}
                >
                  {leaveOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Box display="flex" gap={2}>
              <Controller
                name="fromDate"
                control={control}
                rules={{ required: "From date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="From"
                    format="DD-MM-YYYY"
                    disablePast
                    value={field.value ? moment(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(newValue?.toISOString())
                    }
                    slotProps={{
                      popper: { disablePortal: true },
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="toDate"
                control={control}
                rules={{ required: "To date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="To"
                    format="DD-MM-YYYY"
                    disablePast
                    value={field.value ? moment(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(newValue?.toISOString())
                    }
                    slotProps={{
                      popper: { disablePortal: true },
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Message"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter details here"
                  size="small"
                />
              )}
            />

            <Controller
              name="attachment"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onUpload={(url) => field.onChange(url)}
                  label="Attachment"
                  category="leaves"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onClose}
              sx={{ mr: 2 }}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
};

export default LeaveFormDrawer;
