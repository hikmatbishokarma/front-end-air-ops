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
  MenuItem,
} from "@mui/material";
import { Controller, Control, SubmitHandler, useWatch } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import MediaUpload from "@/components/MediaUpload";
import { FormFieldProps } from "@/shared/types/common";

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormFieldProps[];
  defaultValues?: any;
}

const LibraryChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
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
                if (field.type == "upload") {
                  return (
                    <MediaUpload
                      size="medium"
                      category="securities"
                      accept=".pdf,.doc,.docx"
                      // value={controllerField.value}
                      // onUpload={(url) => controllerField.onChange(url)}
                      value={controllerField.value}
                      onUpload={(fileObject) =>
                        controllerField.onChange(fileObject)
                      }
                    />
                  );
                } else if (field.name == "department") {
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
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      InputLabelProps={{
                        shrink: !!controllerField.value,
                        // required: field.required, // ✅ optional: forces asterisk even with custom labels
                      }}
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

export default LibraryChildren;
