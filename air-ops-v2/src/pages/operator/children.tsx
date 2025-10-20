import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Controller, Control, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import Autocomplete from "@mui/material/Autocomplete";
import CityAutocomplete from "../../components/city-autocomplete";
import FileUpload from "../../components/fileupload";
import MediaUpload from "../../components/MediaUpload";
import { FormFieldProps } from "../../interfaces/common.interface";

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormFieldProps[];
  defaultValues?: any;
}

const OperatorChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
}) => {
  const wrappedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit(e);
  };

  return (
    <Box
      component="form"
      // onSubmit={onSubmit}
      onSubmit={wrappedSubmit}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
        {fields.map((field) => (
          <Grid item xs={field.xs || 6} key={field.name}>
            <Controller
              name={field.name}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
                pattern: field.pattern,
              }}
              render={({ field: controllerField, fieldState: { error } }) => {
                if (field.options && field.name === "city") {
                  return (
                    <CityAutocomplete
                      {...controllerField}
                      label={field.label}
                      error={!!error} // Pass boolean error state
                      helperText={error?.message} // Pass the error message
                    />
                  );
                } else if (field.type == "file") {
                  return (
                    <>
                      <MediaUpload
                        size="small" // Essential for the avatar style
                        accept="image/*"
                        // value={controllerField.value}
                        // onUpload={(url) => controllerField.onChange(url)} // Update form value with uploaded URL
                        value={controllerField.value}
                        onUpload={(fileObject) =>
                          controllerField.onChange(fileObject)
                        }
                        label={field.label}
                        category="profile"
                      />
                      {error && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, display: "block" }}
                        >
                          {error.message}
                        </Typography>
                      )}
                    </>
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
                      InputLabelProps={{ shrink: !!controllerField.value }} // Ensure label shrinks when there's a value
                    />
                  );
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default OperatorChildren;
