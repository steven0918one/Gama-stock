import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import COLORS from "../../colors";

function AddProjectBtn({ handleClick, tooltip, icon }) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 100,
        right: 50,
        zIndex: 50,
      }}
    >
      <Tooltip title={tooltip} placement='top'>
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: COLORS.green,
            color: "#fff",
            "&:hover": { 
              backgroundColor: COLORS.green
            },
          }}
          size='large'
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
AddProjectBtn.defaultProps = {
  handleClick: () => { },
  tooltip: 'title',
  icon: <AddIcon />
}
export default AddProjectBtn;
