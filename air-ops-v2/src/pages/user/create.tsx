import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Autocomplete } from "@mui/material";
import { GET_ROLES } from "../../lib/graphql/queries/role";
import useGql from "../../lib/graphql/gql";

interface FormData {
  name: string;
  email: string;
  phone: string;
  addresses: string;
  image: string;
  role: string;
}

const UserCreate: React.FC = () => {
  const { handleSubmit, control, formState: { errors } } = useForm<FormData>();

  const [roles,setRoles]=useState<any>()

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const getRoles = async () => {
    try {
      const data = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query",
        variables:  {},
      });
      setRoles(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
    useEffect(() => {
    
        getRoles();
    }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px", margin: "auto" }}>
      {/* Name Field */}
      <Controller
        name="name"
        control={control}
   
        rules={{ required: "Name is required" }}
        render={({ field }) => <TextField {...field} size="small" label="Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />}
      />

      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" } }}
        render={({ field }) => <TextField {...field} size="small"  label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />}
      />

      {/* Phone Field */}
      <Controller
        name="phone"
        control={control}
        rules={{ required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" } }}
        render={({ field }) => <TextField {...field} size="small"  label="Phone" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />}
      />

      {/* Address Field */}
      <Controller
        name="addresses"
        control={control}
        rules={{ required: "Address is required" }}
        render={({ field }) => <TextField {...field} size="small"  label="Address" fullWidth multiline error={!!errors.addresses} helperText={errors.addresses?.message} />}
      />

      {/* Image Field */}
      <Controller
        name="image"
        control={control}
        rules={{ required: "Image URL is required" }}
        render={({ field }) => <TextField {...field} size="small"  label="Image URL" fullWidth error={!!errors.image} helperText={errors.image?.message} />}
      />


      {/* Role Field */}
      {/* <Controller
        name="role"
        control={control}
        rules={{ required: "Role is required" }}
        render={({ field }) => <TextField {...field} size="small"  label="Role" fullWidth error={!!errors.role} helperText={errors.role?.message} />}
      /> */}

       <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={roles}
                              getOptionLabel={(option) => option.name}
                              value={
                                field.value
                                  ? roles.find(
                                      (aircraft) => aircraft.id === field.value,
                                    )
                                  : null
                              }
                              onChange={(_, value) => {
                                field.onChange(value ? value.id : "");
                              }}
                              renderInput={(params) => (
                                <TextField {...params} size="small" />
                              )}
                            />
                          )}
                        />

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
    </form>
  );
};

export default UserCreate;
