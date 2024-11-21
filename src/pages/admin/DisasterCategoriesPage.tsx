import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Pagination,
  Snackbar,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useGetDisastersQuery,
  useCreateDisasterMutation,
  useCreateDisasterInfoMutation,
  useDeleteDisasterMutation
} from '../../services/disaster.service';
import { 
  Disaster, 
  DisasterImage,
  DisasterInfo, 
  CreateDisasterRequest, 
  CreateDisasterInfoRequest,
  PageReq 
} from '../../interfaces/DisasterType';

const DisasterCategoriesPage: React.FC = () => {
  const [pageReq, setPageReq] = useState<PageReq>({ page: 0, size: 5 });

  const [openDialog, setOpenDialog] = useState(false);
  const [disasterForm, setDisasterForm] = useState<Partial<Disaster>>({
    disasterName: '',
    imageUrl: '',
    imageFile: undefined,
    description: '',
    disasterInfos: [],
    disasterWarnings: []
  });

  const [disasterInfoForm, setDisasterInfoForm] = useState<Partial<DisasterInfo>>({
    typeInfo: '',
    information: '',
    images: [] as DisasterImage[]
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info'
  });

  const [expandedDisasterId, setExpandedDisasterId] = useState<number | null>(null); // Trạng thái để theo dõi hàng mở rộng

  const { data: disasters, isLoading, isError } = useGetDisastersQuery({ page: pageReq.page, size: pageReq.size });
  const [createDisaster] = useCreateDisasterMutation();
  const [createDisasterInfo] = useCreateDisasterInfoMutation();
  const [deleteDisaster] = useDeleteDisasterMutation();

  const handleOpenDialog = () => {
    setDisasterForm({
      disasterName: '',
      imageUrl: '',
      description: '',
      disasterInfos: [],
      disasterWarnings: []
    });
    setDisasterInfoForm({
      typeInfo: '',
      information: '',
      images: []
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveDisasterAndInfo = async () => {
    try {
      const images = disasterForm.imageFile;
      const createDisasterRequest: CreateDisasterRequest = {
        disaster: {
          disasterName: disasterForm.disasterName || '',
          description: disasterForm.description || ''
        },
        images
      };
  
      const disasterResponse = await createDisaster(createDisasterRequest).unwrap();
  
      if (disasterResponse?.data) {
        const disaster = disasterResponse.data;
  
        const disasterInfos = disasterForm.disasterInfos ?? [];
        console.log('Disaster Infos:', disasterInfos);
  
        for (let i = 0; i < disasterInfos.length; i++) {
          const disasterInfoData = disasterInfos[i];
  
          const createDisasterInfoRequest: CreateDisasterInfoRequest = {
            disasterInfo: {
              typeInfo: disasterInfoData.typeInfo || '',
              information: disasterInfoData.information || '',
              disaster: disaster,
            },
            images: disasterInfoData?.images || []
          };
  
          console.log('Create Disaster Info Request:', createDisasterInfoRequest);

          await createDisasterInfo(createDisasterInfoRequest).unwrap();
        }
  
        setSnackbar({
          open: true,
          message: 'Disaster and info created successfully',
          severity: 'success'
        });
        handleCloseDialog();
      } else {
        throw new Error('Failed to create disaster');
      }
    } catch (error) {
      let errorMessage = 'Error creating disaster and info';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
  
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };  

  const handleDeleteDisaster = async (disasterId: number) => {
    try {
      await deleteDisaster(disasterId).unwrap();
      setSnackbar({
        open: true,
        message: 'Disaster deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting disaster',
        severity: 'error'
      });
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPageReq((prev) => ({
      ...prev,
      page: newPage - 1
    }));
  };

  const handleAddDisasterInfo = () => {
    setDisasterForm((prev) => ({
      ...prev,
      disasterInfos: [
        ...(prev.disasterInfos || []),
        {
          disasterInfoId: 0,
          typeInfo: '',
          information: '',
          disaster: {} as Disaster,
          images: [] as DisasterImage[],
        } as DisasterInfo,
      ],
    }));
  };

  const handleDisasterInfoChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setDisasterForm((prev) => {
      const newDisasterInfos = [...(prev.disasterInfos || [])];
      newDisasterInfos[index] = {
        ...newDisasterInfos[index],
        [field]: value
      };
      return {
        ...prev,
        disasterInfos: newDisasterInfos
      };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files) {
      const imageFiles: DisasterImage[] = Array.from(files).map((file) => ({
        imageFile: file
      }));
      setDisasterForm((prev) => {
        const newDisasterInfos = [...(prev.disasterInfos || [])];
        newDisasterInfos[index] = {
          ...newDisasterInfos[index],
          images: [...(newDisasterInfos[index]?.images || []), ...imageFiles]
        };
        return {
          ...prev,
          disasterInfos: newDisasterInfos
        };
      });
    }
  };

  const handleDeleteImage = (index: number, imageIndex: number) => {
    setDisasterForm((prev) => {
      const newDisasterInfos = [...(prev.disasterInfos || [])];
      newDisasterInfos[index] = {
        ...newDisasterInfos[index],
        images: newDisasterInfos[index]?.images?.filter((_, i) => i !== imageIndex) || []
      };
      return {
        ...prev,
        disasterInfos: newDisasterInfos
      };
    });
  };

  const toggleDisasterInfoVisibility = (disasterId: number) => {
    setExpandedDisasterId((prev) => (prev === disasterId ? null : disasterId));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !disasters) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">
          There was an error fetching disaster data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Disaster Categories Management</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add New Disaster
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disasters.content?.map((disaster) => (
              <React.Fragment key={disaster.disasterId}>
                <TableRow onClick={() => toggleDisasterInfoVisibility(disaster.disasterId)}>
                  <TableCell>{disaster.disasterId}</TableCell>
                  <TableCell>{disaster.disasterName}</TableCell>
                  <TableCell>{disaster.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteDisaster(disaster.disasterId)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton>
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expandedDisasterId === disaster.disasterId && disaster.disasterInfos?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type Info</TableCell>
                            <TableCell>Information</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {disaster.disasterInfos.map((info, index) => (
                            <TableRow key={index}>
                              <TableCell>{disaster.disasterId}</TableCell>
                              <TableCell>{info.typeInfo}</TableCell>
                              <TableCell>{info.information}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleDeleteDisaster(disaster.disasterId)}>
                                  <DeleteIcon color="error" />
                                </IconButton>
                                <IconButton>
                                  <EditIcon color="primary" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={disasters?.totalPages || 0}
        page={pageReq.page + 1}
        onChange={handleChangePage} color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
      />

      {/* Dialog for adding disaster and disaster info */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Disaster</DialogTitle>
        <DialogContent>
          <TextField
            label="Disaster Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={disasterForm.disasterName || ''}
            onChange={(e) => setDisasterForm({ ...disasterForm, disasterName: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            margin="normal"
            value={disasterForm.description || ''}
            onChange={(e) => setDisasterForm({ ...disasterForm, description: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setDisasterForm({ ...disasterForm, imageFile: file });
            }}
          />
          {(disasterForm.disasterInfos?.length || 0) > 0 && disasterForm?.disasterInfos?.map((info, index) => (
            <Box key={index}>
              <TextField
                label="Info Type"
                fullWidth
                variant="outlined"
                margin="normal"
                value={info.typeInfo || ''}
                onChange={(e) => handleDisasterInfoChange(index, 'typeInfo', e.target.value)}
              />
              <TextField
                label="Information"
                fullWidth
                variant="outlined"
                margin="normal"
                value={info.information || ''}
                onChange={(e) => handleDisasterInfoChange(index, 'information', e.target.value)}
              />
              <input
                type="file"
                multiple
                onChange={(e) => handleImageUpload(e, index)}
              />
              {info.images && info.images.map((image, imgIndex) => (
                <Grid container key={imgIndex} alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="body2">{image.imageFile?.name}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => handleDeleteImage(index, imgIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          ))}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddDisasterInfo}
            sx={{ mt: 2 }}
          >
            Add Disaster Info
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveDisasterAndInfo} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DisasterCategoriesPage;
