import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DisasterWarning {
  date: string;
  type: string;
  location: string;
  description: string;
}

interface WarningDisasterProps {
  warnings: DisasterWarning[];
}

const WarningDisaster: React.FC<WarningDisasterProps> = ({ warnings }) => {
  return (
    <TableContainer >
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
          {warnings.map((warning) => (
            <TableRow key={warning.date}>
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

export default WarningDisaster;