import { Controller, useForm, Control, useWatch } from "react-hook-form";
import { Box, Grid, TextField, Typography } from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Sector } from "../../type/trip.type";

interface StepSectorInfoProps {
  control: Control<any>; // comes from SectorStepper
  sector: Sector; // still needed for source/destination
}

export default function StepSectorInfo({
  control,
  sector,
}: StepSectorInfoProps) {
  const depatureDate = useWatch({
    control,
    name: "depatureDate",
  });

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          {/* Row 1: Source + Destination */}
          <Grid item xs={6}>
            <TextField
              label="Source"
              value={sector?.source?.name}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Destination"
              value={sector.destination?.name}
              fullWidth
              size="small"
              disabled
            />
          </Grid>

          {/* Row 2: Departure Date + Time */}
          <Grid item xs={6}>
            <Controller
              name="depatureDate"
              control={control}
              rules={{ required: "Departure Date is required" }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  format="DD-MM-YYYY"
                  value={field.value ? moment(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? moment(newValue).format("YYYY-MM-DD") : ""
                    )
                  }
                  minDate={moment()}
                  label="Departure Date"
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      size: "small",
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="depatureTime"
              control={control}
              rules={{ required: "Departure Time is required" }}
              render={({ field, fieldState: { error } }) => (
                <TimeField
                  {...field}
                  value={field.value ? moment(field.value, "HH:mm") : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? moment(newValue).format("HH:mm") : ""
                    )
                  }
                  label="Departure Time"
                  size="small"
                  format="HH:mm"
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      size: "small",
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 3: Arrival Date + Time */}
          <Grid item xs={6}>
            <Controller
              name="arrivalDate"
              control={control}
              rules={{ required: "Arrival Date is required" }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  format="DD-MM-YYYY"
                  value={field.value ? moment(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? moment(newValue).format("YYYY-MM-DD") : ""
                    )
                  }
                  label="Arrival Date"
                  minDate={moment(depatureDate) || moment()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!error,
                      helperText: error?.message,
                      required: true,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="arrivalTime"
              control={control}
              rules={{ required: "Arrival Time is required" }}
              render={({ field, fieldState: { error } }) => (
                <TimeField
                  {...field}
                  value={field.value ? moment(field.value, "HH:mm") : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? moment(newValue).format("HH:mm") : ""
                    )
                  }
                  label="Arrival Time"
                  size="small"
                  format="HH:mm"
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      size: "small",
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
}
