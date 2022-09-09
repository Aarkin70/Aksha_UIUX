import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import {
  Container,
  Toolbar,
  MenuItem,
  IconButton,
  Box,
  Menu,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import settings from "../assets/images/icons/settings.png";
import help from "../assets/images/icons/help.png";
import { pages } from "./headerData";
import logo from "../assets/images/main-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useDispatch } from "react-redux";
import {
  fetchUser,
  getAllSpotLight,
} from "../global_store/reducers/monitorReducer";
import Profile from "../component/profile";
import DropdownMenu from './DropdownMenu';

const Header = () => {
  const dispatch = useDispatch();
  const [navigation, setNavigation] = useState(pages);
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const changeActiveLink = () => {
    navigate("/cameraDirectory");
    let arr = [];
    for (let item of navigation) {
      item.active = false;
      arr.push(item);
    }
    setNavigation(arr);
  };

  useEffect(() => {
    const endpoint: any = process.env.REACT_APP_BASE_URL;
    const socket = socketIOClient(endpoint);
    socket.on("cameraImages", (data) => {
      // console.log("broadcast");
      // console.log(data);

      dispatch(fetchUser({ info: data.info, message: data.message }));
    });
  }, []);

  useEffect(() => {
    const endpoint: any = process.env.REACT_APP_BASE_URL;
    const socket = socketIOClient(endpoint);
    socket.on("meta_cameras", (data) => {
      // console.log("spotLight");
      // console.log(data);

      dispatch(getAllSpotLight({ info: data.info, message: data.message }));
    });
  }, []);

  const openpage = (page: any) => {
    // console.log("page", page);
    handleCloseNavMenu();
    navigate(page.pageUrl);
  };

  console.log("=======", window.localStorage.getItem('isLoggedIn'))

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "white",
        boxShadow: "0px 4px 16px 0px #03122E0F",
        position: "fixed",
        zIndex: 999,
        top: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon style={{ color: "black" }} />
          </IconButton>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "117px",
              height: "46px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/monitor");
              for (let i = 0; i < navigation.length; i++) {
                navigation[i].active = false;
              }
              navigation[0].active = true;
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {window.localStorage.getItem('isLoggedIn') !== null && navigation.map((page, index) => (
                <MenuItem key={index} onClick={() => openpage(page)}>
                  <Typography textAlign="center">
                    <img
                      src={page.icon}
                      style={{
                        width: page.width,
                        height: page.height,
                      }}
                      alt="pages icon"
                    />
                    &nbsp;
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {window.localStorage.getItem('isLoggedIn') && navigation.map((page, index) => (
              <Button
                key={index}
                onClick={() => {
                  for (let i = 0; i < navigation.length; i++) {
                    navigation[i].active = false;
                  }
                  navigation[index].active = true;
                  setNavigation(() => {
                    return [...navigation];
                  });
                  navigate(page.pageUrl);
                }}
                sx={{
                  mx: 4,
                  color: page.active ? "white" : "black",
                  display: "block",
                  textTransform: "initial",


                  fontSize: "17px",
                  background: page.active ? "#0A57EB" : "white",
                  "&:hover": {
                    background: page.active ? "#0A57EB" : "white",
                  },
                }}
              >
                {page.active === true ? (
                  <img
                    src={page.iconWhite}
                    style={{
                      width: page.width,
                      height: page.height,
                    }}
                    alt="pages icon"
                  />
                ) : (
                  <img
                    src={page.icon}
                    style={{
                      width: page.width,
                      height: page.height,
                    }}
                    alt="pages icon"
                  />
                )}
                &nbsp;
                {page.name}
              </Button>
            ))}
          </Box>
          {window.localStorage.getItem('isLoggedIn') && <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <div>
              <img
                src={settings}
                style={{
                  width: "23px",
                  height: "23px",
                  cursor: "pointer",
                }}
                className="mx-2"
                alt="settings"
                onClick={() => changeActiveLink()}
              />
              {window.location.pathname == "/cameraDirectory" && (
                <div
                  className="active-link"
                  style={{
                    position: "relative",
                    height: 2,
                    width: "100%",
                    background: "#0a57eb",
                    top: 17,
                  }}
                ></div>
              )}
            </div>
            <img
              src={help}
              style={{
                width: "23px",
                height: "23px",
              }}
              alt="help"
              className="mx-2"
            />
          </Box>
          }
          <DropdownMenu>
            <div
              style={{
                backgroundColor: "#F6F6F6",
                padding: "6px 4px",
                borderRadius: "12px",
              }}
            >
              <IconButton sx={{ p: 0 }}>
                &nbsp;
                <img
                  alt="Remy Sharp"
                  src={require("../assets/images/header/user.png")}
                />
                &nbsp;
                <Avatar
                  alt="Remy Sharp"
                  src={require("../assets/images/header/avatar.png")}
                />
              </IconButton>
            </div>
          </DropdownMenu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


export default Header;
