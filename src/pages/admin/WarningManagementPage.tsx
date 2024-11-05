import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const WarningManagementPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Warning Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Disaster Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Message Content</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>001</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Disaster Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>High</TableCell>
              <TableCell>user01</TableCell>
              <TableCell>Alert content here</TableCell>
              <TableCell>Sent</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WarningManagementPage;
