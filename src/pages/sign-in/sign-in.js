import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  InputAdornment,
  Button,
  Paper,
  Snackbar,
  Alert,
  Fade,
  CircularProgress,
  Fab,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";

import { Logo } from "../../assets";
import { InputField, PasswordInputField } from "../../components";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../hooks/page-title";

import {  useDispatch } from "react-redux";
import VerificationEmail from "./verification-email";
import ResetPassword from "./reset-password";
import API from "../../axios";
import { loginUser } from "../../store/reducer";

export default function SignIn() {
  PageTitle("SignIn");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    token: "",
    showPassword: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [formStep, setFormStep] = useState(1);
  const [alert, setAlert] = useState({
    open: false,
    type: "info",
    message: "Error!",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const _header = {
    headers: {
      "content-type": "application/json",
    },
  };
  const [secureEntry, setSecureEntry] = useState(true);
  const _url = process.env.REACT_APP_API_KEY;

  React.useEffect(() => {
    setFadeIn(true);
  }, []);
  const handleClose = () => setAlert({ ...alert, open: false });

  const nextStep = () => {
    reset();
    setFormStep(formStep + 1);
  };

  const gotoFirstStep = () => {
    reset();
    setFormStep(1);
  };

  const showAlertMessage = (msg, type) => {
    setAlert({
      open: true,
      message: msg,
      type: type,
    });
  };

  const reset = () => {
    setFormData({
      email: "",
      password: "",
      token: "",
      showPassword: false,
    });
    setFormErrors({
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});
    try {
      let { data } = await API("post", "stock-manager-login", {
        email: formData.email,
        password: formData.password,
        platform: 'gama_stock'
      });
      dispatch(loginUser(data));
      setIsLoading(false);
        navigate("/");
    } catch (error) {
      localStorage.removeItem("@ACCESS_TOKEN");
      if (error?.response?.status === 400) {
        showAlertMessage(error?.response?.data?.message, "error");
      } else if (error?.response?.status === 422) {
        let errObj = {};
        for (const [key, value] of Object.entries(
          error?.response?.data?.detail
        )) {
          errObj = { ...errObj, [key]: value[0] };
        }
        setFormErrors(errObj);
      } else {
        showAlertMessage(
          "Ein Fehler ist aufgetreten.Bitte versuche es erneut",
          "error"
        );
      }
      setIsLoading(false);
    }
  };
  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          backgroundColor: "primary.dark",
          display: "flex",
          justifyContent: "center",
          alignItems: { alignItems: "center", md: "center" },
          height: "100vh",
        }}
      >
        <Fade in={fadeIn} timeout={1500}>
          <Box
            component={Paper}
            elevation={24}
            sx={{ m: 1, width: "100%", maxWidth: "500px" }}
          >
            <Box
              component="div"
              sx={{
                position: "relative",
                padding: { lg: "3rem", md: "2rem", padding: "2rem 1rem" },
              }}
            >
              {formStep > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                  }}
                >
                  <Fab
                    color="primary"
                    aria-label="add"
                    onClick={gotoFirstStep}
                    size="small"
                  >
                    <KeyboardBackspaceIcon />
                  </Fab>
                </Box>
              )}
              <Box sx={{ textAlign: "center" }}>
                <img src={Logo} width="170" alt="logo" />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  paddingTop: "1rem",
                  color: "secondary.main",
                  paddingBottom: "2rem",
                  fontWeight: "bold",
                }}
                gutterBottom
                component="h4"
              >
                {formStep === 1
                  ? "Willkommen!"
                  : formStep === 2
                  ? "E-Mail"
                  : "Passwort zurücksetzen!"}
              </Typography>
              {formStep === 1 ? (
                // login Form
                <form onSubmit={handleForm} autoComplete="off">
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    error={formErrors?.email}
                    onChange={(event) => handleChange(event)}
                    value={formData.email}
                    required
                    placeholder="johndoe@gmail.com"
                    endadornment={
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    }
                    styles={{ mb: 2 }}
                    id="1"
                  />

                  <PasswordInputField
                    label="Passwort"
                    name="password"
                    placeholder="Passwort"
                    required
                    error={formErrors?.password}
                    onChange={(event) => handleChange(event)}
                    value={formData.password}
                    secureEntry={secureEntry}
                    setSecureEntry={setSecureEntry}
                  />
                  <div style={{ textAlign: "end" }}>
                    <Button type="button" onClick={nextStep} sx={{ mt: 1 }}>
                      Passwort vergessen?
                    </Button>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ marginTop: "3rem", textTransform: "capitalize" }}
                      endIcon={<LoginIcon />}
                    >
                      {isLoading ? (
                        <CircularProgress
                          size={15}
                          sx={{ color: "#fff", marginRight: 1 }}
                        />
                      ) : null}
                      Anmeldung
                    </Button>
                  </div>
                </form>
              ) : formStep === 2 ? (
                // Get email for verification
                <VerificationEmail
                  nextStep={() => setFormStep(formStep + 1)}
                  showAlertMessage={(msg, type) => showAlertMessage(msg, type)}
                  _url={_url}
                  _header={_header}
                />
              ) : (
                // Reset Password Form
                <ResetPassword
                  gotoFirstStep={() => setFormStep(1)}
                  showAlertMessage={(msg, type) => showAlertMessage(msg, type)}
                  _url={_url}
                  _header={_header}
                />
              )}
            </Box>
            <Box sx={{ p: 1 }}>
              <Typography sx={{ textAlign: "center", color: "#ccc" }}>
                @ Urheberrechte {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
