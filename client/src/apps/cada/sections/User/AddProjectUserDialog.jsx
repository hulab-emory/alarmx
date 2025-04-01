import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { connect } from "react-redux";

// ----------------------------------------------------------------------

async function assignProjectRole(projectId, userId, role) {
  console.log(`api/cada/project/${projectId}/users/${userId}?role=${role}`);
  return fetch(`/api/cada/project/${projectId}/users/${userId}?role=${role}`, {
    method: "POST",
    mode: "cors", //include this to fetch without body
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

// ----------------------------------------------------------------------

function AddProjectUserForm({
  userId,
  userProjectRoles,
  projects,
  handleClose,
  addProjectUser,
}) {
  const [values, setValues] = React.useState({});

  const handleFormChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRole = await assignProjectRole(
      values.cadaProjectId,
      userId,
      values.role
    );
    if (userRole) {
      let userProjects = [];
      let project = userProjectRoles.find(
        (project) => project.id === parseInt(userRole.cadaProjectId, 10)
      );
      if (project) {
        userProjects = userProjectRoles.map((p) =>
          p.id === parseInt(userRole.cadaProjectId, 10)
            ? {
                ...p,
                cadaProjectUsers: [...p.cadaProjectUsers, userRole],
              }
            : p
        );
      } else
        userProjects = [
          ...userProjectRoles,
          {
            ...projects.find(
              (p) => p.id === parseInt(userRole.cadaProjectId, 10)
            ),
            cadaProjectUsers: [userRole],
          },
        ];
      addProjectUser(userId, userProjects);
      handleClose();
    }
  };

  console.log("userProjectRoles: ", userProjectRoles);

  return (
    <>
      <CssBaseline />
      <DialogTitle id="form-dialog-title">Add Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add new project user role, please provide project name and role.{" "}
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextField
              select
              fullWidth
              label="Project"
              margin="dense"
              name="cadaProjectId"
              onChange={handleFormChange}
              required
              value={values.cadaProjectId ? values.cadaProjectId : ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {projects.map((project) => (
                <MenuItem
                  disabled={
                    userProjectRoles.find((u) => u.id === project.id) &&
                    userProjectRoles.find((u) => u.id === project.id)
                      .cadaProjectUsers.length >= 2
                  }
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              select
              fullWidth
              label="Role"
              margin="dense"
              name="role"
              onChange={handleFormChange}
              required
              value={values.role ? values.role : ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {["annotator", "adjudicator"].map((role) => {
                return (
                  <MenuItem
                    disabled={
                      values.cadaProjectId &&
                      userProjectRoles.find(
                        (u) => u.id === values.cadaProjectId
                      ) &&
                      userProjectRoles
                        .find((u) => u.id === values.cadaProjectId)
                        .cadaProjectUsers.find((x) => x.role === role)
                    }
                    key={role}
                    value={role}
                  >
                    {role}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          <Grid item md={12} xs={12}></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!(values.cadaProjectId && values.role)}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

const mapStateToProps = (state) => ({
  projects: state.cada.projects,
  users: state.cada.users,
});

const mapDispatchToProps = (dispatch) => ({
  addProjectUser: (userId, payload) =>
    dispatch({ type: "ADD_PROJECT_USER", userId, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectUserForm);
