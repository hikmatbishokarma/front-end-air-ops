import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import { useForm, Controller, Control } from "react-hook-form";
import { FuelRecordInfo } from "../../type/trip.type";
import MediaUpload from "@/components/MediaUpload";
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
              name="fuelRecord.fuelStation"
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
              name="fuelRecord.uploadedDate"
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
              name="fuelRecord.fuelOnArrival"
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
              name="fuelRecord.fuelLoaded"
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
              name="fuelRecord.fuelGauge"
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
              name="fuelRecord.handledBy"
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
              name="fuelRecord.designation"
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
              name="fuelRecord.fuelReceipt"
              control={control}
              render={({ field }) => {
                // Convert string (key from backend) to object for MediaUpload display
                // Backend stores fuelReceipt as string (key), but MediaUpload expects FileObject
                const displayValue =
                  typeof field.value === "string" && field.value
                    ? { key: field.value, url: field.value } // Convert string to object
                    : field.value; // If already object or null, use as is

                return (
                  <MediaUpload
                    size="medium"
                    label="Fuel Receipt"
                    category="Fuel Receipt"
                    accept=".pdf,.doc,.docx"
                    value={displayValue} // Pass object to MediaUpload
                    onUpload={(fileObject) => {
                      // Save only the key string to backend (not the full object)
                      const keyValue = fileObject?.key || null;
                      field.onChange(keyValue);
                    }}
                  />
                );
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
}
