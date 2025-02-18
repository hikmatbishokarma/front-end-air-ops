import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
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
import { Email, Lock, Visibility, VisibilityOff, Person, CheckCircle } from "@mui/icons-material";
import backImg from "../Asset/Images/backimg.jpeg";
import logo from "../Asset/Images/logo.jpeg";
import useGql from "../lib/graphql/gql";
import { SIGN_UP } from "../lib/graphql/queries/auth";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
 const [apiError, setApiError] = useState(null);
 const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };



  const signUp = async (formData: any) => {
    try {
       
      const data = await useGql({
        query: SIGN_UP,
        queryName: "",
        queryType:"mutation",
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
            name:formData.name,
          },
        },
      });

      console.log("data:::",data)

      if (!data) {
        throw new Error("SignUp Failed");
      }
  
      return data;
    } catch (error) {
       
      throw new Error(error.message||"SignUp Failed");
    }
  };

  const onSubmit = async(data) => {
    try {
    
        const result = await signUp(data);
      
        if (result) {
            setIsSignUpSuccess(true)
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
        <Paper elevation={6} sx={{ borderRadius: 5, overflow: "hidden", boxShadow: 4 }}>
        {isSignUpSuccess?( 
            <Box sx={{ textAlign: "center", p: 5 }}>
              <CheckCircle color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h4" sx={{ mt: 2 }}>Thank You!</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>Your account has been successfully created.</Typography>
              <Button variant="contained" sx={{ mt: 3 }} href="/sign-in">
                Go to Sign In
              </Button>
            </Box>
            ):
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
                minHeight: "500px",
              }}
            />

            {/* Right Column (Form) */}
            <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Company Logo */}
                <Box sx={{ mb: 3 }}>
                  <img src={logo} alt="Company Logo" width={100} />
                </Box>

                <Typography component="h1" variant="h4">
                  Sign Up
                </Typography>


                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: "100%" }}>
                  {/* Name Field */}
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={typeof errors.name?.message === "string" ? errors.name.message : ""}
                  />

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    margin="normal"
                      size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
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
                    label="Password"
                      size="small"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
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

                  {/* Sign Up Button */}
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                    Sign Up
                  </Button>

                  {/* Sign In Link */}
                  <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                    Already have an account? <Link href="/sign-in">Sign In</Link>
                  </Typography>
                   {apiError && <Alert severity="error">{apiError}</Alert>}
                </Box>
              </Box>
            </Grid>
          </Grid>
          }
        </Paper>
      </Container>
    </Box>
  );
}
