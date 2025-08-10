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
  getValues: (payload?: string | string[]) => any; // Add this line
}

const ClientChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
  setValue,
  submitButtonName = "Submit",
  getValues,
}) => {
  const selectedType = useWatch({ control, name: "type" });

  useEffect(() => {
    fields.forEach((field) => {
      if (field.visible && !field.visible(selectedType)) {
        setValue(field.name, "");
      }
    });
  }, [selectedType]);

  // This function performs the cross-field validation
  const validateGstWithPan = (gstin, pan) => {
    // Check if both fields have values. If not, don't validate yet.
    if (!gstin || !pan) {
      return true; // Return true to allow other validations to pass
    }
    // Extract the PAN part from the GSTIN (characters at index 2 to 11)
    const panFromGst = gstin.substring(2, 12);
    // Compare the extracted PAN with the entered PAN
    return panFromGst === pan || "GSTIN and PAN do not match.";
  };

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
                  validate: (value) => {
                    // Only run this validation for the gstNo field
                    if (field.name === "gstNo") {
                      const panValue = getValues("panNo");
                      if (panValue && value) {
                        const panFromGst = value.substring(2, 12);
                        return (
                          panFromGst === panValue ||
                          "GSTIN and PAN do not match."
                        );
                      }
                    }
                    return true;
                  },
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
