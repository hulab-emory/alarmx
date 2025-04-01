import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Divider,
  Drawer,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  MdPeople,
  MdAnalytics,
  MdFolder,
  MdGridView,
  MdHome,
  MdInventory,
  MdSettingsInputComponent,
} from "react-icons/md";

export default function Navigator(props) {
  const { ...other } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.main.user);

  if (user) {
    return (
      <Drawer variant="temporary" {...other}>
        <List disablePadding>
          <ListItem
            sx={{
              py: 1.3,
              px: 3,
              fontSize: 20,
              color: "#fff",
            }}
          >
            <span>
              <b style={{ color: "#4fc3f7" }}>CA</b>
              <b>DA</b>
            </span>
          </ListItem>

          <ListItem component="a" onClick={() => navigate("/cada")}>
            <ListItemButton
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                p: "10px",
                textAlign: "left",
                ...("/cada" === location.pathname && {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                }),
                color: "rgba(255, 255, 255, 0.5)",
                "&:hover, &:focus": {
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <ListItemIcon
                component="span"
                sx={{
                  alignItems: "center",
                  color: "neutral.400",
                  display: "inline-flex",
                  justifyContent: "center",
                  mr: 2,
                  ...("/cada" === location.pathname && {
                    color: "primary.main",
                  }),
                }}
              >
                <MdHome />
              </ListItemIcon>
              <ListItemText
                component="span"
                sx={{
                  color: "neutral.400",
                  flexGrow: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  ...("/cada" === location.pathname && {
                    color: "primary.contrastText",
                  }),
                }}
              >
                {"Dashboard"}
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider sx={{ mt: 2 }} />
          {[
            {
              id: "Admin",
              children: [
                {
                  id: "User",
                  href: "/cada/user",
                  icon: <MdPeople />,
                },
                {
                  id: "Project",
                  href: "/cada/project",
                  icon: <MdGridView />,
                },
                {
                  id: "Bucket",
                  href: "/cada/bucket",
                  icon: <MdInventory />,
                },
                {
                  id: "Model",
                  href: "/cada/model",
                  icon: <MdSettingsInputComponent />,
                },
                {
                  id: "Report",
                  href: "/cada/report",
                  icon: <MdAnalytics />,
                },
              ],
            },
            {
              id: "Apps",
              children: [
                {
                  id: "M2D",
                  href: "/m2d",
                  icon: <MdFolder />,
                },
              ],
            },
          ].map(({ id, children }) => (
            <Box key={id}>
              <ListSubheader sx={{ pt: 2, px: 4 }}>{id}</ListSubheader>
              {children.map(({ id: childId, href, icon }) => (
                <ListItem
                  component="a"
                  onClick={() => navigate(href)}
                  key={childId}
                  sx={{ px: 2, py: 0.2 }}
                >
                  <ListItemButton
                    sx={{
                      alignItems: "center",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      px: 2,
                      py: 0.5,
                      textAlign: "left",
                      ...(href === location.pathname && {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      }),
                      color: "rgba(255, 255, 255, 0.5)",
                      "&:hover, &:focus": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    <ListItemIcon
                      component="span"
                      sx={{
                        alignItems: "center",
                        color: "neutral.400",
                        display: "inline-flex",
                        justifyContent: "center",
                        mr: 2,
                        ...(href === location.pathname && {
                          color: "primary.main",
                        }),
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      component="span"
                      sx={{
                        color: "neutral.400",
                        flexGrow: 1,
                        fontSize: 14,
                        fontWeight: 600,
                        ...(href === location.pathname && {
                          color: "primary.contrastText",
                        }),
                      }}
                    >
                      {childId}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </List>
      </Drawer>
    );
  } else return "";
}
