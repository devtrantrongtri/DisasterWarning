import React, { useState, useEffect } from "react";
import { Box, styled, Typography } from "@mui/material";
import axios from "axios";

// Định nghĩa kiểu cho hình ảnh
interface DisasterImage {
  id: number;
  src: string;
  alt: string;
  name: string; // Thêm trường name để lưu tên thảm họa
}

// Styled components
const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  height: "700px",
  position: "relative",
}));

const LargeImage = styled("img")({
  width: "100vh",
  height: "auto",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.1)",
  }
});

const SmallImage = styled("img")({
  width: "40vh",
  height: "auto",
  margin: "0 20px",
  opacity: 0.7,
  borderRadius: "4rem",
  transition: "opacity 0.3s, transform 0.3s",
  "&:hover": {
    opacity: 1,
    transform: "scale(1.1)",
  },
});

const Caption = styled(Typography)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateX(-50%)", // Đảm bảo căn giữa
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "36px",
  backgroundColor: "rgba(45, 58, 84, 0.5)",
  padding: "20px 20px",
  borderRadius: 24,
  boxShadow:'1px 1px 2px 2px rgba(45, 58, 84)'
});
const baseUrl = import.meta.env.VITE_BASE_URL_V1;
const ImageCarousel: React.FC<{ onDisasterSelect: (id: number) => void }> = ({
  onDisasterSelect,
}) => {
  const [images, setImages] = useState<DisasterImage[]>([]); // Khai báo kiểu cụ thể
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch data từ API
    axios.get(`${baseUrl}/disaster-management/disaster`).then((response) => {
      const disasters = response.data.data.content; // Dữ liệu từ API
      const formattedImages: DisasterImage[] = disasters.map((disaster: any) => ({
        id: disaster.disasterId,
        src: disaster.imageUrl,
        alt: disaster.disasterName,
        name: disaster.disasterName, // Thêm disasterName vào dữ liệu ảnh
      }));
      setImages(formattedImages);
    });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleSelect = (id: number) => {
    onDisasterSelect(id);
  };

  return (
    <ImageWrapper>
      {images.length > 0 && (
        <>
          <SmallImage
            src={images[(currentIndex - 1 + images.length) % images.length].src}
            alt={images[(currentIndex - 1 + images.length) % images.length].alt}
            onClick={handlePrev}
          />
          <Box position="relative">
            <LargeImage
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              onClick={() => handleSelect(images[currentIndex].id)}
            />
            {/* Hiển thị tên thảm họa bên dưới ảnh */}
            <Caption>{images[currentIndex].name}</Caption>
          </Box>
          <SmallImage
            src={images[(currentIndex + 1) % images.length].src}
            alt={images[(currentIndex + 1) % images.length].alt}
            onClick={handleNext}
          />
        </>
      )}
    </ImageWrapper>
  );
};

export default ImageCarousel;
