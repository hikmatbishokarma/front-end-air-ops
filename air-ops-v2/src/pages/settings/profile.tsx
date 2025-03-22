import {
  Alert,
  Snackbar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  AlertColor,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { GET_USER_BY_ID, UPDATE_USER } from "../../lib/graphql/queries/user";
import { useSession } from "../../SessionContext";
import "../main.css";
import { useSnackbar } from "../../SnackbarContext";
import CityAutocomplete from "../../components/city-autocomplete";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pinCode: string;
  image: string;
  dob: string;
  gender: string;
}

export const UserProfile = () => {
  const { session } = useSession();
  const showSnackbar = useSnackbar();

  const userId = session?.user?.id;
  const [userInfo, setUserInfo] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<FormData>();

  const userById = async (userId) => {
    const response = await useGql({
      query: GET_USER_BY_ID,
      queryName: "user",
      queryType: "query-without-edge",
      variables: { id: userId },
    });

    if (response) {
      setValue("name", response.name);
      setValue("email", response.email);
      setValue("phone", response.phone);
      setValue("dob", response.dob);
      setValue("gender", response.gender);
      setValue("address", response.address);
      setValue("city", response.city);
      setValue("pinCode", response.pinCode);
      reset({ gender: response.gender });
      setUserInfo(response);
    }
  };

  useEffect(() => {
    userById(userId);
  }, [userId, reset]);

  const updateUserProfile = async (id, data) => {
    try {
      const result = await useGql({
        query: UPDATE_USER,
        queryType: "mutation",
        queryName: "",
        variables: { input: { id, update: data } },
      });

      if (result.data) {
        showSnackbar("User Info updated successfully!", "success");
      } else {
        showSnackbar("Failed to update!", "error");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };
  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
    };
    updateUserProfile(userId, formattedData);
  };

  return (
    <div
      className="profile_pge"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className="leftSide">
        <Card
          sx={{ maxWidth: 780, borderRadius: 3, boxShadow: 3, padding: "20px" }}
        >
          <h2>General information</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label htmlFor="Name">Name</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  {...register("name", { required: "name is required" })}
                />
              </Grid>
              {/* <Grid item xs={6}>
              <label htmlFor="Last Name">Last Name</label>
              <TextField
                fullWidth
                 size="small"
                variant="outlined"
                {...register("lastName", { required: "Last name is required" })}
              />
            </Grid> */}
              <Grid item xs={6}>
                <label htmlFor="Email">Email</label>
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  variant="outlined"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Phone">Phone</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="tel"
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Birthday">Birthday</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("dob")}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Gender">Gender</label>

                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} fullWidth size="small">
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h2>Address</h2>
              </Grid>
              <Grid item xs={10}>
                <label htmlFor="Address">Address</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="address"
                  {...register("address")}
                />
              </Grid>
              <Grid item xs={2}>
                <label htmlFor="ZIP">ZIP</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="zip"
                  {...register("pinCode", {
                    pattern: {
                      value: /^[0-9]{5,6}$/,
                      message: "Invalid ZIP code",
                    },
                  })}
                  error={!!errors.pinCode}
                  helperText={errors.pinCode?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="City">City</label>
                {/* <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="city"
                  {...register("city")}
                /> */}
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <CityAutocomplete {...field} label="City" />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Save All
            </Button>
          </form>
        </Card>
      </div>
      <div className="rightSide">
        <Card
          sx={{
            maxWidth: 350,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              backgroundImage: "url(https://source.unsplash.com/random)",
              height: 100,
              backgroundSize: "cover",
            }}
          />
          <Avatar
            src="https://source.unsplash.com/100x100/?portrait"
            sx={{
              width: 80,
              height: 80,
              margin: "-40px auto 10px",
              border: "4px solid white",
            }}
          />
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {userInfo?.role?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userInfo?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userInfo?.city}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
