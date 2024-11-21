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

const AboutUs: React.FC = () => {
  const members = [
    { name: "Trần Đăng Nam", image: LamImage },
    { name: "Member 2", image: OngButImage },
    { name: "Member 3", image: BaoBaoImage },
    { name: "Member 4", image: "link_to_image_4.jpg" },
    { name: "Member 5", image: "link_to_image_5.jpg" },
    { name: "Member 6", image: "link_to_image_6.jpg" },
  ];

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        About Us
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
              width: "150px",
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
                borderRadius: "8px",
                objectFit: "cover", // Giữ tỷ lệ ảnh
                boxShadow: 1,
              }}
            />
            <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
              {member.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AboutUs;
