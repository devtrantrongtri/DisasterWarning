import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const DisasterInfoPage: React.FC = () => {
  return (//padding 4 tương đương 32px --> 1 = 8px
    <Box sx={{ padding: 6, paddingTop:0 , backgroundColor: '#F8F8FF', marginTop :'37px', position: 'relative'}}> 
      {/* Hình ảnh lớn với tiêu đề NGUYÊN NHÂN HÌNH THÀNH */}
      <Paper
        elevation={0}
        sx={{
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          position: 'relative',
        }}
      >      

      <img src = "https://www.sify.com/wp-content/uploads/2024/01/natural_disaster_collage_flickr.jpg"
      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius:'40px' ,border:'3px solid white' }}></img>
      </Paper>

      {/* Các phần khác với hình ảnh và tiêu đề */}
      <Grid container spacing={4} justifyContent="center">
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
                color: 'white',
                padding: '160px 320px',
                borderRadius: '40px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
              }}
            >NGUYÊN NHÂN HÌNH THÀNH
            </Typography>
            <img src = "https://cdn.pixabay.com/photo/2024/03/15/15/23/ai-generated-8635240_640.jpg"
            style={{ maxHeight: '320px', maxWidth: '700px', objectFit: 'cover', borderRadius:'40px' }}></img>
          </Paper>
        </Grid>

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
              color: '#4F4F4F',
            }}
          >
            
            <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi iste corrupti ea facilis repellat a debitis pariatur inventore ratione voluptatum. Molestias aperiam provident laboriosam totam tenetur ullam odit quas voluptate?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sequi molestiae nisi, doloribus quia, explicabo aut dolorum consequatur a dolorem temporibus cumque eveniet vel culpa id praesentium? Voluptatibus, non repellat. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet cumque ex quo magni voluptates, assumenda quasi perferendis nemo doloremque provident cum molestiae consectetur facere quae, vel illum exercitationem expedita ullam! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus, itaque voluptate quidem totam voluptatum sapiente? Aperiam, saepe accusantium. Ipsum id quidem rem quasi ab impedit iusto illo repellendus eveniet ea!</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={6} marginTop={6}>
        <Paper
            elevation={7}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              position: 'relative',
              padding: '15px 20px',
              color: '#4F4F4F',
            }}
          >
            
            <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi iste corrupti ea facilis repellat a debitis pariatur inventore ratione voluptatum. Molestias aperiam provident laboriosam totam tenetur ullam odit quas voluptate?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sequi molestiae nisi, doloribus quia, explicabo aut dolorum consequatur a dolorem temporibus cumque eveniet vel culpa id praesentium? Voluptatibus, non repellat. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet cumque ex quo magni voluptates, assumenda quasi perferendis nemo doloremque provident cum molestiae consectetur facere quae, vel illum exercitationem expedita ullam! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus, itaque voluptate quidem totam voluptatum sapiente? Aperiam, saepe accusantium. Ipsum id quidem rem quasi ab impedit iusto illo repellendus eveniet ea!</Typography>
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
                color: 'white',
                padding: '160px 320px',
                borderRadius: '40px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
              }}
            >
              SỰ TÀN PHÁ
            </Typography>

            <img src = "https://cdn.pixabay.com/photo/2024/03/15/15/23/ai-generated-8635240_640.jpg"
            style={{ maxHeight: '320px', maxWidth: '700px', objectFit: 'cover', borderRadius:'40px' }}></img>
          </Paper>
        </Grid>

      </Grid>
      <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6} md={6} >
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
                color: 'white',
                padding: '160px 320px',
                borderRadius: '40px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
              }}
            >
              CÁCH PHÒNG CHỐNG
            </Typography>

            <img src = "https://cdn.pixabay.com/photo/2024/03/15/15/23/ai-generated-8635240_640.jpg"
            style={{ maxHeight: '320px', maxWidth: '700px', objectFit: 'cover', borderRadius:'40px' }}></img>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6} marginTop={6}>
        <Paper
            elevation={7}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              position: 'relative',
              padding: '15px 20px',
              color: '#4F4F4F',
            }}
          >
            
            <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi iste corrupti ea facilis repellat a debitis pariatur inventore ratione voluptatum. Molestias aperiam provident laboriosam totam tenetur ullam odit quas voluptate?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sequi molestiae nisi, doloribus quia, explicabo aut dolorum consequatur a dolorem temporibus cumque eveniet vel culpa id praesentium? Voluptatibus, non repellat. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet cumque ex quo magni voluptates, assumenda quasi perferendis nemo doloremque provident cum molestiae consectetur facere quae, vel illum exercitationem expedita ullam! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus, itaque voluptate quidem totam voluptatum sapiente? Aperiam, saepe accusantium. Ipsum id quidem rem quasi ab impedit iusto illo repellendus eveniet ea!</Typography>
          </Paper>
        </Grid>
      </Grid>


    </Box>
  );
  };
  
  export default DisasterInfoPage;