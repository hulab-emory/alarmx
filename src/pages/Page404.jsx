import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button, Typography, Container } from "@mui/material";
import Page from "../common/Page";

// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

const ButtonStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(6, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="404 Page Not Found">
      <Container>
        <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            We couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>

          <ButtonStyle>
            <Button
              to="/"
              size="large"
              variant="contained"
              component={RouterLink}
            >
              Go to Home
            </Button>
          </ButtonStyle>
        </ContentStyle>
      </Container>
    </Page>
  );
}
