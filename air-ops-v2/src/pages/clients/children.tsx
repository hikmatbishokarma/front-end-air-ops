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
import {
  Controller,
  Control,
  SubmitHandler,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
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
  visible?: (type: string) => boolean;
}

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormField[];
  defaultValues?: any;
  // setValue: (name: string, value: any) => void; // ✅ Add this
  setValue: UseFormSetValue<any>;
  submitButtonName?: string;
}

const ClientChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
  setValue,
  submitButtonName = "Submit",
}) => {
  const selectedType = useWatch({ control, name: "type" });

  useEffect(() => {
    fields.forEach((field) => {
      if (field.visible && !field.visible(selectedType)) {
        setValue(field.name, "");
      }
    });
  }, [selectedType]);

  return (
    <Box
      className="popup-person-one"
      component="form"
      onSubmit={onSubmit}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
        {fields
          .filter((field) => {
            if (field.visible) {
              return field.visible(selectedType);
            }
            return true;
          })
          .map((field) => (
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
                render={({ field: controllerField, fieldState: { error } }) => {
                  if (field.options) {
                    return (
                      <FormControl component="fieldset" margin="normal">
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
                        // required={field.required} // ✅ this adds the asterisk
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
          {submitButtonName}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientChildren;
