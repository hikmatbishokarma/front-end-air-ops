// LeaveFilters.tsx
import React from "react";
import { Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { LeaveStatus, LeaveType } from "../../lib/utils";

const leaveTypes = Object.entries(LeaveType).map(([key, value]) => ({
  label: value,
  value: key,
}));

const leaveStatus = Object.entries(LeaveStatus).map(([key, value]) => ({
  label: value,
  value: key,
}));

const LeaveFilters = ({
  filters,
  onChange,
}: {
  filters: { type: string; status: string };
  onChange: (updated: { type: string; status: string }) => void;
}) => {
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
          >
            {leaveStatus.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Leave Type</InputLabel>
          <Select
            label="Leave Type"
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            {leaveTypes.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default LeaveFilters;
