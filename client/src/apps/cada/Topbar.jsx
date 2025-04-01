import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar as MuiAvatar } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import AppBar from "@mui/material/AppBar";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig } from "react-nice-avatar";
import { MdMenu as MenuIcon } from "react-icons/md";
import { MdNotifications as NotificationsIcon } from "react-icons/md";
import { MdApps as Apps } from "react-icons/md";

export default function Topbar(props) {
  const { onDrawerToggle } = props;
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.main.user);

  if (user) {
    const isAdmin = Object.values(user.featureUsers).some(
      (featureUser) =>
        featureUser.app === "cada" && featureUser.role === "admin"
    );
    return (
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          {isAdmin ? (
            <IconButton color="inherit" onClick={onDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => navigate("/cada")}>
              <Apps />
            </IconButton>
          )}
          <Box style={{ flex: "1 1 auto" }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Link
              href="/docs"
              variant="body2"
              style={{
                textDecoration: "none",
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  color: "common.white",
                },
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              APIs
            </Link>
            <Tooltip title="Notifications • 0">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            {user?.avatar ? (
              <MuiAvatar onClick={handleOpen} key={user?.id}>
                <Avatar
                  style={{ width: "29px", height: "29px", cursor: "pointer" }}
                  {...genConfig(JSON.parse(user?.avatar))}
                />
              </MuiAvatar>
            ) : (
              <MuiAvatar
                onClick={handleOpen}
                sx={{ bgcolor: "secondary.main" }}
              >
                {user?.firstName.charAt(0).toUpperCase() +
                  user?.lastName.charAt(0).toUpperCase()}
              </MuiAvatar>
            )}
          </Stack>
        </Toolbar>
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 0,
              mt: 1.5,
              ml: 0.75,
              minWidth: 150,
              "& .MuiMenuItem-root": {
                typography: "body2",
                borderRadius: 0.75,
              },
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 3 }}>
            <Typography variant="body1" noWrap>
              {user?.firstName + " " + user?.lastName}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 14 }} noWrap>
              {user?.featureUsers[1].role}
            </Typography>
          </Box>
          <Divider sx={{ borderStyle: "dashed" }} />
          <Stack sx={{ p: 1 }}>
            {[
              {
                label: "Home",
                href: "/cada",
              },
              {
                label: "Profile",
                href: "/profile",
              },
              {
                label: "Apps",
                href: "/features",
              },
            ].map((option) => (
              <MenuItem
                key={option.label}
                onClick={() => navigate(option.href)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Stack>

          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem onClick={() => dispatch({ type: "LOGOUT" })} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        </Popover>
      </AppBar>
    );
  } else return null;
}

Topbar.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};
