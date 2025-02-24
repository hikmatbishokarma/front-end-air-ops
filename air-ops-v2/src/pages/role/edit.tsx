import { Delete } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { GET_ROLE_BY_ID, UPDATE_ROLE } from "../../lib/graphql/queries/role";
import useGql from "../../lib/graphql/gql";
import { NAVIGATION } from "../../App";
import { Action, RoleType } from "./create";
import AddIcon from "@mui/icons-material/Add";

interface accessPermission {
  action;
  resource;
}
interface FormData {
  type: string;
  name: string;
  description: string;
  accessPermissions: accessPermission[];
}

const resources = NAVIGATION.reduce((acc: any[], item: any) => {
  if (item.segment) {
    acc.push({ label: item.title, id: item.segment });
  }
  return acc;
}, []);

const RoleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accessPermissions",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
    const [roleData,setRoleData]=useState<FormData>()

  const fetchRoleById = async (roleId) => {
    const response = await useGql({
      query: GET_ROLE_BY_ID,
      queryName: "role",
      queryType: "query-without-edge",
      variables: { id: roleId },
    });

    if (response) {
      
      setRoleData(response)
    }
  };

  useEffect(() => {
    fetchRoleById(id);
  }, [id]);

  useEffect(() => {
    if (roleData) {
      setValue("type", roleData.type || "");
      setValue("name", roleData.name || "");
      setValue("accessPermissions", roleData.accessPermissions || []);
    }
  }, [roleData, setValue]);

  const updateRole = async (roleId, data) => {
    try {
      const result = await useGql({
        query: UPDATE_ROLE,
        queryType: "mutation",
        queryName: "",
        variables: { input: { id: roleId, update: data } },
      });

      console.log("result:::uuu", result);
      if (result.data) {
        setSnackbarOpen(true);
        setSnackbarMessage("Role updated successfully.");
        setSnackbarSeverity("success");
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to update.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage("Failed to update.");
      setSnackbarSeverity(error.message);
    }
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
    };
    updateRole(id, formattedData);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

    const addAccessPermissionRow = () => {
      append({
        resource: "",
        action: [Action.CREATE],
      });
    };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%", mx: "auto", mt: 4 }}
      >
        {/* Role Type & Name Fields */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={5}>
            {/* <FormControl sx={{ minWidth: 100, width: "100%" }} size="small">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select {...field} displayEmpty>
                    {Object.keys(RoleType)?.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl> */}
            <FormControl sx={{ minWidth: 100, width: "100%" }} size="small">
  <Controller
    name="type"
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        value={field.value || ""} // Ensure the value is set
        onChange={(event) => field.onChange(event.target.value)}
        displayEmpty
label="Type" 
>
        <MenuItem value="" disabled>Select Role</MenuItem>
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
                <TextField {...field}  value={field.value || ""} size="small" label="Name" fullWidth />
              )}
            />
          </Grid>
        </Grid>

        {/* Access Permission Rows */}
        {watch("accessPermissions")?.map((field, index) => (
          <Grid
            container
            key={index}
            spacing={1}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {/* Resource */}
            <Grid item xs={5}>
              <Controller
                name={`accessPermissions.${index}.resource`}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={resources}
                    value={resources.find((r) => r.id === field.value) || null}
                    onChange={(_, value) =>
                      setValue(
                        `accessPermissions.${index}.resource`,
                        value?.id || "",
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Resource" size="small" />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Actions (Checkboxes) */}
            <Grid item xs={4.4}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 , justifyContent:"space-between"}}>
                  {Object.values(Action)?.map((action) => (
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
                                  : field.value.filter((a) => a !== action);
                                setValue(
                                  `accessPermissions.${index}.action`,
                                  newValue,
                                );
                              }}
                            />
                          }
                          label={action.toLocaleLowerCase()}
                        />
                      )}
                    />
                  ))}
                </Box>
            </Grid>

            {/* Delete Button */}
            <Grid item xs={1} sx={{ textAlign: "center" }}>
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

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "end", mt: 3 , width:"84%"}}>
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RoleEdit;
