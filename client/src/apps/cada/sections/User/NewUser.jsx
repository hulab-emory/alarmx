import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { connect } from "react-redux";
import { addUser } from "../../redux/actions";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function User({ userData, open, handleClose, addUser }) {
  const [formData, setFormData] = useState(
    userData
      ? userData
      : {
          firstName: "",
          lastName: "",
          email: "",
          loginType: "",
          role: "",
          isBot: false,
        }
  );

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = (event) => {
    event.preventDefault();

    addUser({
      username: formData.username ? formData.username : formData.email,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      loginType: formData.loginType,
      isBot: formData.isBot,
      role: formData.role,
    });

    handleClose();
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New User</DialogTitle>

        <DialogContent>
          <DialogContentText>
            To add new user, please enter user first and last name, email, login
            type, and role to EventAnnotator.
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="FirstName"
                margin="dense"
                name="firstName"
                onChange={handleFormChange}
                required
                value={formData.firstName ? formData.firstName : ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="LastName"
                margin="dense"
                name="lastName"
                onChange={handleFormChange}
                required
                value={formData.lastName ? formData.lastName : ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                required
                label="Email"
                margin="dense"
                name="email"
                onChange={handleFormChange}
                value={formData.email ? formData.email : ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                select
                fullWidth
                label="LoginType"
                margin="dense"
                name="loginType"
                onChange={handleFormChange}
                required
                value={formData.loginType ? formData.loginType : ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                {["local", "github", "google"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {formData.loginType === "github" && (
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="GitHandle"
                  margin="dense"
                  name="username"
                  onChange={handleFormChange}
                  required
                  value={formData.username ? formData.username : ""}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            <Grid item md={12} xs={12}>
              <TextField
                select
                fullWidth
                name="role"
                label="Role"
                value={formData.role ? formData.role : ""}
                onChange={handleFormChange}
                variant="outlined"
                margin="dense"
                required
                InputLabelProps={{ shrink: true }}
              >
                {["admin", "user"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addUser: (payload) => dispatch(addUser(payload)),
});

export default connect(null, mapDispatchToProps)(User);
