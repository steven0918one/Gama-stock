import React, { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Snackbar,
    Alert,
    Fade,
    CircularProgress,
} from "@mui/material";

import { useSelector } from "react-redux";
import { Logo } from "../../assets";
import { PasswordInputField, SplashScreen } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../hooks/page-title";

import API from "../../axios";

export default function SetPassword() {
    PageTitle("Lege ein Passwort fest");
    const [formData, setFormData] = useState({
        password: "",
        showPassword: false,
    });
    const [alert, setAlert] = useState({ open: false, message: "Fehler!", type: "info" });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [secureEntry, setSecureEntry] = useState(true);
    const [formErrors, setFormErrors] = useState({
        password: "",
    });
    const { token } = useParams();

    const checkToken = async () => {
        setIsLoading(true)
        try {
            await API('get', `check-token/${token}`)
            setIsLoading(false);
        } catch (error) {
            navigate('/sign-in');
            setIsLoading(false);
        }
    }

    const { isLogged } = useSelector((state) => state.storeReducer);
    let navigate = useNavigate();

    React.useEffect(() => {
        if (isLogged) {
            navigate("/");
        }
        checkToken();
        setFadeIn(true);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => setAlert({ ...alert, open: false });

    const showAlertMessage = (msg, type) => {
        setAlert({
            open: true,
            message: msg,
            type: type
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (formData?.password?.length < 6) {
            setFormErrors({ ...formErrors, password: "Password must atleast 6 characters" });
            return;
        }

        setIsLoading1(true);
        setFormErrors({})
        try {
            await API('post', 'set-password', { password: formData.password, token: token })
            setIsLoading1(false);
            setFormData({ ...formData, password: '' });
            showAlertMessage('Passwort erfolgreich eingestellt, bitte loginieren Sie sich', 'success');
            setTimeout(() => {
                navigate('/sign-in');
            }, 3000);

        } catch (err) {
            if (err?.response?.status === 400) {
                showAlertMessage(err?.response?.data?.message, 'success');
            } else if (err?.response?.status === 422) {
                let pass = err?.response?.data?.detail?.password[0];
                setFormErrors({ ...formErrors, password: pass });
            }
            showAlertMessage('Ein Fehler ist aufgetreten.Bitte versuche es erneut', 'error');
            setIsLoading1(false);
        }
    };

    return (
        <>
            {
                isLoading ?
                    <SplashScreen /> :
                    (
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
                                            "Lege ein Passwort fest"
                                        </Typography>
                                        <form onSubmit={handleForm} autoComplete="off">
                                            <PasswordInputField
                                                label="Passwort"
                                                name="password"
                                                placeholder="Passwort"
                                                required
                                                onChange={(event) => handleChange(event)}
                                                value={formData.password}
                                                error={formErrors?.password}
                                                secureEntry={secureEntry}
                                                setSecureEntry={setSecureEntry}
                                            />
                                            <div style={{ textAlign: "center" }}>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading1}
                                                    variant="contained"
                                                    sx={{ marginTop: "3rem", textTransform: "capitalize" }}
                                                >
                                                    {isLoading1 ? (
                                                        <CircularProgress
                                                            size={15}
                                                            sx={{ color: "#fff", marginRight: 1 }}
                                                        />
                                                    ) : null}
                                                    Passwort festlegen
                                                </Button>
                                            </div>
                                        </form>
                                    </Box>
                                    <Box sx={{ p: 1 }}>
                                        <Typography sx={{ textAlign: "center", color: "#ccc" }}>
                                            @ Urheberrechte {new Date().getFullYear()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Fade>
                        </Container>
                    )
            }
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.type} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}
