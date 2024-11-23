import React from "react";
import { Box, Typography } from "@mui/material";
import AboutUsImage from "../../assets/aboutus.png";
const AboutUs: React.FC = () => {

  return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap:10, padding: 6 }}>
      {/* Phần hình ảnh chiếm một nửa */}
      <Box
        component="img"
        src={AboutUsImage}
        alt="Ảnh về chúng tôi"
        sx={{
          width: '700px',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />

      {/* Phần thông tin chiếm một nửa */}
      <Box sx={{ width: '50%'}}>
        <Typography variant="h4" gutterBottom sx={{color:'white', fontWeight:'bold', textAlign:'center'}}>
        - Về chúng tôi -
        </Typography>
        <Typography variant="body1" sx={{color:'white', fontSize:'18px'}}>
        Chúng tôi là một đội ngũ tâm huyết với sứ mệnh xây dựng một cộng đồng an toàn và vững mạnh trước những mối đe dọa từ thiên tai. <br></br><br></br>
        Với niềm tin rằng thông tin chính xác và kịp thời có thể cứu sống được nhiều người, chúng tôi đã phát triển nền tảng quản lý và cảnh báo thiên tai, nơi tích hợp công nghệ và kiến thức để mang đến giải pháp hữu ích cho cộng đồng.<br></br>
        Tầm nhìn của chúng tôi là tạo nên một hệ thống thông minh, nơi mọi người có thể dễ dàng tiếp cận thông tin thiên tai, nhận cảnh báo sớm, và học cách phòng chống rủi ro một cách hiệu quả. <br></br>
        Bằng các công nghệ hiện đại, chúng tôi không chỉ cung cấp dữ liệu mà còn là một cầu nối giữa cộng đồng và các cơ quan chức năng.
        <br></br>Chúng tôi tin rằng, với sự đóng góp của từng cá nhân, chúng ta có thể cùng nhau xây dựng một tương lai an toàn và bền vững hơn. <br></br>
        <br></br>Hãy đồng hành cùng chúng tôi trên hành trình này!        
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutUs;
