// "use client";
// import * as React from "react";
// import { SignInPage } from "@toolpad/core/SignInPage";
// import type { Session } from "@toolpad/core/AppProvider";
// import { useNavigate } from "react-router";
// import { useSession } from "../SessionContext";
// import { SIGN_IN } from "../lib/graphql/queries/auth";
// import useGql from "../lib/graphql/gql";


// const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
//   try {
//     const data = await useGql({
//       query: SIGN_IN,
//       queryName: "signIn",
//       queryType: "query-without-edge",
//       variables: {
//         input: {
//           userName: formData.get("email"),
//           password: formData.get("password"),
//         },
//       },
//     });

//     if (!data || !data.user) {
//       throw new Error("Invalid credentials.");
//     }

//     return {
//       user: {
//         name: data.user.name,
//         email: data.user.email,
//         image:
//           data.user.image || "https://avatars.githubusercontent.com/u/19550456", // Default image
//       },
//     };
//   } catch (error) {
//     throw new Error("Login failed. Please check your credentials.");
//   }
// };

// export default function SignIn() {
//   const { setSession } = useSession();
//   const navigate = useNavigate();
//   return (
//     <SignInPage
//       providers={[{ id: "credentials", name: "Credentials" }]}
//       signIn={async (provider, formData, callbackUrl) => {
//         console.log("Raw formData:", formData);
//         console.log("formData.entries():", Array.from(formData.entries())); // Check if email/password exist

//         // Demo session
//         try {
//           const session = await fakeAsyncGetSession(formData);
//           if (session) {
//             setSession(session);
//             navigate(callbackUrl || "/", { replace: true });
//             return {};
//           }
//         } catch (error) {
//           return {
//             error: error instanceof Error ? error.message : "An error occurred",
//           };
//         }
//         return {};
//       }}
//     />
//   );
// }


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Grid,
  Typography,
  Link,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import backImg from "../Asset/Images/backimg.jpeg";
import logo from "../Asset/Images/logo.jpeg";
// import { Email,Lock } from "@mui/icons-material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useGql from "../lib/graphql/gql";
import { SIGN_IN } from "../lib/graphql/queries/auth";
import type { Session } from "@toolpad/core/AppProvider";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
   const { setSession } = useSession();
   const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);

const handleTogglePassword = () => {
  setShowPassword((prev) => !prev);
};


const signIn = async (formData: any): Promise<Session> => {
    try {
       
      const data = await useGql({
        query: SIGN_IN,
        queryName: "signIn",
        queryType: "query-without-edge",
        variables: {
          input: {
            userName: formData.email,
            password: formData.password,
          },
        },
      });

     
  
      if (!data || !data.user) {
       
        throw new Error("Invalid credentials.");
      }
  
      return {
        user: {
          name: data.user.name,
          email: data.user.email,
          image:
            data.user.image || "https://avatars.githubusercontent.com/u/19550456", // Default image
        },
      };
    } catch (error) {
       
      throw new Error(error.message||"Login failed. Please check your credentials.");
    }
  };


  const onSubmit = async(data) => {
    try {
    
        const session = await signIn(data);
      console.log("session",session)
        if (session) {
            setSession(session);
            navigate("/", { replace: true });
        }
    } catch (err) {
        
        setApiError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
          <Grid container>
            {/* Left Column (Image) */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                backgroundImage: `url(${backImg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "400px",
              }}
            />

            {/* Right Column (Form) */}
            <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Company Logo */}
                <Box sx={{ mb: 2 }}>
                  <img src={logo} alt="Company Logo" width={80} />
                </Box>

                <Typography component="h1" variant="h5">
                  Login in to your Account 
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: "90%" }}>
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Email Address"
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={typeof errors.email?.message === "string" ? errors.email.message : ""}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                     size="small"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockPersonOutlinedIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleTogglePassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                      }}
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={typeof errors.password?.message === "string" ? errors.password.message : ""}
                  />

                  {/* Remember Me & Forgot Password */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox {...register("rememberMe")} />}
                      label="Remember me"
                    />
                    <Link href="#" variant="body2">
                      Forgot email?
                    </Link>
                  </Box>

                  {/* Login Button */}
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                    Sign In
                  </Button>
                  <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                    Don't have an account? <Link href="/sign-up">Create Account</Link>
                  </Typography>
                   {apiError && <Alert severity="error">{apiError}</Alert>}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
