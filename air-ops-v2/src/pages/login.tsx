import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Modal,
  FormControlLabel,
  Checkbox,
  Container,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  CheckCircle,
} from "@mui/icons-material";
import { ISession, useSession } from "../SessionContext";
import { useNavigate } from "react-router";
import { FORGOT_PASSWORD, SIGN_IN, SIGN_UP } from "../lib/graphql/queries/auth";
import useGql from "../lib/graphql/gql";
import CloseIcon from "@mui/icons-material/Close";
import bgtwo from "../Asset/Images/backimg.jpeg";
import pfIMG from "../Asset/Images/profile_view.png";
import leftLogo from "../Asset/Images/Left-side-logo.png";
import { useSnackbar } from "../SnackbarContext";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export default function Login() {
  const [tabIndex, setTabIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const showSnackbar = useSnackbar();

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

      if (data?.errors?.length) {
        showSnackbar(`${data?.errors?.[0]?.message}`, "error");
        throw new Error(data?.errors?.[0]?.message);
      }

      localStorage.setItem("token", data.access_token);

      return {
        user: {
          id: data.user.id,
          name: data.user.name || data?.user?.fullName,
          email: data.user.email,
          type: data?.user?.type,
          image: `${apiBaseUrl}${data?.user?.profile}`,
          // role: data.user.role,
          roles: data.user.roles,
          permissions: data.user.permissions,
          operator: data?.user?.operator,
        },
      };
    } catch (error) {
      showSnackbar(
        error.message || "Login failed. Please check your credentials.",
        "error"
      );
      throw new Error(
        error.message || "Login failed. Please check your credentials."
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
    try {
      if (tabIndex === 0) {
        const session = await signIn(data);

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
    } catch (err) {
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
    <>
      <Box
        className="login"
        sx={{
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          height: "100vh",
          // backgroundColor: "#f4f4f4",
          // p: 2,
          backgroundImage: `url(${bgtwo})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center  !important",
          backgroundAttachment: "fixed !important",
        }}
      >
        <Container maxWidth="md" className="cnter-top">
          <Grid container>
            <Grid item xs={12} md={6}>
              <img
                className="left-side-logo"
                src={leftLogo}
                alt="Company Logo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                className="snpage-view"
                sx={{
                  width: 350,
                  mx: "auto",
                  mt: 5,
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Grid item xs={12} md={12}>
                  <img
                    className="pfimg-icon"
                    src={leftLogo}
                    alt="Company Logo"
                    width={65}
                  />
                </Grid>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="Sign In" />
                  {/* <Tab label="Sign Up" /> */}
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
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
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
                      {/* <FormControlLabel
                        control={<Checkbox {...register("rememberMe")} />}
                        label="Remember me"
                      /> */}

                      <Button
                        className="password-styles"
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

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Enter your register email address and we’ll send you a
                      temporary password to reset
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
                    <Box display="flex" justifyContent="space-between" mt={2} >
                      <Button className="forgot_psd"
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
                <Modal
                  open={showEmailSent}
                  onClose={() => setShowEmailSent(false)}
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
                      We just emailed you a temporary password to log in. Please
                      log in and change your password for security reasons.
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

                <Modal
                  open={isSignUpSuccess}
                  onClose={() => setIsSignUpSuccess(false)}
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
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => setIsSignUpSuccess(false)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" gutterBottom>
                      Sign up successful!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You can now sign in with your new credentials.
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{ mt: 3 }}
                      onClick={() => {
                        setIsSignUpSuccess(false);
                        setTabIndex(0); // Switch back to Sign In tab
                      }}
                    >
                      Go to Sign In
                    </Button>
                  </Box>
                </Modal>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
