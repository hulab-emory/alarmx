import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const NoContent = ({ text="No Content", subtext ="Contact your admin for content"}) => {
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
        {text}
      </Typography>

      <Typography sx={{ color: "text.secondary" }}>
        {subtext}
      </Typography>
    </Container>
  );
};
