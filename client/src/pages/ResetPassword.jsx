import React, { useState } from 'react'
import Page from '../common/Page'
import { Button, Container, TextField, Typography } from '@mui/material'
import { validPassword } from '../utils/password';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const pwdAlert = `Password invalid. Is between 4 and 20 characters in length?`;

function ResetPassword({ setUser }) {

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("no");
  const [username, setUsername] = useState("");

  // const [searchParams] = useSearchParams();
  // const username = searchParams.getAll('username')[0];

  const handleReset = () => {
    if (!username) {
      return setMessage("Please enter your username")
    }

    if (!validPassword(password)) {
      return setMessage(pwdAlert);
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords don't match");
    }

    axios({
      method: "post",
      url: `/api/user/resetPassword`,
      data: {
        username,
        password
      }
    }).then((res) => {
      setUser(res.data)
      let count = 3;
      setMessage(`Successfully reset! Relocating in ${count} seconds...`);
      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setMessage(`Successfully reset! Relocating in ${count} seconds...`);
        } else {
          clearInterval(interval);
          navigate("/feature");
        }
      }, 1000);
    }).catch(err => {
      console.error(err)
      setMessage(err.message)
    });

  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setMessage("no")
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setMessage("no")
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    setMessage("no")
  }

  return (
    <Page title="Reset Password">
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 20, pb: 10 }}
      >
        <Typography
          component="h2"
          variant="h5"
          align="center"
          sx={{
            marginBottom: 2,
          }}
        >
          Please reset your password
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          type="text"
          name="username"
          autoComplete="Username"
          autoFocus
          value={username}
          onChange={handleUsernameChange}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          type="password"
          name="password"
          autoComplete="Password"
          autoFocus
          value={password}
          onChange={handlePasswordChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />

        <Typography
          sx={{
            color: message === "no" ? "transparent" : ""
          }}
        >
          {message}
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
          }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Container>
    </Page>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUser: (e) => dispatch({ type: "LOGIN", user: e }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
