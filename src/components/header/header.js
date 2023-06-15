import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { MenuItem, Select, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { langSetter } from "../../store/reducer";

export default function Header({ toggleDrawer }) {
  const { user, selectedLang, language } = useSelector((state) => state.storeReducer);
  const [value, setValue] = React.useState(localStorage.getItem("language") || selectedLang);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project_status = useSelector(
    (state) => state.storeReducer.project_status
  );

  // FOR CHANGE LANGUAGE
async function handleLang(e) {
    if (e.target.value === "other") {
      setValue("other");
      dispatch(langSetter("other"));
      localStorage.setItem("language", "other");
    } else if (e.target.value === "english") {
      dispatch(langSetter("english"));
      setValue("english");
      localStorage.setItem("language", "english");
    } else {
      dispatch(langSetter("german"));
      setValue("german");
      localStorage.setItem("language", "german");
    }
  }
  //

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { sm: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {project_status ? (
              user?.role === "ADMIN" ? (
                <label
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  ADMIN&nbsp;
                  {language[selectedLang]?.dashboard}
                  {/* &nbsp;-&nbsp;{selected_user}&nbsp;-&nbsp;{project_status} */}
                </label>
              ) : (
                <label
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  {" "}
                  {project_status}
                </label>
              )
            ) : (
              <label
                style={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {language[selectedLang]?.dashboard}
              </label>
            )}
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Stack direction="row" alignItems="center">
              <Box mx={1}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  variant="standard"
                  onChange={handleLang}
                >
                  <MenuItem value="german">German</MenuItem>
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </Box>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => navigate("/profile")}
              >
                <AccountCircle />
              </IconButton>
              <p>{user.name}</p>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
