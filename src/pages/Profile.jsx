import * as React from "react";
import { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  Avatar as MuiAvatar,
  Divider,
  CardActions,
  CardHeader,
  TextField,
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Avatar, { genConfig } from "react-nice-avatar";
import UpdateAvatar from "../section/UpdateAvatar";
import axios from "axios";
import { isEqual, object2list } from "../utils/objectFunctions";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Profile() {
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const user = useSelector((state) => state.main.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [config, setConfig] = useState(
    user && user.avatar ? JSON.parse(user.avatar) : {}
  );
  const apps = object2list(user.featureUsers);
  const [open, setOpen] = useState(false);

  const [state, setState] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    login: user.loginType,
    password: "",
    confirm: "",
  });

  const handleChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    if (!user.avatar || !isEqual(config, JSON.parse(user.avatar))) {
      axios({
        method: "put",
        url: `/api/user/${user.id}`,
        data: {
          avatar: JSON.stringify(config),
        },
      })
        .then((res) => {
          console.log(res.data);
          dispatch({
            type: "UPDATE_AVATAR",
            value: {
              avatar: JSON.stringify(config),
            },
          });
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = (app) => {
    navigate(`/${app}`);
  };

  return (
    <>
      <Dialog maxWidth={"lg"} open={open} onClose={handleClose}>
        <DialogTitle>Avatar editor</DialogTitle>
        <DialogContent>
          <UpdateAvatar
            defaultConfig={JSON.parse(user.avatar)}
            setUpdatedConfig={setConfig}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 5,
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* <div>
              <Typography variant="h4">Profile</Typography>
            </div> */}
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <Card sx={{ overflow: "visible" }}>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {user.avatar ? (
                          <Avatar
                            style={{
                              height: "90px",
                              width: "90px",
                              marginBottom: "-30px",
                              transform: "translateY(-50px)",
                            }}
                            {...genConfig(JSON.parse(user.avatar))}
                          />
                        ) : (
                          <MuiAvatar
                            sx={{
                              height: 90,
                              mb: "-30px",
                              width: 90,
                              transform: "translateY(-50px)",
                            }}
                          />
                        )}
                        <Typography gutterBottom variant="h5">
                          {`${user.firstName} ${user.lastName}`}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {user.username}
                        </Typography>
                        {/* <Typography color="primary.text" variant="body2">
                          {user.role}
                        </Typography> */}
                        {/* <Button>
                          {apps[0].value} , {apps[1].value}
                        </Button> */}
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={handleClickOpen}
                      >
                        Build avatar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                        title="Profile"
                        subheader="The information can be edited "
                      />

                      <Divider />
                      <CardContent sx={{ pt: 0 }}>
                        <Box sx={{ mt: 3 }}>
                          <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="First name"
                                name="firstName"
                                onChange={handleChange}
                                required
                                value={state.firstName}
                              />
                            </Grid>
                            <Grid xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Last name"
                                name="lastName"
                                onChange={handleChange}
                                required
                                value={state.lastName}
                              />
                            </Grid>
                            <Grid xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                onChange={handleChange}
                                required
                                value={state.email}
                              />
                            </Grid>
                            <Grid xs={12} md={6}>
                              <TextField
                                fullWidth
                                disabled
                                label="Login Type"
                                name="login"
                                onChange={handleChange}
                                required
                                value={state.login}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained">Update</Button>
                      </CardActions>
                      {/* <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" >
                          <Tab label="Item One" {...a11yProps(0)} />
                          <Tab label="Item Two" {...a11yProps(1)} />
                          <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        Item One
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        Item Two
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        Item Three
                      </TabPanel>
                    </Box> */}
                    </Card>
                  </form>
                </Grid>
                <Grid xs={12} md={6} lg={4}></Grid>
                <Grid xs={12} md={6} lg={8}>
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                        subheader="Manage the notifications"
                        title="Notifications"
                      />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={6} wrap="wrap">
                          <Grid xs={12} sm={6} md={4}>
                            <Stack spacing={1}>
                              <Typography variant="h6">
                                Notifications
                              </Typography>
                              <Stack>
                                <FormControlLabel
                                  control={<Checkbox defaultChecked />}
                                  label="Email"
                                />
                                <FormControlLabel
                                  control={<Checkbox defaultChecked />}
                                  label="Push Notifications"
                                />
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid item md={4} sm={6} xs={12}>
                            <Stack spacing={1}>
                              <Typography variant="h6">Comments</Typography>
                              <Stack>
                                <FormControlLabel
                                  control={<Checkbox defaultChecked />}
                                  label="Email"
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Push Notifications"
                                />
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained">Update</Button>
                      </CardActions>
                    </Card>
                  </form>
                </Grid>
                <Grid xs={12} md={6} lg={4}></Grid>
                <Grid xs={12} md={6} lg={8}>
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                        title="Apps"
                        subheader="Request app permission change here."
                      />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          {apps.map((app) => {
                            return (
                              <Grid xs={12} md={12} key={app.key}>
                                <Button
                                  onClick={() =>
                                    handleNavigate(app.value.app.toLowerCase())
                                  }
                                >
                                  {app.value.app}
                                </Button>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained">Update</Button>
                      </CardActions>
                    </Card>
                  </form>
                </Grid>
                <Grid xs={12} md={6} lg={4}></Grid>
                <Grid xs={12} md={6} lg={8}>
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader
                        title="Password"
                        subheader="Update password"
                      />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Password"
                              name="password"
                              onChange={handleChange}
                              type="password"
                              value={state.password}
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Password (Confirm)"
                              name="confirm"
                              onChange={handleChange}
                              type="password"
                              value={state.confirm}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained">Update</Button>
                      </CardActions>
                    </Card>
                  </form>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
