import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { theme, colors } from "../styles/theme/Theme";
import { useEffect } from "react";

const pages = [
  // { name: "Base Profile", path: "/" },
  // { name: "CUG Profile", path: "/" },
  // { name: "HF Profile", path: "/" },
  // { name: "UGF Profile", path: "/" },
  // { name: "UF Profile", path: "/" },
];
const settings = [
  // "Profile", "Account", "Dashboard", "Logout"
  { name: "Profile", path: "/" },
  { name: "Account", path: "/" },
  { name: "Dashboard", path: "/" },
  { name: "Logout", path: "/login" },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e, path) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (e, path) => {
    localStorage.removeItem("user");
    navigate("/login");

    setAnchorElUser(null);
  };

  const isSmallOrLess = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: colors.blackPrimary,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            backgroundColor: colors.blackPrimary,
          }}
        >
          <AdbIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              // mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: '"montez","cursive"',
              fontWeight: 400,
              letterSpacing: ".3rem",
              color: colors.white,
              textDecoration: "none",
              fontSize: "3em",
              flexGrow: 1,
              // width: "max-content",
              maxWidth: "5em",
            }}
          >
            Permissions
          </Typography>

          <Box
            sx={{
              flexGrow: 3,
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

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
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={(e) => handleCloseNavMenu(e, page.path)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Permissions
          </Typography>
          <Box
            sx={{
              flexGrow: 3,
              display: { xs: "none", md: "flex" },
              justifyContent: "space-around",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={(e) => handleCloseNavMenu(e, page.path)}
                sx={{
                  my: 2,
                  color: colors.black,
                  display: "block",
                  fontSize: "1.2em",
                  // fontFamily: '"montez","cursive"',
                  fontWeight: 500,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/2.jpg"
                  // sx={{ backgroundColor: "#2c3237" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={(e) => handleCloseUserMenu(e, setting.path)}
                >
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
