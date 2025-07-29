import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Controller, Control, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import Autocomplete from "@mui/material/Autocomplete";
import CityAutocomplete from "../../components/city-autocomplete";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
interface FormField {
  name: string;
  label: string;
  type?: string;
  xs?: number;
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  options?: any[];
}

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormField[];
  defaultValues?: any;
  groundHandlerInfoFields: any[];
  addGroundHandler: (item: any) => void;
  removeGroundHandler: (index: number) => void;
  fuelSuppliersFields: any[];
  addFuelSupplier: (item: any) => void;
  removeFuelSupplier: (index: number) => void;
}

const AirportChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
  groundHandlerInfoFields,
  addGroundHandler,
  removeGroundHandler,
  fuelSuppliersFields,
  addFuelSupplier,
  removeFuelSupplier,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          {fields.map((field) => (
            <>
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
                    if (field.name === "city") {
                      return (
                        <CityAutocomplete
                          {...controllerField}
                          label={field.label}
                        />
                      );
                    } else if (field.name === "type") {
                      return (
                        <TextField
                          {...controllerField}
                          select
                          fullWidth
                          size="small"
                          label={field.label}
                          error={!!error}
                          helperText={error?.message}
                        >
                          {field.options?.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                              {option.value}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    } else if (field.type == "time") {
                      return (
                        <TimeField
                          {...controllerField}
                          value={
                            controllerField.value
                              ? moment(controllerField.value, "HH:mm")
                              : null
                          }
                          onChange={(newValue) =>
                            controllerField.onChange(
                              newValue ? moment(newValue).format("HH:mm") : ""
                            )
                          }
                          label={field.label}
                          size="small"
                          format="HH:mm"
                          slotProps={{
                            textField: {
                              // required: true,
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
                          label={field.label}
                          fullWidth
                          type={field.type || "text"}
                          error={!!error}
                          helperText={error?.message}
                          // InputLabelProps={{
                          //   shrink: !!controllerField.value,
                          // }}
                        />
                      );
                  }}
                />
              </Grid>
            </>
          ))}
        </Grid>
        <Grid item xs={12}>
          <h3>Ground Handlers</h3>
          {groundHandlerInfoFields &&
            groundHandlerInfoFields.map((item, index) => (
              <Grid container spacing={2} key={item.id}>
                <Grid item xs={6}>
                  <Controller
                    name={`groundHandlersInfo.${index}.fullName`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`groundHandlersInfo.${index}.companyName`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`groundHandlersInfo.${index}.contactNumber`}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Contact Number"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`groundHandlersInfo.${index}.alternateContactNumber`}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Alternate Contact Number"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`groundHandlersInfo.${index}.email`}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
                  <IconButton aria-label="delete" className="add-icon-v1">
                    <DeleteIcon onClick={() => removeGroundHandler(index)} />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

          <IconButton aria-label="add" className="add-icon-v1">
            <AddIcon
              className="ground-handlers"
              onClick={() =>
                addGroundHandler({
                  fullName: "",
                  companyName: "",
                  contactNumber: "",
                  alternateContactNumber: "",
                  email: "",
                })
              }
            />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <h3>Fuel Suppliers</h3>
          {fuelSuppliersFields &&
            fuelSuppliersFields.map((item, index) => (
              <Grid container spacing={2} key={item.id}>
                <Grid item xs={6}>
                  <Controller
                    name={`fuelSuppliers.${index}.companyName`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`fuelSuppliers.${index}.contactNumber`}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Contact Number"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`fuelSuppliers.${index}.alternateContactNumber`}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Alternate Contact Number"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`fuelSuppliers.${index}.email`}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
                  <IconButton aria-label="delete" className="add-icon-v1">
                    <DeleteIcon onClick={() => removeFuelSupplier(index)} />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

          <IconButton aria-label="add" className="add-icon-v1">
            <AddIcon
              className="ground-handlers"
              onClick={() =>
                addFuelSupplier({
                  companyName: "",
                  contactNumber: "",
                  alternateContactNumber: "",
                  email: "",
                })
              }
            />
          </IconButton>
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

export default AirportChildren;
