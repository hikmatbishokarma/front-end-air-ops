import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import { useForm, Controller, Control, UseFormSetValue, useWatch } from "react-hook-form";
import { FuelRecordInfo } from "../../type/trip.type";
import MediaUpload from "@/components/MediaUpload";
import { useEffect } from "react";
import {
  LocalizationProvider,
  DatePicker,
  TimeField,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

interface StepFuelProps {
  control: Control<any>; // comes from SectorStepper useForm
  setValue: UseFormSetValue<any>;
}

export default function StepFuel({ control, setValue }: StepFuelProps) {
  const fuelOnArrival = useWatch({ control, name: "fuelRecord.fuelOnArrival" });
  const fuelLoaded = useWatch({ control, name: "fuelRecord.fuelLoaded" });

  useEffect(() => {
    // Only calculate if both values are present
    const arrival = parseFloat(fuelOnArrival) || 0;
    const loaded = parseFloat(fuelLoaded) || 0;

    // Check if values are actually numbers (not NaN) and at least one is non-zero (or just update always?)
    // User asked "calculate fuelGauge by summing fuelOnArrival + fuelLoaded?"
    // We should probably only auto-update if the user hasn't manually overridden it? 
    // But this is a simple auto-calc request. Let's just update it.
    // To avoid loops or overriding manual input too aggressively, maybe we can just set it.

    if (arrival >= 0 || loaded >= 0) {
      setValue("fuelRecord.fuelGauge", (arrival + loaded).toString());
    }
  }, [fuelOnArrival, fuelLoaded, setValue]);

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
                  value={field.value ? moment(field.value) : null}
                  label="Fuel Uploaded Date"
                  // disablePast
                  onChange={(date) => {
                    // Ensure we save ISO string, not the moment object
                    field.onChange(date ? date.toISOString() : null);
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                const displayValue =
                  typeof field.value === "string" && field.value
                    ? { key: field.value, url: field.value }
                    : field.value;

                return (
                  <MediaUpload
                    size="medium"
                    label="Fuel Receipt"
                    category="Fuel Receipt"
                    accept=".pdf,.doc,.docx"
                    value={displayValue}
                    onUpload={(fileObject) => {
                      // Save only the key string to backend
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
