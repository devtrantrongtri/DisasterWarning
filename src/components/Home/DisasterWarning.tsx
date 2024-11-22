// import { Box, Typography } from '@mui/material';
// import React from 'react';

// function DisasterWarning() {
//   return (
//     <Box 
//       sx={{ 
//         borderRadius: '8px', 
//         padding: '16px', 
//         maxWidth: '500px',
//         margin: '0 0',
//         // color: "white",
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: 'bold',fontSize: '1.5rem' }}>
//         CẢNH BÁO THIÊN TAI: <hr/>
//         <span style={{ fontSize:"1.5rem" }}> LŨ LỤT</span>
//       </Typography>
//       <Typography variant="body2" sx={{ marginTop: '8px', fontSize: '1rem' }}>
//         <strong>Thời gian:</strong> 12/12/2024
//       </Typography>
//       <Typography variant="body2" sx={{ marginTop: '8px', fontSize: '1rem' }}>
//         <strong>Mô tả:</strong> CẢNH BÁO NGẬP LỤT CỤC BỘ: Mưa lớn với lượng mưa 5,9 mm/giờ. Đề phòng ngập úng tại các khu vực trũng thấp. 
//         Khuyến cáo: Theo dõi thông tin thời tiết. Chuẩn bị các phương án ứng phó với ngập lụt.
//         Vui lòng chuẩn bị và theo dõi các thông báo từ cơ quan chức năng.
//       </Typography>
//     </Box>
//   );
// }

// export default DisasterWarning;

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

const getDisasterWarnings = async () => {
    try {
        const response = await axios.get('http://localhost:8080/disaster-warning-management/disaster-warning', {
            params: {
                page: 0,
                size: 10, // Giới hạn số bản ghi cần lấy
            },
        });
        return response.data.content; // Lấy danh sách cảnh báo từ response
    } catch (error) {
        console.error("Error fetching disaster warnings:", error);
        throw error;
    }
};

interface DisasterWarning {
    disasterWarningId: number;
    startDate: string;
    description: string;
    disaster: {
        disasterName: string;
    };
}

// API chưa test được!!!

// const DisasterWarning: React.FC = () => {
//     const [warnings, setWarnings] = useState<DisasterWarning[]>([]);

//     useEffect(() => {
//         const fetchWarnings = async () => {
//             try {
//                 const data = await getDisasterWarnings();
//                 // Sắp xếp theo startDate giảm dần (mới nhất trước)
//                 const sortedData = data.sort(
//                     (a: DisasterWarning, b: DisasterWarning) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
//                 );
//                 setWarnings(sortedData);
//             } catch (error) {
//                 console.error("Error fetching disaster warnings:", error);
//             }
//         };
//         fetchWarnings();
//     }, []);

//DLieu Giả
const mockData: DisasterWarning[] = [
    {
        disasterWarningId: 1,
        startDate: new Date().toISOString(),
        description: "Cảnh báo ngập lụt cục bộ, cần đề phòng tại các khu vực trũng thấp.",
        disaster: {
            disasterName: "Lũ lụt",
        },
    },
    {
        disasterWarningId: 2,
        startDate: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 giờ trước
        description: "Cảnh báo bão lớn, sức gió mạnh, gây nguy hiểm cho tàu thuyền.",
        disaster: {
            disasterName: "Bão",
        },
    },
];

const DisasterWarning: React.FC = () => {
    const [warnings, setWarnings] = useState<DisasterWarning[]>([]);

    useEffect(() => {
        // Sử dụng dữ liệu giả thay vì gọi API
        const fetchMockData = () => {
            const sortedData = mockData.sort(
                (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            setWarnings(sortedData);
        };

        fetchMockData();
    }, []);

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
                        backgroundColor:'rgba(165, 165, 165, 0.2)'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.6rem", textAlign: "center" }}
                    >
                        CẢNH BÁO THIÊN TAI
                        <hr />
                        <span style={{ fontSize: "1.5rem" }}>{warning.disaster.disasterName}</span>
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
