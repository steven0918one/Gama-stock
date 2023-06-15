import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Box,
  Stack,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import API from "../../axios";
import { InputField, PasswordInputField, SelectBox } from "../../components";
import { openPopUp } from "../../store/reducer";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.storeReducer);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedLang, language } = useSelector((state) => state.storeReducer);
  const [formData, setFormData] = useState();
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntry1, setSecureEntry1] = useState(true);
  const [formErrors, setFormErrors] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!user) {
      console.log("🚀 ~ file: profile.js:33 ~ useEffect ~ user", user);
      setFormData({
        first_name: user?.first_name,
        last_name: user?.last_name,
        telephone: user?.telephone,
        mobile_phone: user?.mobile_phone,
        language: user?.language,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    var { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);
    try {
      await API("post", `update/profile`, formData);
      setIsLoading(false);
      navigate("/");
      dispatch(
        openPopUp({
          message: language[selectedLang]?.profile_update,
          type: "success",
        })
      );
    } catch (err) {
      setIsLoading(false);
      let errObj = {};
      if (err?.response?.status === 422) {
        for (const [key, value] of Object.entries(
          err?.response?.data?.detail
        )) {
          errObj = { ...errObj, [key]: value[0] };
        }
        setFormErrors(errObj);
      } else {
        dispatch(
          openPopUp({
            message:
              err?.response?.data?.message || language[selectedLang]?.error_msg,
            type: "error",
          })
        );
      }
    }
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleForm}>
      <Box maxWidth="500px" mx="auto">
        <Typography variant="h6" my={4}>
          {language[selectedLang]?.update_profile}
        </Typography>
        <Stack spacing={2}>
          <InputField
            type="text"
            label="First Name"
            name="first_name"
            required
            value={formData?.first_name}
            error={formErrors?.first_name}
            onChange={handleChange}
          />
          <InputField
            type="text"
            label="Last Name"
            name="last_name"
            required
            value={formData?.last_name}
            error={formErrors?.last_name}
            onChange={handleChange}
          />
          <SelectBox
            items={langOptions}
            label="Language"
            size="small"
            initValue={formData?.language}
            handleChange={handleChange}
          />
          <InputField
            type="number"
            label="Telephone"
            name="telephone"
            required
            value={formData?.telephone}
            error={formErrors?.telephone}
            onChange={handleChange}
          />
          <InputField
            type="number"
            label="Mobile Number"
            name="mobile_phone"
            required
            value={formData?.mobile_phone}
            error={formErrors?.mobile_phone}
            onChange={handleChange}
          />
          <PasswordInputField
            label={language[selectedLang]?.common_password}
            name="password"
            onChange={handleChange}
            value={formData?.password}
            error={formErrors?.password}
            secureEntry={secureEntry}
            setSecureEntry={setSecureEntry}
          />
          <PasswordInputField
            label={language[selectedLang]?.common_c_password}
            name="confirm_password"
            onChange={handleChange}
            value={formData?.confirm_password}
            error={formErrors?.confirm_password}
            secureEntry={secureEntry1}
            setSecureEntry={setSecureEntry1}
          />

          <Box textAlign="end">
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ mr: "4px" }}
            >
              {language[selectedLang]?.common_cancel}
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading && <CircularProgress size={16} color="primary" />}
              {language[selectedLang]?.common_update}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
const langOptions = [
  { label: "Deutsch (CH)", value: "dutch" },
  { label: "English", value: "english" },
];