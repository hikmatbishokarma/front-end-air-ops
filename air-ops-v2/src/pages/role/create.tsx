import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import useGql from "../../lib/graphql/gql";
import AddIcon from "@mui/icons-material/Add";
import { CREATE_ROLE } from "../../lib/graphql/queries/role";

enum Action {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

enum RoleType {
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  SALES = "SALES",
  OPERATOR = "OPERATOR",
  SITE_ADMIN = "SITE ADMIN",
  USER = "USER",
}

type AccessPermission = {
  action: Action[];
  resource: string;
};

type FormValues = {
  roleType: string;
  name: string;
  description: string;
  accessPermission: AccessPermission[];
};

const RoleCreate: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roleType: "",
      name: "",
      description: "",
      accessPermission: [{ resource: "", action: [Action.CREATE] }],
    },
  });
  const [apiError, setApiError] = React.useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accessPermission",
  });

  const CreateRole = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_ROLE,
        queryName: "",
        variables: { input: { role: formData } },
      });

      if (!data || data.errors) {
        throw new Error(data?.errors?.[0]?.message || "Something went wrong");
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  const onSubmit = (data: FormValues) => {


    const formattedData = {
      ...data,
    };

    CreateRole(formattedData);
  };

  const addAccessPermissionRow = () => {
    append({
      resource: "",
      action: [Action.CREATE],
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
    {/* Role Type & Name Fields */}
    <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Grid item xs={5}>
        <FormControl sx={{ minWidth: 100, width: "100%" }} size="small">
          <Controller
            name="roleType"
            control={control}
            render={({ field }) => (
              <Select {...field} displayEmpty>
                {Object.values(RoleType).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} size="small" label="Name" fullWidth />
          )}
        />
      </Grid>
    </Grid>
  
    {/* Access Permission Rows */}
    {fields.map((field, index) => (
      <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mb: 2 }}>
        {/* Resource */}
        <Grid item xs={4}>
          <Controller
            name={`accessPermission.${index}.resource`}
            control={control}
            rules={{ required: "Label is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Resource"
                fullWidth
                size="small"
                error={!!errors.accessPermission?.[index]?.resource}
                helperText={errors.accessPermission?.[index]?.resource?.message}
              />
            )}
          />
        </Grid>
  
        {/* Actions (Checkboxes) */}
        <Grid item xs={6}>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormGroup row sx={{ flexWrap: "nowrap" }}>
              {Object.values(Action).map((action) => (
                <Controller
                  key={action}
                  name={`accessPermission.${index}.action`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{ mr: 1 }}
                      control={
                        <Checkbox
                          checked={field.value.includes(action)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, action]
                              : field.value.filter((a: string) => a !== action);
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label={action.toLocaleLowerCase()}
                    />
                  )}
                />
              ))}
            </FormGroup>
            {errors.accessPermission?.[index]?.action && (
              <p style={{ color: "red" }}>{errors.accessPermission[index].action.message}</p>
            )}
          </FormControl>
        </Grid>
  
        {/* Delete Button */}
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <IconButton onClick={() => remove(index)} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    ))}
  
    {/* Add Row Button */}
    <Box sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
      <IconButton aria-label="Add" onClick={addAccessPermissionRow}>
        <AddIcon />
      </IconButton>
    </Box>
  
    {apiError && <Alert severity="error">{apiError}</Alert>}
  
    {/* Submit Button */}
    <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  </Box>
  
  );
};

export default RoleCreate;
