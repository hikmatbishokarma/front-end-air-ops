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
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import useGql from "../../lib/graphql/gql";
import { RESET_PASSWORD } from "../../lib/graphql/queries/auth";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";

// Enhanced Validation Schema
const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

// Password strength calculator
const calculatePasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;

  if (strength <= 2) return { strength: 20, label: "Weak", color: "#f44336" };
  if (strength === 3) return { strength: 40, label: "Fair", color: "#ff9800" };
  if (strength === 4) return { strength: 70, label: "Good", color: "#2196f3" };
  return { strength: 100, label: "Strong", color: "#4caf50" };
};

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
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchNewPassword = watch("newPassword", "");
  const watchConfirmPassword = watch("confirmPassword", "");
  const watchCurrentPassword = watch("currentPassword", "");
  const passwordStrength = calculatePasswordStrength(watchNewPassword);

  const passwordRequirements = [
    { label: "At least 8 characters", test: watchNewPassword.length >= 8 },
    { label: "One lowercase letter (a-z)", test: /[a-z]/.test(watchNewPassword) },
    { label: "One uppercase letter (A-Z)", test: /[A-Z]/.test(watchNewPassword) },
    { label: "One number (0-9)", test: /[0-9]/.test(watchNewPassword) },
    { label: "One special character (@$!%*?&#)", test: /[@$!%*?&#]/.test(watchNewPassword) },
  ];

  // Check if all password requirements are met
  const allRequirementsMet = passwordRequirements.every(req => req.test);

  // Check if passwords match
  const passwordsMatch = watchNewPassword && watchConfirmPassword && watchNewPassword === watchConfirmPassword;

  // Button should be enabled only when all conditions are met
  const isFormValid =
    watchCurrentPassword &&
    watchNewPassword &&
    watchConfirmPassword &&
    allRequirementsMet &&
    passwordsMatch &&
    Object.keys(errors).length === 0;

  const resetPassword = async (userId: string, formData: any) => {
    try {
      const data = await useGql({
        query: RESET_PASSWORD,
        queryName: "resetPassword",
        queryType: "mutation",
        variables: {
          input: {
            userId,
            ...formData,
          },
        },
      });

      console.log("ressss", data);

      if (data?.status) {
        showSnackbar("Password changed successfully!", "success");
        reset();
        // Reset password visibility states
        setShowPassword({
          current: false,
          new: false,
          confirm: false,
        });
      } else {
        showSnackbar(data?.errors?.[0]?.message || "Failed to change password", "error");
      }
    } catch (error: any) {
      showSnackbar(error.message || "An error occurred", "error");
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
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Illustration */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm3 10c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"
                  fill="white"
                />
              </svg>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a strong password to protect your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {/* Current Password */}
            <TextField
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              fullWidth
              {...register("currentPassword")}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              sx={{ mb: 3 }}
              autoComplete="off"
              inputProps={{
                autoComplete: "off",
                readOnly: true,
                onFocus: (e: any) => e.target.removeAttribute('readonly'),
              }}
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
                      edge="end"
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
              autoComplete="off"
              inputProps={{
                autoComplete: "off",
                readOnly: true,
                onFocus: (e: any) => e.target.removeAttribute('readonly'),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                      }
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {watchNewPassword && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Password Strength
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.strength}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: passwordStrength.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            {/* Password Requirements Checklist */}
            {watchNewPassword && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  borderColor: "#d0d0d0",
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: "#000000", mb: 1 }}>
                  Password Requirements:
                </Typography>
                <List dense disablePadding>
                  {passwordRequirements.map((req, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {req.test ? (
                          <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
                        ) : (
                          <Cancel sx={{ fontSize: 18, color: "#9e9e9e" }} />
                        )}
                      </ListItemIcon>
                      <Typography
                        variant="body2"
                        sx={{
                          color: req.test ? "#2e7d32" : "#000000",
                          fontWeight: req.test ? 700 : 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {req.label}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* Confirm Password */}
            <TextField
              label="Confirm New Password"
              type={showPassword.confirm ? "text" : "password"}
              fullWidth
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: passwordsMatch && watchConfirmPassword ? '#4caf50' : undefined,
                    borderWidth: passwordsMatch && watchConfirmPassword ? '2px' : '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: passwordsMatch && watchConfirmPassword ? '#4caf50' : undefined,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: passwordsMatch && watchConfirmPassword ? '#4caf50' : undefined,
                  },
                },
              }}
              autoComplete="off"
              inputProps={{
                autoComplete: "off",
                readOnly: true,
                onFocus: (e: any) => e.target.removeAttribute('readonly'),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {passwordsMatch && watchConfirmPassword && (
                      <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                    )}
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!isFormValid}
              sx={{
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                  boxShadow: "none",
                },
              }}
            >
              Change Password
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePassword;
