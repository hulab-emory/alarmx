import { styled } from "@mui/material/styles";
import { Button, Typography, Container } from "@mui/material";
import Page from "../common/Page";

import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <Page title="Out of Order">
      <Container>
        <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="h3" paragraph>
            Sorry, we are working on this!
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            We couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>

          <ButtonStyle>
            <Button
              onClick={() => navigate(-1)}
              size="large"
              variant="contained"
            >
              Go Back
            </Button>
          </ButtonStyle>
        </ContentStyle>
      </Container>
    </Page>
  );
}
