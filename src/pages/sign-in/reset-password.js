import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import { InputField, PasswordInputField } from "../../components";
import axios from "axios";

export default function ResetPassword({
  _url,
  gotoFirstStep,
  _header,
  showAlertMessage = () => {},
}) {
  const [formData, setFormData] = useState({
    password: "",
    reset_token: "",
    showPassword: false,
  });
  const [secureEntry, setSecureEntry] = useState(true);
  const [formErrors, setFormErrors] = useState({
    reset_token: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);
    let _data = {
      reset_token: formData.reset_token,
      password: formData.password,
    };

    axios
      .post(_url + "reset/password", _data, _header)
      .then((_json) => {
        setIsLoading(false);
        gotoFirstStep();
        showAlertMessage(
          "Passwort zurücksetzen erfolgreich, bitte melden Sie sich an!",
          "success"
        );
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.status === 400) {
          showAlertMessage("Ein Fehler ist aufgetreten!", "error");
        } else if (err?.response?.status === 422) {
          let errObj = {};
          for (const [key, value] of Object.entries(
            err?.response?.data?.detail
          )) {
            errObj = { ...errObj, [key]: value[0] };
          }
          setFormErrors(errObj);
        } else showAlertMessage("Ein Fehler ist aufgetreten!", "error");
      });
  };

  return (
    <form onSubmit={handleUpdate} autoComplete="off">
      <InputField
        label="Zeichen"
        name="reset_token"
        error={formErrors?.reset_token}
        onChange={(event) => handleChange(event)}
        value={formData.reset_token}
        required
        placeholder="xxxxxx"
        styles={{ mb: 2 }}
      />
      <PasswordInputField
        label="Passwort"
        name="password"
        placeholder="password"
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
          variant="contained"
          disabled={isLoading}
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
