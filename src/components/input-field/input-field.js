import React, { useState } from "react";
import { Box, InputLabel, FormHelperText, TextField } from "@mui/material";

export default function InputField({
  labelTop = "",
  initValue = null,
  handleChange = (e) => { },
  styles,
  name = "",
  type = "text",
  error = "",
  multiline = false,
  rows = "",
  ...props
}) {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    if (!!initValue) {
      setValue(initValue);
    } else {
      setValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue]);

  return (
    <Box sx={styles}>
      {labelTop && (
        <InputLabel
          htmlFor={name}
          sx={{
            marginBottom: "5px",
            color: "#000",
          }}
        >
          {labelTop}
        </InputLabel>
      )}
      <TextField
        error={Boolean(error!=='')}
        type={type}
        name={name}
        value={value}
        multiline={multiline}
        rows={rows}
        onChange={(event) => {
          setValue(event.target.value);
          handleChange(event);
        }}
        {...props}
        variant="standard"
        sx={{ width: "100%" }} 
      />
      {error !== "" && (
        <FormHelperText sx={{ color: "primary.main", mt: "0 !important" }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}
