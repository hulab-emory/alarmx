import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import Page from "../common/Page";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PrivacyPolicy from "../section/PrivacyPolicy";
import TermsOfService from "../section/TermsOfService";
import { validPassword } from "../utils/password";
import { isEmail } from "../utils/isEmail";

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
}));

// ----------------------------------------------------------------------

const pwdAlert = `Password incorrect. Please ensure that your password:
Contains at least one uppercase letter; 
Contains at least one lowercase letter; 
Contains at least one digit; 
Contains at least one special character ($@,_.?!#*); 
Is between 8 and 20 characters in length.`;

const emailAlert = "This doesn't look like an email address to me."

// ----------------------------------------------------------------------

function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false);

  const navigate = useNavigate()

  const handleFirstnameChange = (e) => {
    if (message === "Please complete the form!" && !firstName) {
      setMessage("")
    }
    setFirstName(e.target.value)
  }

  const handleLastnameChange = (e) => {
    if (message === "Please complete the form!" && !lastName) {
      setMessage("")
    }
    setLastName(e.target.value)
  }

  const handleEmailChange = (e) => {
    if ((message === "Please complete the form!" && !email) || message === emailAlert) {
      setMessage("")
    }
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    if (message === "Please complete the form!" && !password) {
      setMessage("")
    }
    if (message === pwdAlert) {
      setMessage("")
    }
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setMessage("Please complete the form!")
      return
    }
    if (!isEmail(email)) {
      setMessage(emailAlert)
      return
    }

    if (!validPassword(password)) {
      setMessage(pwdAlert)
      return
    }

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      username: email,
      email: email,
      password: password,
      loginType: 'local',
      isBot: 0
    }

    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(result => {
        if (result.message === "success") {
          newUser['featureUsers'] = {};
          newUser['id'] = result.user.id;
          props.login(newUser);
          let count = 3;
          setMessage(`Successfully signed up! Relocating in ${count} seconds...`);
          const interval = setInterval(() => {
            count -= 1;
            if (count > 0) {
              setMessage(`Successfully signed up! Relocating in ${count} seconds...`);
            } else {
              clearInterval(interval);
              navigate("/feature");
            }
          }, 1000);
        } else {
          setMessage(result.message);
        }
      })
      .catch(err => {
        console.error(err);
        setMessage(err.message);
      });
  };

  const handlePrivacyPolicy = () => {
    setPrivacyPolicyOpen(true);
  };

  const handleTermsOfService = () => {
    setTermsOfServiceOpen(true);
  };

  return (
    <Page title="Signup">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Get started with {process.env.REACT_APP_NAME}  Apps.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Absolutely free in the name of science.
            </Typography>

            <form noValidate onSubmit={handleSubmit}>
              <Stack direction="row" spacing={2} paddingBlock={1}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstname"
                  label="First name"
                  name="firstname"
                  autoComplete="firstname"
                  autoFocus
                  value={firstName}
                  onChange={handleFirstnameChange}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="last name"
                  label="Last name"
                  name="last name"
                  autoComplete="last name"
                  autoFocus
                  value={lastName}
                  onChange={handleLastnameChange}
                />
              </Stack>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
              />

              <Typography
                variant="body2"
                align="left"
                sx={{ color: "text.secondary", mt: 2, mb: 2 }}
              >
                By signing up, I agree to {process.env.REACT_APP_NAME} Apps&nbsp;
                <Link
                  underline="always"
                  color="text.primary"
                  href="#"
                  onClick={handleTermsOfService}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  underline="always"
                  color="text.primary"
                  href="#"
                  onClick={handlePrivacyPolicy}
                >
                  Privacy Policy
                </Link>
                .
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
            </form>

            {message}
            <Typography variant="body2" sx={{ mt: 3, textAlign: "right" }}>
              Already have an account?{" "}
              <Link variant="subtitle2" to="/signin" component={RouterLink}>
                Sign in
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>

      <PrivacyPolicy open={privacyPolicyOpen} setOpen={setPrivacyPolicyOpen} />
      <TermsOfService
        open={termsOfServiceOpen}
        setOpen={setTermsOfServiceOpen}
      />
    </Page>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (e) => dispatch({ type: "SET_USER", user: e }),
  login: (user) => dispatch({ type: "LOGIN", user: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
