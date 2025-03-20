import React, { useState } from "react";
import { Tabs, Tab, Box, TextField, Button, InputAdornment,  IconButton,
  Alert,
  Modal,
  FormControlLabel,
  Checkbox,
  Typography, } from "@mui/material";
import { useForm } from "react-hook-form";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import {    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Person,
    CheckCircle, } from "@mui/icons-material";
import { ISession, useSession } from "../SessionContext";
import { useNavigate } from "react-router";
import { FORGOT_PASSWORD, SIGN_IN, SIGN_UP } from "../lib/graphql/queries/auth";
import useGql from "../lib/graphql/gql";
import CloseIcon from "@mui/icons-material/Close";

export default function Login() {
  const [tabIndex, setTabIndex] = useState(0);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [openForgotPwdModel, setForgotPwdModelOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };


  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    reset(); // Reset form when switching tabs
  };

  const handleReset = async () => {
    const data = await useGql({
      query: FORGOT_PASSWORD,
      queryName: "",
      queryType: "mutation",
      variables: {
        email: email,
      },
    });

    if (data?.data?.forgotPassword?.status) {
      setShowEmailSent(true);
      setApiError(null);
    } else {
      setApiError(data?.data?.forgotPassword?.message);
    }
  };

  const signIn = async (formData: any): Promise<ISession> => {
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
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        
          image: "https://avatars.githubusercontent.com/u/19550456",
          role: data.user.role,
        },
      };
    } catch (error) {
      throw new Error(
        error.message || "Login failed. Please check your credentials.",
      );
    }
  };

  const signUp = async (formData: any) => {
    try {
      const data = await useGql({
        query: SIGN_UP,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
            name: formData.name,
          },
        },
      });

      console.log("data:::", data);

      if (!data) {
        throw new Error("SignUp Failed");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "SignUp Failed");
    }
  };


  const onSubmit = async (data) => {
    try{
        if (tabIndex === 0) {
            const session = await signIn(data);
            console.log("session", session);
            if (session) {
              setSession(session);
              navigate("/", { replace: true });
            }
    
        } else {
            const result = await signUp(data);

            if (result) {
              setIsSignUpSuccess(true);
            }
        }
    }catch(err){
        setApiError(err.message);
    }

  };

  const validateEmail = (value: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!value) {
      setError(true);
      setHelperText("Email is required");
    } else if (!emailRegex.test(value)) {
      setError(true);
      setHelperText("Invalid email format");
    } else {
      setError(false);
      setHelperText("");
    }
  };

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {tabIndex === 1 && (
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
                                  helperText={
                                    typeof errors.name?.message === "string"
                                      ? errors.name.message
                                      : ""
                                  }
                                />
          )}

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
                    helperText={
                      typeof errors.email?.message === "string"
                        ? errors.email.message
                        : ""
                    }
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
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={!!errors.password}
                    helperText={
                      typeof errors.password?.message === "string"
                        ? errors.password.message
                        : ""
                    }
                  />
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
                                      {/* <Link href="#" variant="body2">
                                        Forgot email?
                                      </Link> */}
                                      <Button
                                        variant="text"
                                        onClick={() => {
                                          setForgotPwdModelOpen(true), setApiError(null);
                                        }}
                                        sx={{ textTransform: "none" }}
                                      >
                                        {" "}
                                        Forgot password?
                                      </Button>
                    </Box>
          
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tabIndex === 0 ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Box>

       <Modal
              open={openForgotPwdModel}
              onClose={() => setForgotPwdModelOpen(false)}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                {/* Close Button */}
                <IconButton
                  onClick={() => setForgotPwdModelOpen(false)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <CloseIcon />
                </IconButton>
      
                {/* Modal Header */}
                <Typography
                  variant="h6"
                  component="h2"
                  textAlign="center"
                  gutterBottom
                >
                  Forgot your password?
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Enter your register email address and we’ll send you a temporary
                  password to reset
                </Typography>
      
                {/* Email Input */}
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  error={error}
                  helperText={helperText}
                />
      
                {/* Buttons */}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setForgotPwdModelOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Box>
                {apiError && <Alert severity="error">{apiError}</Alert>}
              </Box>
            </Modal>
            {/* Email Sent Confirmation Modal */}
            <Modal open={showEmailSent} onClose={() => setShowEmailSent(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={() => setShowEmailSent(false)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <CloseIcon />
                </IconButton>
      
                <Typography variant="h6" gutterBottom>
                  Check in your mail!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We just emailed you a temporary password to log in. Please log in
                  and change your password for security reasons.
                </Typography>
      
                <Typography variant="body2" sx={{ mt: 2 }}>
                  For any questions, email us at
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {" "}
                    helpdesk@festicket.com
                  </Typography>
                </Typography>
      
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => {
                    setShowEmailSent(false), setForgotPwdModelOpen(false);
                  }}
                >
                  OK
                </Button>
              </Box>
            </Modal>

    </Box>
  );
}
