import React from "react";
import {
  Snackbar,
  Alert,
} from "@mui/material";

export default function PopUpMsg({ open = false, type = 'error', message = '', handleClose = () => { }, duration = 3000 }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={() => handleClose()}
      anchorOrigin={{ vertical:'bottom', horizontal:'right'}}
    >
      <Alert
        onClose={() => handleClose()}
        severity={type}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
