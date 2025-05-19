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
import ReactQuill from "react-quill";
import Autocomplete from "@mui/material/Autocomplete";
import CityAutocomplete from "../../components/city-autocomplete";

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

const ClientChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
}) => {
  const selectedType = useWatch({ control, name: "type" });

  console.log("selectedType:::", selectedType);

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
                if (field.options) {
                  return (
                    // <FormControl component="fieldset" margin="normal">
                    //   <FormLabel component="legend">Select Type</FormLabel>
                    //   <RadioGroup
                    //     {...field}
                    //     row // Makes the radio buttons appear in a row
                    //   >
                    //     <FormControlLabel
                    //       value="COMPANY"
                    //       control={<Radio />}
                    //       label="Company"
                    //     />
                    //     <FormControlLabel
                    //       value="PERSON"
                    //       control={<Radio />}
                    //       label="Person"
                    //     />
                    //   </RadioGroup>
                    // </FormControl>
                    <FormControl component="fieldset" margin="normal">
                      {/* <FormLabel component="legend">Select Type</FormLabel> */}
                      <RadioGroup
                        row
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        onBlur={controllerField.onBlur}
                      >
                        <FormControlLabel
                          value="COMPANY"
                          control={<Radio />}
                          label="Company"
                        />
                        <FormControlLabel
                          value="PERSON"
                          control={<Radio />}
                          label="Person"
                        />
                      </RadioGroup>
                    </FormControl>
                  );
                } else
                  return (
                    <TextField
                      {...controllerField}
                      size="small"
                      // label={field.label}
                      label={
                        field.name === "name"
                          ? selectedType === "COMPANY"
                            ? "Company Name"
                            : "Name"
                          : field.label
                      }
                      fullWidth
                      type={field.type || "text"}
                      error={!!error}
                      helperText={error?.message}
                      required={field.required} // ✅ this adds the asterisk
                      InputLabelProps={{
                        shrink: !!controllerField.value,
                        required: field.required, // ✅ optional: forces asterisk even with custom labels
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

export default ClientChildren;
