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
import { NAVIGATION } from "../../AppWithSession";
import { useSession } from "../../SessionContext";

export enum Action {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum RoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SALES = "SALES",
  OPS = "OPS",
  ENGINEERING = "ENGINEERING",
  AUDIT = "AUDIT",
  ACCOUNTING = "ACCOUNTING",
}

type AccessPermission = {
  action: Action[];
  resource: string;
};

type FormValues = {
  type: string;
  name: string;
  description: string;
  accessPermissions: AccessPermission[];
};

const resources = NAVIGATION.reduce((acc: any[], item: any) => {
  if (item.segment && item?.children?.length > 0) {
    item.children.forEach((child: any) => {
      if (child.segment) {
        acc.push({ label: child.title, id: child.segment });
      }
    });
  }
  if (item.segment) {
    acc.push({ label: item.title, id: item.segment });
  }
  return acc;
}, []);

// Correct way to define props
type ComponentProps = {
  onClose: () => void;
  refreshList: () => void;
};

const RoleCreate: React.FC<ComponentProps> = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: "",
      name: "",
      description: "",
      accessPermissions: [{ resource: "", action: [Action.CREATE] }],
    },
  });

  const [apiError, setApiError] = React.useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accessPermissions",
  });

  const CreateRole = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_ROLE,
        queryName: "",
        queryType: "mutation",
        variables: { input: { role: formData } },
      });

      if (!data || data.errors) {
        throw new Error(data?.errors?.[0]?.message || "Something went wrong");
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      operatorId,
    };

    await CreateRole(formattedData);
    await refreshList();
    onClose();
  };

  const addAccessPermissionRow = () => {
    append({
      resource: "",
      action: [Action.CREATE],
    });
  };

  // Determine the filtered roles based on operatorId presence
  const availableRoles = React.useMemo(() => {
    let roles = Object.keys(RoleType);
    if (operatorId) {
      // If operatorId is present, filter out SUPER_ADMIN
      roles = roles.filter((role) => role !== RoleType.SUPER_ADMIN);
    }
    return roles;
  }, [operatorId]); // Recalculate if operatorId changes

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      {/* Role Type & Name Fields */}
      <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <FormControl sx={{ minWidth: 100, width: "100%" }} size="small">
            <Controller
              name="type"
              control={control}
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <Select {...field} displayEmpty variant="outlined">
                  {availableRoles?.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField {...field} size="small" label="Name" fullWidth />
            )}
          />
        </Grid>
      </Grid>

      {/* Access Permission Rows */}
      {fields.map((field, index) => (
        <Grid
          container
          key={field.id}
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          {/* Resource */}
          <Grid item xs={6}>
            <Controller
              name={`accessPermissions.${index}.resource`}
              control={control}
              rules={{ required: "Label is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  disablePortal
                  options={resources}
                  value={
                    field.value
                      ? resources.find(
                          (resource) => resource.id === field.value
                        )
                      : null
                  }
                  onChange={(_, value) => {
                    field.onChange(value ? value.id : "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Resource" size="small" />
                  )}
                />
              )}
            />
          </Grid>

          {/* Actions (Checkboxes) */}
          <Grid item xs={5.5}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormGroup
                row
                sx={{ flexWrap: "nowrap", justifyContent: "space-between" }}
              >
                {Object.values(Action).map((action) => (
                  <Controller
                    key={action}
                    name={`accessPermissions.${index}.action`}
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
                                : field.value.filter(
                                    (a: string) => a !== action
                                  );
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
              {errors.accessPermissions?.[index]?.action && (
                <p style={{ color: "red" }}>
                  {errors.accessPermissions[index].action.message}
                </p>
              )}
            </FormControl>
          </Grid>

          {/* Delete Button */}
          <Grid item xs={0.5} sx={{ textAlign: "center" }}>
            <IconButton onClick={() => remove(index)} color="error">
              <Delete fontSize="small" className="ground-handlers"/>
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Add Row Button */}
      <Box sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
        <IconButton aria-label="Add" onClick={addAccessPermissionRow}>
          <AddIcon className="ground-handlers"/>
        </IconButton>
      </Box>

      {apiError && <Alert severity="error">{apiError}</Alert>}

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "end", mt: 0 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default RoleCreate;
