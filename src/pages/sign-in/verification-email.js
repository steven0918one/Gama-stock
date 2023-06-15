import React, { useState } from "react";
import {
    InputAdornment,
    Button,
    CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { InputField } from "../../components";
import axios from "axios";

export default function VerificationEmail({showAlertMessage=()=>{},_url='',_header='',nextStep=()=>{}}) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleVerificationEmail = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios
            .post(_url + "verify/reset/password", { email: email }, _header)
            .then((res) => {
                showAlertMessage('Token wurde per E -Mail gesendet.', 'success');
                nextStep();
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                if (err.response.status === 400) {
                    showAlertMessage(err.response.data.error.message, 'error');
                }
                if (err.response.status === 422) {
                    setError(err.response.data.detail.email[0]);
                }
            });
    };

    return (
        <form onSubmit={handleVerificationEmail} autoComplete="off">
            <InputField
                label="Email"
                type="email"
                name="email"
                error={error}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="johndoe@gmail.com"
                endadornment={
                    <InputAdornment position="start">
                        <AccountCircleIcon />
                    </InputAdornment>
                }
                styles={{ mb: 2 }}
            />
            <div style={{ textAlign: "center" }}>
                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="contained"
                    sx={{ marginTop: "3rem", textTransform: "capitalize" }}
                >
                    {isLoading ? (
                        <CircularProgress
                            size={15}
                            sx={{ color: "#fff", marginRight: 1 }}
                        />
                    ) : null}
                    Schicken
                </Button>
            </div>
        </form>
    );
}
