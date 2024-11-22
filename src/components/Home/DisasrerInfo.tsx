// import React from 'react';
// import { Box, Typography } from '@mui/material';

// interface DisasterInfoProps {
//   imageUrl: string;
//   description: string;
// }


// const DisasterInfo: React.FC<DisasterInfoProps> = ({ imageUrl, description }) => {
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 10 }}>
//       {/* Phần hình ảnh chiếm một nửa */}
//       <Box
//         component="img"
//         src={imageUrl}
//         alt="Ảnh về thiên tai"
//         sx={{
//           width: '50%',
//           height: 'auto',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           objectFit: 'cover',
//         }}
//       />

//       {/* Phần thông tin chiếm một nửa */}
//       <Box sx={{ width: '50%' }}>
//         <Typography variant="h6" gutterBottom>
//           Nội dung về thiên tai trong nước/quốc tế
//         </Typography>
//         <Typography variant="body1">
//           {description}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default DisasterInfo;

import React from "react";
import { Box, Typography } from "@mui/material";
import LamImage from '../../assets/aboutus/Lam.png';
import OngButImage from '../../assets/aboutus/ongbut.png';
import BaoBaoImage from '../../assets/aboutus/baobao.jpg';
import AnhLenImage from '../../assets/aboutus/anhLen.jpg';
import VitImage from '../../assets/aboutus/zitzit.png';
import TriDevImage from '../../assets/aboutus/tridev.png';

const AboutUs: React.FC = () => {
  const members = [
    { name: "Trần Đăng Nam", image: LamImage },
    { name: "Phạm Thanh Trúc", image: OngButImage },
    { name: "Nguyễn Lê Hiếu Nhi", image: AnhLenImage },
    { name: "Trần Trọng Trí", image: TriDevImage },
    { name: "Nguyễn Hoàng Việt", image: VitImage },
    { name: "Huỳnh Nguyễn Quốc Bảo", image: BaoBaoImage },
  ];

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{
        color:'white', 
        fontSize:'35px',
        fontWeight:'bold', 
        textShadow:'2px 2px 2px rgba(170, 208, 206, 0.5)', 
        borderBottom: '3px solid #A2BCC6',
        mb: 3}}>
        - Tổ chức Vươn tầm thế giới -
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap", // Hỗ trợ layout responsive
        }}
      >
        {members.map((member, index) => (
          <Box
            key={index}
            sx={{
              width: "200px",
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src={member.image}
              alt={member.name}
              sx={{
                width: "100%",
                height: "150px",
                borderRadius: "60px",
                objectFit: "cover", // Giữ tỷ lệ ảnh
                boxShadow: 4,
              }}
            />
            <Typography variant="subtitle1" sx={{ marginTop: 1 , color:'#f5efe7', textShadow:'2px 2px 2px rgba(51, 51, 136, 0.8)', fontWeight:'600', fontSize:'16.2px' }}>
              {member.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AboutUs;
