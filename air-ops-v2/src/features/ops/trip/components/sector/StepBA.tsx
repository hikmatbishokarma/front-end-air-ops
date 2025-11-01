import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Control, Controller, useFieldArray } from "react-hook-form";
import MediaUpload from "@/components/MediaUpload";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { BaInfo } from "../../type/trip.type";

interface BaFormValues {
  baInfo: BaInfo;
}

interface StepBADetailsProps {
  control: Control<BaFormValues>;
}

export default function StepBADetails({ control }: StepBADetailsProps) {
  // Field array for the main BA details table
  const {
    fields: baDetailFields,
    append: appendBaDetail,
    remove: removeBaDetail,
  } = useFieldArray({
    control,
    name: "baInfo.baPersons",
  });

  // Field array for the BA Reports table
  const {
    fields: baReportFields,
    append: appendBaReport,
    remove: removeBaReport,
  } = useFieldArray({
    control,
    name: "baInfo.baReports",
  });

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {/* BA Machine */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="baInfo.baMachine"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="BA Machine"
                  size="small"
                  fullWidth
                  placeholder="ABVCX - 200"
                />
              )}
            />
          </Grid>
        </Grid>

        {/* BA Details List (Dynamic) */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          BA Checked By:
        </Typography>
        {baDetailFields.map((item, index) => (
          <Grid
            container
            spacing={2}
            key={item.id}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Grid item xs={12} sm={3}>
              <Controller
                name={`baInfo.baPersons.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Name" size="small" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller
                name={`baInfo.baPersons.${index}.gender`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller
                name={`baInfo.baPersons.${index}.age`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Age"
                    type="number"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`baInfo.baPersons.${index}.certNo`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cert.No"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => removeBaDetail(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <IconButton
          onClick={() =>
            appendBaDetail({ name: "", gender: "", age: "", certNo: "" })
          }
          color="error"
        >
          <AddIcon />
        </IconButton>

        {/* BA Reports List (Dynamic) */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          BA Reports:
        </Typography>
        {baReportFields.map((item, index) => (
          <Box
            component={Paper}
            elevation={3}
            sx={{ p: 2, mb: 2 }}
            key={item.id}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="subtitle1">Report {index + 1}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`baInfo.baReports.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Name" size="small" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`baInfo.baReports.${index}.reading`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reading"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`baInfo.baReports.${index}.conductedDate`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DateTimePicker
                      {...field}
                      label="BA Conducted Date & Time"
                      slotProps={{
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`baInfo.baReports.${index}.record`}
                  control={control}
                  render={({ field }) => (
                    <MediaUpload
                      size="medium"
                      label="BA Record"
                      category="Trip Detail Reports"
                      accept=".mp3,.wav,.pdf"
                      // value={field.value}
                      // onUpload={(url) => field.onChange(url)}
                      value={field.value}
                      onUpload={(fileObject) => field.onChange(fileObject)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`baInfo.baReports.${index}.video`}
                  control={control}
                  render={({ field }) => (
                    <MediaUpload
                      size="medium"
                      label="BA Video"
                      category="Trip Detail Reports"
                      accept=".mp4,.mov,.avi"
                      // value={field.value}
                      // onUpload={(url) => field.onChange(url)}
                      value={field.value}
                      onUpload={(fileObject) => field.onChange(fileObject)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <IconButton onClick={() => removeBaReport(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        {/* <Button
          startIcon={<AddIcon />}
          onClick={() =>
            appendBaReport({
              name: "",
              reading: "",
              conductedDate: "",
              record: "",
              video: "",
            })
          }
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Add Report
        </Button> */}

        <IconButton
          onClick={() =>
            appendBaReport({
              name: "",
              reading: "",
              conductedDate: null,
              record: null,
              video: null,
            })
          }
          color="error"
        >
          <AddIcon />
        </IconButton>
      </LocalizationProvider>
    </Box>
  );
}
