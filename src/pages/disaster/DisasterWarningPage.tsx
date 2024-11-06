import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DisasterWarning {
  date: string;
  type: string;
  location: string;
  description: string;
}

const WarningDisasterPage: React.FC = () => {
  // Dữ liệu giả
  const warnings: DisasterWarning[] = [
    { date: '2024-10-01', type: 'Lũ lụt', location: 'Hà Nội', description: 'Cảnh báo lũ lụt diện rộng' },
    { date: '2024-10-05', type: 'Động đất', location: 'Đà Nẵng', description: 'Động đất với cường độ 5.6' },
    { date: '2024-10-10', type: 'Bão', location: 'Hải Phòng', description: 'Bão số 3 tiến vào đất liền' },
    { date: '2024-10-15', type: 'Sạt lở đất', location: 'Lai Châu', description: 'Cảnh báo nguy cơ sạt lở đất' },
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ngày thông báo</TableCell>
            <TableCell>Loại thiên tai</TableCell>
            <TableCell>Vị trí cảnh báo</TableCell>
            <TableCell>Mô tả thông báo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warnings.map((warning, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {warning.date}
              </TableCell>
              <TableCell>{warning.type}</TableCell>
              <TableCell>{warning.location}</TableCell>
              <TableCell>{warning.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WarningDisasterPage;
