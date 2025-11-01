import React from "react";
import {
  Button,
  Paper,
  Popover,
  Typography,
  Stack,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  PopoverProps,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { Iclient } from "@/features/quotes/types/interfaces";

// 2. Props Interface for FilterPanel
interface FilterPanelProps {
  // Popover props
  open: PopoverProps["open"];
  anchorEl: PopoverProps["anchorEl"];
  onClose: PopoverProps["onClose"];

  // Date Filter State & Handlers
  dateFilterType: string;
  onDateFilterChange: (type: string) => void;

  // Date values use moment.Moment because you are using AdapterMoment
  fromDate: Moment | null;
  toDate: Moment | null;

  // Date change handlers: accept Moment or null (if cleared)
  onFromDateChange: (date: Moment | null) => void;
  onToDateChange: (date: Moment | null) => void;

  // Requester Filter State & Handlers
  requester: Iclient | null | undefined;
  onRequesterChange: (client: Iclient | null) => void;
  clients: Iclient[];

  // Action Handlers
  onApply: () => void;
  onReset: () => void;
}

export default function FilterPanel({
  open,
  anchorEl,
  onClose,
  dateFilterType,
  onDateFilterChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  requester,
  onRequesterChange,
  clients,
  onApply,
  onReset,
}: FilterPanelProps) {
  const handleQuickDateSelect = (type: string) => {
    onDateFilterChange(type);

    if (type !== "custom") {
      onFromDateChange(null);
      onToDateChange(null);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Paper sx={{ p: 2, width: 330 }}>
          <Typography variant="h6" gutterBottom>
            Filter
          </Typography>

          {/* Date Range */}
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

          <Typography variant="subtitle2" gutterBottom>
            Select Range
          </Typography>

          <Stack direction="row" spacing={1} mb={2}>
            <DatePicker
              label="From"
              value={fromDate}
              format="DD-MM-YYYY" // or "MMM DD, YYYY"
              onChange={onFromDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  sx: {
                    minWidth: 150,
                    "& .MuiInputAdornment-root": {
                      marginRight: 0,
                    },
                    "& .MuiIconButton-root": {
                      padding: "4px",
                    },
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
                    "& .MuiInputAdornment-root": {
                      marginRight: 0,
                    },
                    "& .MuiIconButton-root": {
                      padding: "4px",
                    },
                  },
                },
              }}
            />
          </Stack>

          {/* Requester */}
          <Typography variant="subtitle2" gutterBottom>
            Requester
          </Typography>
          <Select
            fullWidth
            size="small"
            value={requester?.id || ""}
            onChange={(e) => {
              const selected =
                clients.find((c) => c.id === e.target.value) || null;
              onRequesterChange(selected);
            }}
            sx={{ mb: 3 }}
          >
            <MenuItem value="">All</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>

          {/* Action Buttons */}
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
