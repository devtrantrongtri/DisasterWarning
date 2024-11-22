import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const DisasterDetailsPage: React.FC = () => {
  return (
    <Box
    sx={{
      padding: 3,
      borderRadius: 4,
      marginBottom: 2,
      textAlign: 'center',
      background: 'transparent', // No background
      backdropFilter: 'blur(10px)', // Optional: blurred effect on background
      color: '#00000', // Text color
      boxShadow: 'none',
      marginTop:-9,
    }}>
      <Typography variant="h4" gutterBottom 
      sx={{

        textAlign: 'center',
        color:'#00000',
      }}>Disaster Detail Management</Typography>
      <TableContainer component={Paper}
      sx={{
        padding: 3,
        borderRadius: 4,
        marginBottom: 2,
        textAlign: 'center',
        background: 'transparent', // No background
        backdropFilter: 'blur(10px)', // Optional: blurred effect on background
        boxShadow: 'none',
        color:'#00000',
      }}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Disaster ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DisasterDetailID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Image source</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>D001</TableCell>
              <TableCell>DD001</TableCell>
              <TableCell>Formation Cause</TableCell>
              <TableCell>Description here</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell>
              <IconButton
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.1)', // Thay đổi màu nền khi hover
                    transform: 'scale(1.1)', // Phóng to nhẹ khi hover
                  },
                }}
              >
                <EditIcon />
              </IconButton>

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DisasterDetailsPage;
