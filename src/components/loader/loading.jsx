import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function MyLoader() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff",
        opacity: [1, 0.9],
        "&:hover": {
          backgroundColor: "#fff",
          opacity: [0.9, 0.8],
        },
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "99999",
      }}
    >
      <Box
        sx={{
          opacity: "1",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "5",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    </Box>
  );
}
