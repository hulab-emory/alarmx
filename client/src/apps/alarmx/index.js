import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CssBaseline,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 200;

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      © The Children's Healthcare of Atlanta {" "}
      {new Date().getFullYear()}. –{" "}
      <span style={{ fontStyle: "italic", fontWeight: "bold" }}>Never Settle</span>{" "}
    </Typography>

  );
}

export default function AlarmxLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const alert = useSelector((state) => state.alarmx.alert);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  useEffect(() => {
    setAlertOpen(!!alert);
  }, [alert]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Box component="nav">
        <Sidebar
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
        />
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar onDrawerToggle={handleDrawerToggle} />

        <Box component="main" sx={{ flex: 1 }}>
          {alert && (
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={alertOpen}
              autoHideDuration={2000}
              onClose={handleCloseAlert}
            >
              <Alert
                variant="filled"
                severity={alert.severity}
                onClose={handleCloseAlert}
              >
                {alert.message instanceof Error
                  ? alert.message.message
                  : alert.message}
              </Alert>
            </Snackbar>
          )}
          <Outlet />
        </Box>

        <Box component="footer" sx={{ p: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
}
