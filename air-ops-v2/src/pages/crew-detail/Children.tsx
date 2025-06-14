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
import { Certification, Nominee } from "./interface";

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
                    <FormControl component="fieldset" margin="normal">
                      <RadioGroup
                        row
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        onBlur={controllerField.onBlur}
                      >
                        <FormControlLabel
                          value="MALE"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="FEMALE"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="Other"
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
                      label={field.label}
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

      {/* Certifications */}
      <Grid item xs={12}>
        <h3>Certifications</h3>
        {certFields.map((item, index) => (
          <Grid container spacing={2} key={item.id}>
            <Grid item xs={4}>
              <Controller
                name={`certifications.${index}.certification`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Certification"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name={`certifications.${index}.validTill`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valid Till"
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
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
                render={({ field }) => (
                  <TextField {...field} label="Gender" fullWidth size="small" />
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

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CrewDetailChildren;
