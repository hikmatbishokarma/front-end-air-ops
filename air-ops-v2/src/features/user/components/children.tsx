import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import { Controller, Control, SubmitHandler } from "react-hook-form";
import CityAutocomplete from "@/components/city-autocomplete";
import MultiSelectAutoComplete from "@/components/MultiSelectAutoComplete";

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
}

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormField[];
  defaultValues?: any;
}

const UserChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
}) => {
  console.log("fields", fields);
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
                if (field.options && field.name === "city") {
                  return (
                    <CityAutocomplete
                      {...controllerField}
                      label={field.label}
                    />
                  );
                } else if (field.name === "roles" && field.options?.length) {
                  return (
                    <MultiSelectAutoComplete
                      value={controllerField.value || []}
                      onChange={controllerField.onChange}
                      label={field.label}
                      options={field.options}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      error={!!error}
                      helperText={error?.message}
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

export default UserChildren;
