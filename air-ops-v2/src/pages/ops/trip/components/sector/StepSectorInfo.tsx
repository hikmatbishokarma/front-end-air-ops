import { Controller, useForm, Control, useWatch } from "react-hook-form";
import { Box, Grid, TextField, Typography } from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Itinerary } from "../../type/trip.type";

// interface StepSectorInfoProps {
//   sector: Itinerary;
//   onChange?: (data: Partial<Itinerary>) => void;
// }

// export default function StepSectorInfo({
//   sector,
//   onChange,
// }: StepSectorInfoProps) {
//   const { control, watch } = useForm({
//     defaultValues: {
//       depatureDate: sector.depatureDate,
//       depatureTime: sector.depatureTime,
//       arrivalDate: sector.arrivalDate,
//       arrivalTime: sector.arrivalTime,
//     },
//   });

//   const depDate = watch("depatureDate");

//   return (
//     <Box>
//       <Typography variant="subtitle1" gutterBottom>
//         Sector Information
//       </Typography>

//       <LocalizationProvider dateAdapter={AdapterMoment}>
//         <Grid container spacing={2}>
//           {/* Row 1: Source + Destination */}
//           <Grid item xs={6}>
//             <TextField
//               label="Source"
//               value={sector.source}
//               fullWidth
//               size="small"
//               disabled
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Destination"
//               value={sector.destination}
//               fullWidth
//               size="small"
//               disabled
//             />
//           </Grid>

//           {/* Row 2: Departure Date + Time */}
//           <Grid item xs={6}>
//             <Controller
//               name="depatureDate"
//               control={control}
//               rules={{ required: "Departure Date is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <DatePicker
//                   {...field}
//                   format="DD-MM-YYYY"
//                   value={field.value ? moment(field.value) : null}
//                   onChange={(newValue) => {
//                     const val = newValue
//                       ? moment(newValue).format("YYYY-MM-DD")
//                       : "";
//                     field.onChange(val);
//                     onChange?.({ depatureDate: val });
//                   }}
//                   minDate={moment()}
//                   label="Departure Date"
//                   slotProps={{
//                     textField: {
//                       required: true,
//                       fullWidth: true,
//                       size: "small",
//                       error: !!error,
//                       helperText: error?.message,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Controller
//               name="depatureTime"
//               control={control}
//               rules={{ required: "Departure Time is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <TimeField
//                   {...field}
//                   value={field.value ? moment(field.value, "HH:mm") : null}
//                   onChange={(newValue) => {
//                     const val = newValue
//                       ? moment(newValue).format("HH:mm")
//                       : "";
//                     field.onChange(val);
//                     onChange?.({ depatureTime: val });
//                   }}
//                   label="Departure Time"
//                   size="small"
//                   format="HH:mm"
//                   slotProps={{
//                     textField: {
//                       required: true,
//                       fullWidth: true,
//                       size: "small",
//                       error: !!error,
//                       helperText: error?.message,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Grid>

//           {/* Row 3: Arrival Date + Time */}
//           <Grid item xs={6}>
//             <Controller
//               name="arrivalDate"
//               control={control}
//               rules={{ required: "Arrival Date is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <DatePicker
//                   {...field}
//                   format="DD-MM-YYYY"
//                   value={field.value ? moment(field.value) : null}
//                   onChange={(newValue) => {
//                     const val = newValue
//                       ? moment(newValue).format("YYYY-MM-DD")
//                       : "";
//                     field.onChange(val);
//                     onChange?.({ arrivalDate: val });
//                   }}
//                   label="Arrival Date"
//                   minDate={depDate ? moment(depDate) : moment()}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       size: "small",
//                       error: !!error,
//                       helperText: error?.message,
//                       required: true,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Controller
//               name="arrivalTime"
//               control={control}
//               rules={{ required: "Arrival Time is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <TimeField
//                   {...field}
//                   value={field.value ? moment(field.value, "HH:mm") : null}
//                   onChange={(newValue) => {
//                     const val = newValue
//                       ? moment(newValue).format("HH:mm")
//                       : "";
//                     field.onChange(val);
//                     onChange?.({ arrivalTime: val });
//                   }}
//                   label="Arrival Time"
//                   size="small"
//                   format="HH:mm"
//                   slotProps={{
//                     textField: {
//                       required: true,
//                       fullWidth: true,
//                       size: "small",
//                       error: !!error,
//                       helperText: error?.message,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//         </Grid>
//       </LocalizationProvider>
//     </Box>
//   );
// }

interface StepSectorInfoProps {
  control: Control<any>; // comes from SectorStepper
  sector: Itinerary; // still needed for source/destination
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
              value={sector.source}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Destination"
              value={sector.destination}
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
