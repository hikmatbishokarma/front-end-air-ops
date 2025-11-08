import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  AlertColor,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useGql from "../../lib/graphql/gql";
import { RESET_PASSWORD } from "../../lib/graphql/queries/auth";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";

// Validation Schema
const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = () => {
  const { session } = useSession();

  const showSnackbar = useSnackbar();

  const userId = session?.user?.id;

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const resetPassword = async (userId, formData) => {
    try {
      const data = await useGql({
        query: RESET_PASSWORD,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            userId,
            ...formData,
          },
        },
      });
      if (data?.data?.resetPassword?.status) {
        showSnackbar("User Info updated successfully!", "success");
      } else {
        showSnackbar(data?.errors?.[0]?.message, "error");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const onSubmit = (data: any) => {
    const formData = {
      confirmPwd: data.confirmPassword,
      currentPwd: data.currentPassword,
      newPwd: data.newPassword,
    };
    resetPassword(userId, formData);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Change Password
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Current Password */}
        <TextField
          label="Current Password"
          type={showPassword.current ? "text" : "password"}
          fullWidth
          {...register("currentPassword")}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password */}
        <TextField
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          fullWidth
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          type={showPassword.confirm ? "text" : "password"}
          fullWidth
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Change Password
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
