import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, Typography, Box, Snackbar, Alert } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// ----------------------------------------------------------------------

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright ©  CHoRUS Equitable AI "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const drawerWidth = 200;
// ----------------------------------------------------------------------

export default function CadaLayout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const alert = useSelector((state) => state.cada.alert);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  useEffect(() => {
    alert ? setAlertOpen(true) : setAlertOpen(false);
  }, [alert]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Box component="nav">
        <Sidebar
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
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
            >
              <div>
                <Alert
                  variant="filled"
                  severity={alert.severity}
                  onClose={handleCloseAlert}
                >
                  {alert.message instanceof Error
                    ? alert.message.message
                    : alert.message}
                </Alert>
              </div>
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
