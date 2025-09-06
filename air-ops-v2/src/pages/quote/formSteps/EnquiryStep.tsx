// src/quotes/formSteps/EnquiryStep.tsx
import React from "react";
import { Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClientType } from "../../../lib/utils";

const EnquiryStep = ({
  control,
  watchedCategory,
  categoryOptions,
  aircrafts,
  clients,
  representatives,
  selectedClient,
  setSubDialogOpen,
  setRepresentativeDialogOpen,
}) => {
  console.log("aircrafts:::", aircrafts);
  return (
    <Grid container spacing={3}>
      {/* Category Field */}
      <Grid item xs={12} md={6}>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              select
              fullWidth
              label="Category"
              {...field}
              error={!!error}
              helperText={error?.message}
              size="small"
              required
              value={field.value ?? ""}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categoryOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>

      {/* Aircraft Field */}
      <Grid item xs={12} md={6}>
        <Controller
          name="aircraft"
          control={control}
          rules={{ required: "Aircraft is required" }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={aircrafts}
              getOptionLabel={(option) => option.code}
              // value={
              //   field.value
              //     ? aircrafts.find((aircraft) => aircraft.id === field.value)
              //     : null
              // }
              value={field.value || null}
              // onChange={(_, value) => {
              //   field.onChange(value ? value.id : "");
              // }}
              onChange={(_, value) => {
                // We now store the full object in the form state
                field.onChange(value || null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aircraft"
                  placeholder="Select Aircraft"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      {/* Conditional Fields for "CHARTER" Category */}
      {watchedCategory === "CHARTER" && (
        <>
          {/* Enquiry From (Client) Field */}
          <Grid item xs={12} md={6}>
            <Controller
              name="requestedBy"
              control={control}
              rules={{ required: "Enquiry From is required" }}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  options={clients}
                  getOptionLabel={(option) =>
                    `${option.name}${option.lastName ? ` ${option.lastName}` : ""}`
                  }
                  // value={
                  //   // Find the full object based on the stored ID or return null
                  //   field.value
                  //     ? clients.find((c) => c.id === field.value)
                  //     : null
                  // }
                  value={field.value || null}
                  // onChange={(_, newValue) => {
                  //   // Store only the ID in the form state
                  //   field.onChange(newValue ? newValue.id : "");
                  // }}
                  onChange={(_, value) => {
                    // We now store the full object in the form state
                    field.onChange(value || null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Enquiry From"
                      size="small"
                      placeholder="Select Client"
                      InputLabelProps={{ shrink: true }}
                      required
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Add Client Button */}
          <Grid item xs={12} md={6} display="flex" alignItems="center">
            <IconButton
              className="add-icon-v1"
              aria-label="add"
              color="primary"
              onClick={() => setSubDialogOpen(true)}
            >
              <AddIcon />
            </IconButton>
          </Grid>

          {/* Conditional Representative Fields */}
          {selectedClient?.type === ClientType.COMPANY && (
            <>
              {/* Representative Field */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="representative"
                  control={control}
                  rules={{ required: "Representative is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      options={representatives}
                      getOptionLabel={(option) => option.name}
                      value={
                        field.value
                          ? representatives.find(
                              (rep) => rep.id === field.value
                            )
                          : null
                      }
                      onChange={(_, newValue) =>
                        field.onChange(newValue ? newValue.id : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Representative"
                          size="small"
                          placeholder="Select Representative"
                          InputLabelProps={{ shrink: true }}
                          required
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Add Representative Button */}
              <Grid item xs={12} md={6} display="flex" alignItems="center">
                <IconButton
                  className="add-icon-v1"
                  aria-label="add"
                  color="primary"
                  onClick={() => setRepresentativeDialogOpen(true)}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default EnquiryStep;
