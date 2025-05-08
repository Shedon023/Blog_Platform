import { Box, CircularProgress } from "@mui/material";

export const Loader = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
