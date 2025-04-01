import { Typography, Box } from "@mui/material";

export const NoData = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={400}>
      <Typography variant="h6" align="center">
        No data found
      </Typography>
      <Box component="img" src="/assets/nodata.svg" alt="No data" width={300} />
    </Box>
  );
};
