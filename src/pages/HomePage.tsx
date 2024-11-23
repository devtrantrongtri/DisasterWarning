import React from "react";
import { Box, Grid } from "@mui/material";
import WeatherDashboard from "../components/Home/WeatherDashboard";
import AboutUs from "../components/Home/DisasrerInfo";
import DisasterWarning from "../components/Home/DisasterWarning";

const HomePage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                flex: 1,
                margin: "64px",
                boxShadow: 3,
                padding: "16px",
                borderRadius: "8px",
                backdropFilter: "blur(10px)",
              }}
            >
              <WeatherDashboard />
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
            <Box
              sx={{
                flex: 1,
                margin: "64px ",
                boxShadow: 3,
                padding: "32px",
                borderRadius: "8px",
                backdropFilter: "blur(20px)",
                overflow: "auto",
              }}
            >
              <DisasterWarning />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          margin: "20px 64px 64px 64px",
          boxShadow: 3,
          padding: "10px",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
        }}
      >
        <AboutUs />
      </Box>
    </Box>
  );
};

export default HomePage;
