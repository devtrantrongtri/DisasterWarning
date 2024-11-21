import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

interface DisasterWarning {
  startDate: string;
  disasterName: string;
  locationName: string;
  description: string;
}

//test data 
const staticWarnings = [
  {
    startDate: '2024-10-01',
    disasterName: 'Lũ lụt',
    locationName: 'Hà Nội',
    description: 'Cảnh báo lũ lụt diện rộng',
  },
  {
    startDate: '2024-10-05',
    disasterName: 'Động đất',
    locationName: 'Đà Nẵng',
    description: 'Động đất với cường độ 5.6',
  },
  {
    startDate: '2024-10-10',
    disasterName: 'Bão',
    locationName: 'Hải Phòng',
    description: 'Bão số 3 tiến vào đất liền',
  },
];



const WarningDisasterPage: React.FC = () => {
  const [warnings, setWarnings] = useState<DisasterWarning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //dùng hàm khi có dữ liệu thực 
  // useEffect(() => {
  //   const fetchWarnings = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8080/disaster-management/disaster/1');
  //       const disasterData = response.data?.data;
  //       const disasterWarnings = disasterData?.disasterWarnings || [];

  //       const formattedWarnings = disasterWarnings.map((warning: any) => ({
  //         startDate: warning.startDate,
  //         disasterName: disasterData.disasterName, // Use disasterName from parent
  //         locationName: warning.location?.locationName || 'Unknown', // Use locationName from warning's location
  //         description: warning.description, // Use description from warning
  //       }));

  //       // Sort warnings by startDate (newest to oldest)
  //       formattedWarnings.sort(
  //         (a: DisasterWarning, b: DisasterWarning) =>
  //           new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  //       );

  //       setWarnings(formattedWarnings);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchWarnings();
  // }, []);

  useEffect(() => {
    const fetchWarnings = async () => {
      // Simulate fetching static data
      const formattedWarnings = staticWarnings.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
  
      setWarnings(formattedWarnings);
      setLoading(false);
    };
  
    fetchWarnings();
  }, []);

  return (
    <Box
      sx={{
        marginTop: '30px', 
        padding: '16px',
        display: 'flex',
        //alignItems: 'center',
        backdropFilter: 'blur(10px)', // Blur effect 
      }}
    >
      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
        {loading ? (
          <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
        ) : warnings.length > 0 ? (
        <Table aria-label="Disaster Warnings Table">
          <TableHead>
            <TableRow>
                <TableCell  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Ngày thông báo
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Loại thiên tai
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}> 
                  Vị trí cảnh báo
                </TableCell>
                <TableCell  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Mô tả thông báo
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warnings.map((warning, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(warning.startDate).toLocaleString()}</TableCell>
                <TableCell>{warning.disasterName}</TableCell>
                <TableCell>{warning.locationName}</TableCell>
                <TableCell>{warning.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p style={{ textAlign: 'center', padding: '20px' }}>No warnings available.</p>
      )}
    </TableContainer>
    </Box>

  );
};




export default WarningDisasterPage;