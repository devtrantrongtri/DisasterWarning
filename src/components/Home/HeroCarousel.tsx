import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Import ảnh từ thư mục assets
import heroItem1 from "../../assets/chayrung.png";
import heroItem2 from "../../assets/cloud1.jpg";

function HeroCarousel() {
  const slides = [
    {
      title: "SẢN PHẨM MỚI",
      subtitle: "Sản phẩm HOT 2024",
      description: "Đây là sản phẩm mới nhất của năm 2024, mang đến chất lượng và sự đổi mới vượt bậc.",
      image: heroItem1,
    },
    {
      title: "SẢN PHẨM MUA NHIỀU NHẤT",
      subtitle: "Sản phẩm HOT 2024",
      description: "Sản phẩm bán chạy nhất với sự yêu thích từ khách hàng khắp mọi nơi.",
      image: heroItem2,
    },
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Carousel
        autoPlay
        infiniteLoop
        interval={5000}
        showThumbs={false}
        showStatus={false}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              px: 4,
              py: 6,
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                  <Typography variant="h6" sx={{ fontSize: "1.4rem", mb: 2 }}>
                    {slide.subtitle}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.5rem",
                      maxWidth: "80%",
                      margin: { xs: "0 auto", md: "unset" },
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 3,
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#115293" },
                    }}
                  >
                    ĐI ĐẾN SHOP
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      maxWidth: "100%",
                      width: "90%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}

export default HeroCarousel;
