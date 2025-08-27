import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import { useForm, Controller, Control } from "react-hook-form";
import { FuelRecordInfo } from "../../type/trip.type";
import MediaUpload from "../../../../../components/MediaUpload";
import {
  LocalizationProvider,
  DatePicker,
  TimeField,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface StepFuelProps {
  control: Control<any>; // comes from SectorStepper useForm
}

export default function StepFuel({ control }: StepFuelProps) {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.fuelStation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Fuel Station"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.uploadedDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  {...field}
                  label="Fuel Uploaded Date"
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

          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.fuelOnArrival"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Fuel On Arrival"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.fuelLoaded"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Fuel Loaded"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.fuelGauge"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Fuel Gauge"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.handledBy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Handled By"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.designation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Designation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fuel.fuelReceipt"
              control={control}
              render={({ field }) => (
                // <TextField
                //   {...field}
                //   size="small"
                //   label="Fuel Receipt (File URL)"
                //   fullWidth
                // />
                <MediaUpload
                  size="medium"
                  label="Fuel Receipt"
                  category="Fuel Receipt"
                  accept=".pdf,.doc,.docx"
                  value={field.value}
                  onUpload={(url) => field.onChange(url)}
                />
              )}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
}
