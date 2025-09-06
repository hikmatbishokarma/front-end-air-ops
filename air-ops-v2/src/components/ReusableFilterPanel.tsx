import React from "react";
import {
  Button,
  Paper,
  Popover,
  Typography,
  Stack,
  Grid,
  ToggleButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default function ReusableFilterPanel({
  open,
  anchorEl,
  onClose,
  title = "Filter",
  showDateFilter = true,
  dateFilterType,
  onDateFilterChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  children, // custom fields like requester/client/project etc.
  onApply,
  onReset,
}) {
  const handleQuickDateSelect = (type) => {
    onDateFilterChange?.(type);
    if (type !== "custom") {
      onFromDateChange?.(null);
      onToDateChange?.(null);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Paper sx={{ p: 2, width: 330 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>

          {/* Quick Date Filters */}
          {showDateFilter && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Quick Date Range
              </Typography>
              <Grid container spacing={1} mb={2}>
                {[
                  { label: "Today", value: "today" },
                  { label: "Yesterday", value: "yesterday" },
                  { label: "Last Week", value: "lastWeek" },
                  { label: "Last Month", value: "lastMonth" },
                ].map((option) => (
                  <Grid item xs={6} key={option.value}>
                    <ToggleButton
                      value={option.value}
                      selected={dateFilterType === option.value}
                      onChange={() => handleQuickDateSelect(option.value)}
                      size="small"
                      fullWidth
                      sx={{
                        borderRadius: "6px",
                        textTransform: "none",
                        borderColor:
                          dateFilterType === option.value
                            ? "primary.main"
                            : "grey.300",
                      }}
                    >
                      {option.label}
                    </ToggleButton>
                  </Grid>
                ))}
              </Grid>

              {/* From and To Date Pickers */}
              <Typography variant="subtitle2" gutterBottom>
                Select Range
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <DatePicker
                  label="From"
                  value={fromDate}
                  format="DD-MM-YYYY"
                  onChange={onFromDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        minWidth: 150,
                        "& .MuiInputAdornment-root": { marginRight: 0 },
                        "& .MuiIconButton-root": { padding: "4px" },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="To"
                  value={toDate}
                  format="DD-MM-YYYY"
                  onChange={onToDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        minWidth: 150,
                        "& .MuiInputAdornment-root": { marginRight: 0 },
                        "& .MuiIconButton-root": { padding: "4px" },
                      },
                    },
                  }}
                />
              </Stack>
            </>
          )}

          {/* Custom Fields */}
          {children}

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              className="rest-fiter-btn"
              onClick={onReset}
              variant="outlined"
              size="small"
            >
              Reset
            </Button>
            <Button
              onClick={onApply}
              variant="contained"
              size="small"
              className="fiter-apply"
            >
              Apply
            </Button>
          </Stack>
        </Paper>
      </LocalizationProvider>
    </Popover>
  );
}
