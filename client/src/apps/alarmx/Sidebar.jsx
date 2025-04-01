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
  ListSubheader
} from "@mui/material";

import {
  MdHome,
  MdPerson,
  MdSettings
} from "react-icons/md";
import { LiaHospital } from "react-icons/lia";
import { TbBedFlat } from "react-icons/tb";
import { AiOutlineAppstore } from "react-icons/ai";

export default function Navigator(props) {
  const { ...other } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.main.user);

    return (
      <>
     {user && <Drawer variant="temporary" {...other}>
      <List disablePadding>
        <ListItem
          sx={{
            py: 1.3,
            px: 3,
            fontSize: 18,
            color: "#fff",
          }}
        >
          <span>

          <b>Alarm</b><b style={{ color: "#4fc3f7" }}>X</b>
          </span>
        </ListItem>

        <ListItem component="a" onClick={() => navigate("/alarmx")}>
          <ListItemButton
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(145, 158, 171, 0.16)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              p: "10px",
              textAlign: "left",
              ...(location.pathname && {
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
                ...(location.pathname && {color: "primary.main" }),
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
                ...(location.pathname && { color: "primary.contrastText" }),
              }}
            >
              {"Dashboard"}
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <Divider sx={{ mt: 1 }} />
        {[
          {
            id: "",
            children: [
              {
                id: "Hospital",
                href: "/alarmx/hospital",
                icon: <LiaHospital />,
              },{
                id: "Unit",
                href: "/alarmx/unit",
                icon: <AiOutlineAppstore />,
              },{
                id: "Bed",
                href: "/alarmx/bed",
                icon: <TbBedFlat />,
              },
            ],
          },
          {
            id: "Admin",
            children: [
              {
                id: "Users",
                href: "/alarmx/user",
                icon: <MdPerson />,
              },{
                id: "Settings",
                href: "/alarmx/settings",
                icon: <MdSettings />,
              },
            ],
          },
        ].map(({ id, children }) => (
          <Box key={id}>
            <ListSubheader sx={{ pt: 2, px: 4 }}>
              {id}
            </ListSubheader>
            {children.map(({ id: childId, href, icon }) => (
              <ListItem
                component="a"
                onClick={() => navigate(href)}
                key={childId}
                sx={{ px: 2, py: 0.1, }}
              >
                <ListItemButton
                  sx={{
                    alignItems: "center",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    px: 1,
                    py: 0,
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
                      ...(href === location.pathname && {
                        color: "primary.contrastText",
                      }),
                    }}
                  >
                     {id==="Data" ? <span style={{fontSize: 12}}>
                      {childId} 
                    </span> :  <span> {childId}</span> }
                    
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </List>
    </Drawer>}
    </>
    );
}
