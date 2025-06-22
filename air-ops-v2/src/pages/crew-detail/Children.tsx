import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller, Control, SubmitHandler, useWatch } from "react-hook-form";
import ReactQuill from "react-quill";
import Autocomplete from "@mui/material/Autocomplete";
import CityAutocomplete from "../../components/city-autocomplete";
import { Certification, Nominee } from "./interface";
import FileUpload from "../../components/fileupload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useGenderOptions } from "../../hooks/useGenderOptions";
import { useMaritalStatusOptions } from "../../hooks/useMaritalStatusOptions";
import { useReligionOptions } from "../../hooks/useReligionOptions";
import { useCountryOptions } from "../../hooks/useCountryOptions";
import { useFormFieldOptions } from "../../hooks/useFormFieldOptions";

interface FormField {
  name: string;
  label: string;
  type?: string;
  xs?: number;
  options?: any[];
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  optionsKey?: string;
}

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormField[];
  certFields: any[];
  addCert: (item: Certification) => void;
  removeCert: (index: number) => void;
  nomineeFields: any[];
  addNominee: (item: Nominee) => void;
  removeNominee: (index: number) => void;
}

const CrewDetailChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
  certFields,
  addCert,
  removeCert,
  nomineeFields,
  addNominee,
  removeNominee,
}) => {
  const fieldOptions = useFormFieldOptions();
  const genderOptions = useGenderOptions();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
                  label="Profile"
                  category="profile"
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <CityAutocomplete {...field} label="Work Location" />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="type"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  error={!!error}
                >
                  <InputLabel id="type-label">Crew Type</InputLabel>
                  <Select labelId="type-label" label="Crew Type" {...field}>
                    <MenuItem value="DOCTOR">Doctor</MenuItem>
                    <MenuItem value="ENGINEER">Engineer</MenuItem>
                    <MenuItem value="PILOT">Pilot</MenuItem>
                    <MenuItem value="CABIN_CREW">Cabin Crew</MenuItem>
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>

        <h3>User Details</h3>
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          {fields.map((field) => {
            const { name, label, type, required, pattern, optionsKey } = field;

            const options = optionsKey ? fieldOptions[optionsKey] : undefined;

            return (
              <Grid item xs={field.xs || 6} key={field.name}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    pattern: field.pattern,
                  }}
                  render={({
                    field: controllerField,
                    fieldState: { error },
                  }) => {
                    if (type === "select") {
                      return (
                        <FormControl
                          fullWidth
                          component="fieldset"
                          error={!!error}
                          size="small"
                          variant="outlined"
                        >
                          <InputLabel id={name}>{label}</InputLabel>
                          <Select
                            labelId={name}
                            label={label}
                            {...controllerField}
                          >
                            {options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && (
                            <FormHelperText>{error.message}</FormHelperText>
                          )}
                        </FormControl>
                      );
                    } else if (field?.type == "date") {
                      return (
                        <DatePicker
                          {...controllerField}
                          label={field.label}
                          format="DD-MM-YYYY"
                          value={
                            controllerField.value
                              ? moment(controllerField.value)
                              : null
                          }
                          onChange={(newValue) =>
                            controllerField.onChange(newValue)
                          }
                          maxDate={moment()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      );
                    } else
                      return (
                        <TextField
                          {...controllerField}
                          size="small"
                          // label={field.label}
                          label={field.label}
                          fullWidth
                          type={field.type || "text"}
                          error={!!error}
                          helperText={error?.message}
                          InputLabelProps={{
                            shrink: !!controllerField.value,
                          }}
                        />
                      );
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <h3>Certifications</h3>
          {certFields &&
            certFields.map((item, index) => (
              <Grid container spacing={2} key={item.id}>
                <Grid item xs={4}>
                  <Controller
                    name={`certifications.${index}.certification`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Certification"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`certifications.${index}.validTill`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="ValidTill"
                        format="DD-MM-YYYY"
                        value={field.value ? moment(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        minDate={moment()}
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
                <Grid item xs={4}>
                  <Controller
                    name={`certifications.${index}.uploadCertificate`}
                    control={control}
                    render={({ field }) => (
                      // <FileUpload
                      //   value={field.value}
                      //   size="medium"
                      //   onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
                      //   label="upload certification"
                      //   category="certification"
                      // />
                      <FileUpload
                        size="small"
                        category="certifications"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        value={field.value}
                        onUpload={(url) => field.onChange(url)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button color="error" onClick={() => removeCert(index)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
          <Button
            onClick={() => addCert({ certification: "", validTill: "" })}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Add Certification
          </Button>
        </Grid>

        {/* Nominees */}
        <Grid item xs={12}>
          <h3>Nominees</h3>
          {nomineeFields.map((item, index) => (
            <Grid container spacing={2} key={item.id}>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.fullName`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.gender`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      component="fieldset"
                      error={!!error}
                      size="small"
                      variant="outlined" // ✅ this is needed
                    >
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select labelId="gender-label" label="Gender" {...field}>
                        {genderOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.relation`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Relation"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.idProof`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID Proof"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.mobileNumber`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mobile Number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`nominees.${index}.alternateContact`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Alternate Contact No"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Button color="error" onClick={() => removeNominee(index)}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={() =>
              addNominee({
                fullName: "",
                gender: "",
                relation: "",
                idProof: "",
                mobileNumber: "",
                alternateContact: "",
              })
            }
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Add Nominee
          </Button>
        </Grid>
      </LocalizationProvider>

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CrewDetailChildren;
