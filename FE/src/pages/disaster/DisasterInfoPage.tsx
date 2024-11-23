import React, { useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";
import ImageCarousel from "../../components/Test/ImageCarousel";
const baseUrl = import.meta.env.VITE_BASE_URL_V1;
// Định nghĩa kiểu dữ liệu
interface DisasterImage {
  imageId: number;
  imageUrl: string;
  imagePublicId: string;
}

interface DisasterInfo {
  disasterInfoId: number;
  typeInfo: string;
  information: string;
  images: DisasterImage[];
}

const DisasterInfoPage: React.FC = () => {
  const [disasterInfos, setDisasterInfos] = useState<DisasterInfo[]>([]);
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái lỗi

  const handleDisasterSelect = (id: number) => {
    setError(null); // Reset trạng thái lỗi
    setDisasterInfos([]); // Xóa dữ liệu cũ mỗi lần chọn thảm họa mới
  
    axios
      .get(`${baseUrl}/disaster-info-management/disaster-info-disasterName/${id}`)
      .then((response) => {
        setDisasterInfos(response.data.data); // Lấy toàn bộ mảng `data`
      })
      .catch((err) => {
        // Trường hợp lỗi trong quá trình gọi API
        setError("Có lỗi xảy ra khi tải dữ liệu hoặc chưa có dữ liệu về thiên tai này.");
        console.error(err);
      });
  };

  return (
    <Box sx={{ padding: 6, paddingTop: 0, marginTop: "37px", position: "relative" }}>
      {/* Image Carousel */}
      <Paper
        elevation={0}
        sx={{
          marginTop: 5,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          position: "relative",
          borderBottom: 2,
          borderColor:'#2D3A54',
          padding: '36px 16px',
          backdropFilter: "blur(10px)",
        }}
      >
        <ImageCarousel onDisasterSelect={handleDisasterSelect} />
      </Paper>

      {/* Kiểm tra và hiển thị thông báo nếu không có thông tin */}
      {error && (
        <Typography variant="h6"  align="center" sx={{ 
          marginBottom: 4, 
          fontWeight:'bold', 
          padding:'10px 2px', 
          backgroundColor:'rgba(197, 197, 197, 0.3)',
          borderRadius: 10,
          color:"rgb(255, 0, 0)" }}>
          {error}
        </Typography>
      )}

      {/* Thông tin Disaster */}
      <Grid container spacing={4} justifyContent="center">
        {disasterInfos.length > 0 ? (
          disasterInfos.map((info, index) => (
            <React.Fragment key={info.disasterInfoId}>
              {index % 2 === 0 ? (
                <>
                  {/* Nội dung trước, ảnh sau */}
                  <Grid item xs={12} sm={6} md={6} marginBottom={3} marginTop={6}>
                      <Paper
                        elevation={7}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          position: 'relative',
                          padding: '15px 20px',
                          color: 'white',
                          backdropFilter: 'blur(10px)', // Làm mờ ảnh nền phía sau
                        }}
                      >
                      <Typography variant="body1">{info.information}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      position: 'relative',
                    }}
                  >
                      <Typography
                        sx={{
                          position: 'absolute',
                          padding: '160px 320px',
                          borderRadius: '40px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          fontWeight: 'bold',
                        }}
                      >
                      </Typography>
                      
                      <Typography
                        variant="h5"
                        sx={{
                          textShadow:'2px 2px 2px rgba(45, 58, 84, 0.5)',
                          position: 'absolute',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {info.typeInfo}
                      </Typography>
                      {info.images.length > 0 && (
                        <img
                          src={info.images[0].imageUrl}
                          alt={info.typeInfo}
                          style={{
                            height: "320px",
                            width: "640px",
                            objectFit: "cover",
                            borderRadius: "40px",
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                </>
              ) : (
                <>
                  {/* Ảnh trước, nội dung sau */}
                  <Grid item xs={12} sm={6} md={6}>
                  <Paper
                      elevation={0}
                      sx={{
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        position: 'relative',
                      }}
                    >
                      <Typography
                        sx={{
                          position: 'absolute',
                          padding: '160px 320px',
                          borderRadius: '40px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          fontWeight: 'bold',
                        }}
                      >
                      </Typography>
                      
                      <Typography
                        variant="h5"
                        sx={{
                          position: 'absolute',
                          color: 'white',
                          fontWeight: 'bold',
                          textShadow:'2px 2px 2px rgba(45, 58, 84, 0.5)',
                        }}
                      >
                        {info.typeInfo}
                      </Typography>
                      {info.images.length > 0 && (
                        <img
                          src={info.images[0].imageUrl}
                          alt={info.typeInfo}
                          style={{
                            height: "320px",
                            width: "640px",
                            objectFit: "cover",
                            borderRadius: "40px",
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} marginBottom={3} marginTop={6}>
                    <Paper
                      elevation={7}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        position: "relative",
                        padding: "15px 20px",
                        color: "#2D3A54",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Typography variant="body1">{info.information}</Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </React.Fragment>
          ))
        ) : (
            <Typography>
            </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default DisasterInfoPage;
