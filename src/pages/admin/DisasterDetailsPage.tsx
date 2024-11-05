import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const DisasterDetailsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Disaster Detail Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disaster ID</TableCell>
              <TableCell>DisasterDetailID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image source</TableCell>
              <TableCell>Action</TableCell>
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
                <IconButton color="primary">
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
