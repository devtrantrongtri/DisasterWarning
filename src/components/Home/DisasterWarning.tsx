import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetWarningQuery } from "../../services/user.service"; // Import hook

const DisasterWarning: React.FC = () => {
  const { data, isLoading, isError } = useGetWarningQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography sx={{ color: "red", textAlign: "center" }}>
        Có lỗi xảy ra khi tải dữ liệu cảnh báo.
      </Typography>
    );
  }

  const { data: warnings } = data;

  return (
    <Box>
      {warnings.map((warning) => (
        <Box
          key={warning.disasterWarningId}
          sx={{
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "500px",
            margin: "16px auto",
            color: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(165, 165, 165, 0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.6rem", textAlign: "center" }}
          >
            CẢNH BÁO THIÊN TAI
            <hr />
            <span style={{ fontSize: "1.5rem" }}>Cảnh báo</span>
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "8px", fontSize: "1rem" }}>
            <strong>Thời gian:</strong>{" "}
            {new Date(warning.startDate).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "8px", fontSize: "1rem" }}>
            <strong>Mô tả:</strong> {warning.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DisasterWarning;
