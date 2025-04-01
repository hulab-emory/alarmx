import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Divider,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import Page from "../common/Page";
import { GoogleIcon, GithubIcon } from "../common/Icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../utils/localStorage";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

async function loginUser(credentials) {
  return fetch("api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

async function loginGithub(code) {
  return fetch("api/auth/github-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
  }).then((data) => data.json());
}

// ----------------------------------------------------------------------

export default function Signin() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState({ message: "", isLoading: false });
  const [checked, setChecked] = useState(localStorage.getItem("apps-remember") ? true : false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignin = async (e) => {
    e.preventDefault();

    if (checked) {
      localStorage.setItem("apps-remember", `${username} ${password}`);
    } else {
      localStorage.removeItem("apps-remember");
    }

    const user = await loginUser({
      username,
      password,
    });
    if (user.message) {
      setState({
        isLoading: false,
        message: user.message,
      });
    } else {
      dispatch({ type: "LOGIN", user: user });
      if (password === "") {
        navigate("/resetpassword")
      } else {
        navigate("/" + Object.values(user.featureUsers)[0].app);
      }
    }
  };

  const handleRMChange = (e) => {
    setChecked(!checked)
  }

  useEffect(() => {
    clearLocalStorage(["apps-remember"]);
  }, []);

  useEffect(() => {
    const handleGithubLogin = async (data) => {
      const user = await loginGithub(data);
      if (user.message) {
        setState({
          isLoading: false,
          message: user.message,
        });
      } else {
        dispatch({ type: "LOGIN", user: user });
        navigate("/" + Object.values(user.featureUsers)[0].app);
      }
    };
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    if (hasCode) {
      const newUrl = url.split("?code=");
      setState(curr => curr.isLoading = false);

      handleGithubLogin({ code: newUrl[1] });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const rememberMe = localStorage.getItem("apps-remember");

    if (rememberMe) {
      setUserName(rememberMe.split(' ')[0])
      setPassword(rememberMe.split(' ')[1])
      setChecked(true)
    }
  }, [setUserName, setPassword, setChecked])

  return (
    <Page title="Signin">
      <RootStyle>
        <Container maxWidth="sm">
          {state.isLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <ContentStyle>
              <Typography variant="h4" gutterBottom>
                Sign in to {process.env.REACT_APP_NAME} Apps
              </Typography>

              <Typography sx={{ color: "text.secondary", mb: 5 }}>
                Enter your credential below.
              </Typography>
              <>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                    onClick={() =>
                      window.location.assign(
                        `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`
                      )
                    }
                  >
                    <GithubIcon />
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                  >
                    <GoogleIcon />
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                  >
                    <Typography variant="body2" sx={{ color: "text" }}>
                      SSO
                    </Typography>
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    OR
                  </Typography>
                </Divider>
              </>
              <form noValidate onSubmit={handleSignin}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ my: 2 }}
                >
                  <FormControlLabel
                    control={<Checkbox name="remember" checked={checked} onChange={handleRMChange} />}
                    label="Remember me"
                  />
                  <Link variant="subtitle2" underline="hover" component={RouterLink} to={`/resetpassword`}>
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </Button>

                {state.message}
              </form>

              <Typography variant="body2" sx={{ mt: 3, textAlign: "right" }}>
                Don’t have an account? {""}
                <Link variant="subtitle2" component={RouterLink} to="/signup">
                  Get started
                </Link>
              </Typography>
            </ContentStyle>
          )}
        </Container>
      </RootStyle>
    </Page>
  );
}
