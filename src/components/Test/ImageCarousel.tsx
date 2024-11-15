import React, { useState } from "react";
import { Box, styled } from "@mui/material";

// Dữ liệu ảnh mẫu
const images = [
  { src: "https://images2.thanhnien.vn/528068263637045248/2023/8/15/thien-tai-16921180266262102166481.png", alt: "Image 1" },
  { src: "https://ktmt.vnmediacdn.com/images/2023/10/04/13-1696392896-anh-thien-tai-1.jpg", alt: "Image 2" },
  { src: "https://ktmt.vnmediacdn.com/images/2024/11/13/92-1731488024-cnn-digital-satellite-vis-copy.jpg", alt: "Image 3" },
  { src: "https://images2.thanhnien.vn/528068263637045248/2023/8/15/thien-tai-16921180266262102166481.png", alt: "Image 4" },
  { src: "https://ktmt.vnmediacdn.com/images/2024/11/13/92-1731488207-gettyimages-2179622148-12-09-27-pm-copy.jpg", alt: "Image 5" },
];

// Styled components với Material-UI
const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  height: "700px",
}));

const LargeImage = styled("img")({
  width: "100vh", // Ảnh lớn chiếm 40%
  height: "auto",
  borderRadius: "4rem",
  transition: "transform 0.3s, opacity 0.3s",
});

const SmallImage = styled("img")({
  width: "40vh", // Ảnh nhỏ chiếm 20%
  height: "auto",
  margin: "0 10px",
  opacity: 0.7,
  borderRadius: "4rem",
  transition: "opacity 0.3s, transform 0.3s",
  "&:hover": {
    opacity: 1,
    transform: "scale(1.1)",
  },
});

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Vị trí ảnh lớn ban đầu
  const [startX, setStartX] = useState<number | null>(null);
 // Chuyển ảnh sang trái
 const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Chuyển ảnh sang phải
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX !== null) {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        // Vuốt sang trái
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else if (startX - endX < -50) {
        // Vuốt sang phải
        setCurrentIndex((prevIndex) =>
          prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
        );
      }
    }
  };

  return (
    <ImageWrapper
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
    {/* Ảnh nhỏ bên trái */}
    <SmallImage
        src={images[(currentIndex - 1 + images.length) % images.length].src}
        alt={images[(currentIndex - 1 + images.length) % images.length].alt}
        onClick={handlePrev}
        style={{ cursor: "pointer" }}
      />

      {/* Ảnh lớn ở giữa */}
      <LargeImage
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
      />

      {/* Ảnh nhỏ bên phải */}
      <SmallImage
        src={images[(currentIndex + 1) % images.length].src}
        alt={images[(currentIndex + 1) % images.length].alt}
        onClick={handleNext}
        style={{ cursor: "pointer" }}
      />
    </ImageWrapper>
  );
};
export default ImageCarousel;