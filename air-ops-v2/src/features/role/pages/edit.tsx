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
import { GET_ROLE_BY_ID, UPDATE_ROLE } from "@/lib/graphql/queries/role";
import useGql from "@/lib/graphql/gql";

import { Action, RoleType } from "./create";
import AddIcon from "@mui/icons-material/Add";
import { removeTypename } from "@/shared/utils";
import { useSnackbar } from "@/app/providers";
import { NAVIGATION } from "../../../AppWithSession";
import { useSession } from "@/app/providers";

interface accessPermission {
  action;
  resource;
}
interface FormData {
  type: string;
  // name: string;
  description: string;
  accessPermissions: accessPermission[];
}

// const resources = NAVIGATION.reduce((acc: any[], item: any) => {
//   if (item.segment) {
//     acc.push({ label: item.title, id: item.segment });
//   }
//   return acc;
// }, []);

const resources = NAVIGATION.reduce((acc: any[], item: any) => {
  // Helper function to strip /app prefix and extract resource name
  const extractResource = (segment: string): string => {
    if (!segment) return "";
    // Remove /app prefix if present
    let resource = segment.startsWith("app/")
      ? segment.replace("app/", "")
      : segment;
    // For nested routes like "app/admin/aircraft", extract the last part
    const parts = resource.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : resource;
  };

  if (item.segment && item?.children?.length > 0) {
    item.children.forEach((child: any) => {
      if (child.segment) {
        const resourceId = extractResource(child.segment);
        acc.push({ label: child.title, id: resourceId });
      }
    });
  }
  if (item.segment) {
    const resourceId = extractResource(item.segment);
    acc.push({ label: item.title, id: resourceId });
  }
  return acc;
}, []);

console.log("resources", resources);

const RoleEdit = () => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const { id } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

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

  const [roleData, setRoleData] = useState<FormData>();

  const fetchRoleById = async (roleId) => {
    const response = await useGql({
      query: GET_ROLE_BY_ID,
      queryName: "role",
      queryType: "query-without-edge",
      variables: { id: roleId },
    });

    if (response) {
      setRoleData(response);
    }
  };

  useEffect(() => {
    fetchRoleById(id);
  }, [id]);

  useEffect(() => {
    if (roleData) {
      setValue("type", roleData.type || "");
      // setValue("name", roleData.name || "");

      // Normalize accessPermissions: strip /app prefix from resources if present
      const normalizedPermissions = (
        removeTypename(roleData.accessPermissions) || []
      ).map((perm: any) => {
        if (perm.resource && perm.resource.startsWith("app/")) {
          // Remove /app prefix and extract resource name
          let resource = perm.resource.replace("app/", "");
          const parts = resource.split("/");
          resource = parts.length > 1 ? parts[parts.length - 1] : resource;
          return { ...perm, resource };
        }
        return perm;
      });

      setValue("accessPermissions", normalizedPermissions);
    }
  }, [roleData, setValue]);

  const updateRole = async (roleId, data) => {
    try {
      const result = await useGql({
        query: UPDATE_ROLE,
        queryType: "mutation",
        queryName: "updateOneRole",
        variables: { input: { id: roleId, update: data } },
      });

      console.log("result::::", result);
      if (result.data) {
        showSnackbar("Role updated successfully!", "success");
      } else {
        showSnackbar("Failed to update!", "success");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      operatorId,
    };
    updateRole(id, formattedData);
    navigate("/app/admin/roles");
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
            <FormControl sx={{ minWidth: 100, width: "100%" }} size="small">
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ""} // Ensure the value is set
                    onChange={(event) => field.onChange(event.target.value)}
                    displayEmpty
                    label="Role"
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
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
          {/* <Grid item xs={5}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  size="small"
                  label="Name"
                  fullWidth
                />
              )}
            />
          </Grid> */}
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
                        value?.id || ""
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
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
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
                                newValue
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
            <AddIcon className="ground-handler" />
          </IconButton>
        </Box>

        {/* Submit Button */}
        <Box
          sx={{ display: "flex", justifyContent: "end", mt: 3, width: "84%" }}
        >
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default RoleEdit;
