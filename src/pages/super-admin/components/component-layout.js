import React from "react";
import { Container, Box } from "@mui/material";

import { PopUpMsg } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { closePopUp } from "../../../store/reducer";

export default function ComponentLayout({ children }) {
  const { open, message, type } = useSelector((state) => state.storeReducer);
  const dispatch = useDispatch();

  return (
    <>
      <Container
        maxWidth="100%"
        sx={{ paddingTop: "15px", paddingBottom: "15px" }}
      >
        <Box sx={{ pt: "15px", pb: "15px" }}>{children}</Box>
      </Container>
      <PopUpMsg
        open={!!open}
        type={type}
        message={message}
        handleClose={() => dispatch(closePopUp())}
      />
    </>
  );
}

