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
} from "@mui/material";
import { Controller, Control, SubmitHandler, useWatch } from "react-hook-form";
import FileUpload from "../../components/fileupload";

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
  defaultValues?: any;
}

const SecurityChildren: React.FC<ReusableFormProps> = ({
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
                    <FileUpload
                      size="small"
                      category="securities"
                      //   accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      accept=".pdf"
                      value={controllerField.value}
                      onUpload={(url) => controllerField.onChange(url)}
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

export default SecurityChildren;
