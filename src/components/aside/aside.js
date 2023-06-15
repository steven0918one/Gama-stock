import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
  Collapse,
  Stack,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";

import QRCode from "react-qr-code";

import { Logo } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilters,
  logout,
  setPaginationCurrent,
  setIsFilterApply
} from "../../store/reducer";
import API from "../../axios";
import { Link } from "react-router-dom";

export default function Aside({ open, toggleDrawer }) {
  const { user } = useSelector((state) => state.storeReducer);
  var _paths = [];
  if (user?.role === "stock_manager") {
    _paths = [
      {
        title: "component",
        route: "/",
        icon: <HomeIcon />,
      },
      {
        title: "logs",
        route: "/logs",
        icon: <EventNoteIcon />,
      },
      {
        title: "stock_settings",
        route: "/settings",
        icon: <SettingsIcon />
      }
    ];
  } else if (user?.role === "viewer") {
    _paths = [
      {
        title: "component",
        route: "/",
        icon: <HomeIcon />,
      },
      {
        title: "logs",
        route: "/logs",
        icon: <EventNoteIcon />,
      },
    ];
  } else {
    _paths = [
      {
        title: "component",
        route: "/",
        icon: <HomeIcon />,
      },
    ];
  }
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();

  const qrUrl = window.location.href + "&mode=qr&project=" + user.id;

  const signOut = () => {
    API("post", "logout");
    dispatch(logout());
  };

  const changeRoute = (r) => {
    let url;
    if (user?.project_status) {
      url = `${r}?status=${user?.project_status}`;
    } else {
      url = r;
    }
    return navigate(url);
  };

  const openQrCodeForPrinter = () => {
    window.open(`/${process.env.REACT_APP_BASE_NAME}/qr?${qrUrl}`, "_blank");
  };

  return (
    <>
      <Drawer
        variant={isMdUp ? "permanent" : "temporary"}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <Stack justifyContent="space-between" sx={{ minHeight: "100vh" }}>
          <Box>
            <List sx={{ mt: 2 }}>
              <ListItem>
                <Box sx={{ margin: "0 auto" }}>
                  <Link to={"/"}>
                    <div>
                      <img src={Logo} alt="logo" width="150px" />
                    </div>
                  </Link>
                </Box>
              </ListItem>
            </List>
            <div style={{ margin: "1rem 0" }}>
              <Divider />
            </div>
            <List className="listItemStyle">
              {_paths.map((_v, _i) => (
                <NavItem
                  key={_i}
                  text={_v.title}
                  path={_v.route}
                  myFunction={() => {
                    dispatch(setPaginationCurrent(1));
                    dispatch(clearFilters());
                    dispatch(setIsFilterApply(false));
                    changeRoute(_v.route);
                  }}
                  icon={_v.icon}
                  subMenu={_v.subMenu ? _v.subMenu : ""}
                />
              ))}
              <NavItem
                text={"layout_logout"}
                myFunction={signOut}
                icon={<LogoutIcon sx={{ color: "secondary.dark" }} />}
                subMenu=""
              />
            </List>
          </Box>
          <Box
            onClick={openQrCodeForPrinter}
            sx={{ paddingBottom: 4, position: "relative", cursor: "pointer" }}
          >
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 100,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrUrl}
                viewBox={`0 0 256 256`}
                level="H"
              />
            </div>
            <div
              style={{
                fontSize: "0.54em",
                wordBreak: "break-all",
                textAlign: "center",
                margin: "0 12px",
              }}
            >
              {qrUrl}
            </div>
            <div style={{ width: "100%", position: "absolute", top: "40px" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  textAlign: "center",
                  width: "32px",
                  margin: "0 auto",
                }}
              >
                <img
                  key={Date.now()}
                  className="qr-icon center"
                  src={Logo}
                  alt="logo"
                  height={16}
                  width={32}
                ></img>
              </div>
            </div>
            <Box sx={{ margin: "12px", textAlign: "center", fontSize: "12px" }}>
              <a href="mailto:support@gama-portal.ch?subject=Gama-Portal%20Meldung">
                support@gama-portal.ch
              </a>
            </Box>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}

const NavItem = (props) => {
  const [open, setOpen] = React.useState();
  const location = useLocation();
  var routeName = location.pathname;
  const navigate = useNavigate();

  const { selectedLang, language } = useSelector((state) => state.storeReducer);

  return (
    <>
      {props?.subMenu?.length !== 0 ? (
        // <ListItem sx={{ padding: 0, flexDirection: 'column' }}>
        <>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(!open)} sx={linkStyles}>
              <ListItemIcon>{props.icon}</ListItemIcon>
              <ListItemText
                primary={language[selectedLang]?.[props.text]}
                sx={{ color: "secondary.main" }}
              />
              {open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            </ListItemButton>
          </ListItem>
          {/* <List sx={{ width: '90%', padding: 0 }}> */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            {props?.subMenu?.map((_item, _i) => {
              return (
                <ListItemButton
                  onClick={() => navigate(_item.path)}
                  selected={_item.path === routeName}
                  sx={[
                    linkStyles,
                    {
                      "& .MuiTypography-root": {
                        fontSize: "14px",
                      },
                      "& .MuiListItemIcon-root ": {
                        paddingLeft: "15px !important",
                      },
                    },
                  ]}
                  pl={3}
                  key={_i}
                >
                  <ListItemIcon>{_item.icon}</ListItemIcon>
                  <ListItemText
                    primary={language[selectedLang]?.[_item.text]}
                    sx={{ color: "secondary.main" }}
                  />
                </ListItemButton>
              );
            })}
          </Collapse>
          {/* </List> */}
        </>
      ) : (
        <ListItem sx={{ padding: 0 }}>
          <ListItemButton
            onClick={props.myFunction}
            selected={props.path === routeName}
            sx={linkStyles}
          >
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText
              primary={language[selectedLang]?.[props.text]}
              sx={{ color: "secondary.main" }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
};

const linkStyles = {
  "&.Mui-selected": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "& *": {
      color: "primary.main",
      transition: "0.2s all ease-in-out",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      "& *": {
        color: "primary.main",
      },
    },
    "&::before": {
      height: "100%",
    },
  },
  "&::before": {
    content: `''`,
    position: "absolute",
    top: "50%",
    right: "0",
    transform: "translateY(-50%)",
    height: "0",
    width: "4px",
    backgroundColor: "primary.main",
    transition: "0.2s all ease-in-out",
  },
  "&:hover::before": {
    height: "100%",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "& *": {
      color: "primary.main",
      transition: "0.2s all ease-in-out",
    },
  },
};
