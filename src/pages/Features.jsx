import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Page from "../common/Page";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import deepCopy from "../utils/deepcopy";
import { CardActionArea, CardActions } from "@mui/material";

// const initActive = (features) => {
//   let res = {}
//   if (features) {
//     for (const feature of features) {
//       res[feature.id] = false
//     }
//   }

//   return res
// }

export default function Features() {
  const user = useSelector((state) => state.main.user);
  const features = useSelector((state) =>
    state.main.features ? state.main.features : null
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (features === null) {
      axios({
        method: "get",
        url: `/api/feature`,
      })
        .then((result) => {
          dispatch({ type: "GET_FEATURES", features: result.data });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dispatch, features]);

  const handleSignup = (feature) => {
    const newUser = deepCopy(user)
    axios({
      method: "post",
      url: `/api/feature/${feature.id}/users`,
      data: {
        username: user.username,
        role: 'Regular',
        status: 'Active'
      }
    })
      .then((result) => {
        newUser.featureUsers[feature.id] = {
          app: feature.name,
          role: 'Regular',
        }
        dispatch({
          type: "LOGIN",
          user: newUser,
        });
        navigate(`/${feature.name}`)
      })
      .catch((err) => {
        console.error(err);
      })
  };

  return (
    <Page title="Features">
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 20, pb: 10 }}
      >
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          CHoRUS Apps
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          component="p"
        >
          Below apps are producs of CHoRUS. Hope you enjoy AND give us feedback
          for more improvements.
        </Typography>
      </Container>
      <Container maxWidth="lg" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {features &&
            features.map((feature) => {
              const disabled = user ? !Object.keys(user.featureUsers).map(Number).includes(feature.id) : true;
              return (<Grid item key={feature.name} xs={12} sm={6} md={4}>
                <Card
                  key={feature.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: '10px',
                    minHeight: '300px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '2px 2px 5px rgb(211, 211, 211)',
                    cursor: disabled ? 'default' : 'pointer',
                    transition: '0.3s',
                  }}
                  onClick={disabled ? () => { } : () => navigate(`/${feature.name}`)}
                >
                  <Typography
                    variant="h3"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      pt: 4,
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: disabled && !feature.allowSignup ? "rgb(182, 182, 182)" : "",
                      userSelect: 'none',
                    }}
                  >
                    {feature.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    // color="text.main"
                    gutterBottom
                    sx={{
                      p: 0,
                      textAlign: "center",
                      color: disabled && !feature.allowSignup ? "rgb(182, 182, 182)" : "rgb(120, 120, 120)",
                      userSelect: 'none',
                    }}
                  >
                    {user && user.featureUsers[feature.id]
                      ? user.featureUsers[feature.id].role
                      : "-"}
                  </Typography>

                  <CardContent>
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "baseline",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        minHeight: 50,
                        maxWidth: 400,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h7" color="text.primary" sx={{
                        color: disabled && !feature.allowSignup ? "rgb(182, 182, 182)" : "",
                        userSelect: 'none',
                      }}>
                        {feature.description === "" ?
                          "This is a app description for now. There will be better description. Hang in there, please!"
                          : feature.description}
                      </Typography>
                    </Box>
                  </CardContent>
                  {
                    (feature.allowSignup || !disabled) &&
                    <CardActionArea onClick={() => disabled ? handleSignup(feature) : navigate(`/${feature.name}`)}>
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Typography textAlign='center' alignSelf='center' color='gray'>{disabled ? "Sign Up" : "Enter"}</Typography>
                      </CardActions>
                    </CardActionArea>
                  }
                </Card>
              </Grid>)
            })}
        </Grid>
      </Container>
    </Page>
  );
}
