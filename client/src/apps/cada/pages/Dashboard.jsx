import React, { useEffect } from "react";
import { Grid, Container, Typography, Box, Chip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import AssignmentCard from "../sections/Dashboard/AssignmentCard";
import axios from "axios";

function Assignments() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.main.user);
  const projects = useSelector((state) =>
    Object.keys(state.cada.userProjects).length > 0
      ? state.cada.userProjects
      : null
  );
  const roles = useSelector((state) =>
    Object.keys(state.cada.userRoles).length > 0 ? state.cada.userRoles : null
  );

  const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  useEffect(() => {
    if (projects === null) {
      axios({
        method: "get",
        url: `/api/cada/project/users/${user.id}`,
      }).then((res) => {
        let proj = {};
        let roles = [];
        res.data.map((p) => {
          proj[p.id] = p;
          roles = roles.concat(p.cadaProjectUsers);
        });
        dispatch({ type: "GET_USER_PROJECTS", userProjects: proj });
        dispatch({ type: "GET_USER_ROLES", userRoles: roles });
      });
    }
  }, []);

  if (user && projects) {
    console.log(user);
    console.log(projects);
    return (
      <Container maxWidth="lg">
        {Object.keys(groupBy(roles, "role")).map((u) => (
          <div key={u}>
            <Typography
              component={"div"}
              sx={{
                paddingTop: 6,
                paddingBottom: 4,
              }}
              color="textSecondary"
            >
              {(u === "annotator" && "Annotations") ||
                (u === "adjudicator" && "Adjudications")}
              <Chip
                size="small"
                label={roles.filter((k) => k.role === u).length}
                sx={{
                  fontWeight: 900,
                  ml: 1,
                  bgcolor: "grey.400",
                  color: "primary.contrastText",
                }}
              />
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} justifyContent="flex-start">
                {roles
                  .filter((k) => k.role === u)
                  .map((cadaUser) => (
                    <Grid
                      item
                      padding={1}
                      key={cadaUser.id}
                      xs={12}
                      sm={8}
                      md={6}
                      lg={4}
                    >
                      <AssignmentCard
                        card={projects[cadaUser.cadaProjectId]}
                        user={cadaUser}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </div>
        ))}
      </Container>
    );
  } else {
    return (
      <Container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Typography variant="h3" paragraph>
          There are no assignments.
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Contact your admin for assignments!
        </Typography>
      </Container>
    );
  }
}

export default Assignments;
