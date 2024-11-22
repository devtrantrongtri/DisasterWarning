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
  useUpdateDisasterMutation,
  useUpdateDisasterInfoMutation,
  useDeleteDisasterMutation,
  useDeleteDisasterInfoMutation
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editingDisaster, setEditingDisaster] = useState<Partial<Disaster> | null>(null);
  const [openDisasterDialog, setOpenDisasterDialog] = useState(false);
  const [openDisasterInfoDialog, setOpenDisasterInfoDialog] = useState(false);
  const [editingDisasterInfo, setEditingDisasterInfo] = useState<{
    disasterInfoId: number | null;
    disasterInfo: Partial<DisasterInfo> | null;
  }>({ disasterInfoId: null, disasterInfo: null });
  
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
  const [deleteDisasterInfo] = useDeleteDisasterInfoMutation();
  const [updateDisasterInfo] = useUpdateDisasterInfoMutation();
  const [updateDisaster] = useUpdateDisasterMutation();
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

  const handleDeleteDisasterInfo = async (disasterInfoId: number) => {
    try {
      await deleteDisasterInfo(disasterInfoId).unwrap();
      setSnackbar({
        open: true,
        message: 'DisasterInfo deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting DisasterInfo',
        severity: 'error'
      });
    }
  };

  const handleEditDisaster = (disaster: Disaster) => {
    setEditingDisaster(disaster);
    setOpenDisasterDialog(true);
  };  

  const handleEditDisasterInfo = (disasterInfoId: number, disasterInfo: DisasterInfo) => {
    setEditingDisasterInfo({
      disasterInfoId,
      disasterInfo,
    });
    setOpenDisasterInfoDialog(true);
  };
  
  // Rename your conflicting function to something else
  const handleEditingDisasterInfo1 = async () => {
    // Kiểm tra giá trị của `editingDisasterInfo` và `disasterInfo`
    if (editingDisasterInfo && editingDisasterInfo.disasterInfo) {
      // Lấy dữ liệu từ `editingDisasterInfo`
      const { disasterInfo } = editingDisasterInfo;
  
      const createDisasterInfoRequest: CreateDisasterInfoRequest = {
        disasterInfo: {
          typeInfo: disasterInfo?.typeInfo || '', // Kiểm tra tồn tại và sử dụng giá trị mặc định
          information: disasterInfo?.information || '',
          disaster: disasterInfo?.disaster || null, // Nếu không có `disaster`, sử dụng `null`
        },
        images: disasterInfo?.newImages || [], // Kiểm tra và dùng mảng rỗng nếu không có
      };
  
      console.log('Create Disaster Info Request:', createDisasterInfoRequest);
  
      try {
        // Gửi yêu cầu cập nhật DisasterInfo
        const response = await updateDisasterInfo({
          disasterInfoId: editingDisasterInfo?.disasterInfoId || 0, // Đảm bảo rằng `disasterInfoId` không phải `undefined`
          disasterInfo: createDisasterInfoRequest,
        }).unwrap();
  
        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: 'DisasterInfo updated successfully',
          severity: 'success',
        });
        console.log('DisasterInfo updated successfully', response);
      } catch (error) {
        // Xử lý lỗi
        const errorMessage = error instanceof Error ? error.message : 'Error updating DisasterInfo';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
        console.error('Error updating DisasterInfo:', error);
      }
    } else {
      // Thông báo lỗi nếu không có `editingDisasterInfo` hoặc `disasterInfo`
      console.error('DisasterInfo ID is required or editingDisasterInfo is not valid');
      setSnackbar({
        open: true,
        message: 'DisasterInfo ID is required or editingDisasterInfo is not valid',
        severity: 'error',
      });
    }
  
    // Đóng dialog sau khi xử lý
    handleCloseDisasterInfoDialog();
  };
  
  
  const handleCloseDisasterDialog = () => {
    setOpenDisasterDialog(false);
    setEditingDisaster(null);
  };
  
  const handleCloseDisasterInfoDialog = () => {
    setOpenDisasterInfoDialog(false);
    setEditingDisasterInfo({ disasterInfoId: null, disasterInfo: null });
  };

  const handleSaveDisaster = async () => {
    if (editingDisaster && editingDisaster.disasterId) {
      const newDisaster = {
        disaster: {
          disasterName: editingDisaster.disasterName ?? '',
          description: editingDisaster.description ?? '', 
        },
        images: editingDisaster.imageFile,
    };

      try {
        const response = await updateDisaster({
          disasterId: editingDisaster.disasterId,
          newDisaster,
        }).unwrap();

        setSnackbar({
          open: true,
          message: 'Disaster updated successfully',
          severity: 'success'
        });
        console.log('Disaster updated successfully', response);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error updating disaster',
          severity: 'error'
        });
        console.error('Error updating disaster', error);
      }
    } else {
      console.error('Disaster ID is required');
    }

    handleCloseDisasterDialog();
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
    <Box 
      sx={{ 
        borderRadius: '16px',
        p: { xs: 2, md: 4 },
        mx: 'auto',
        maxWidth: '1400px',
        minHeight: '90vh',

        padding: 3,
        marginBottom: 2,
        textAlign: 'center',
       // background: 'transparent', // No background
        color: '#030302', // Text color
        marginTop: -20,
      }}
    > 
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 4,
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1e293b',
            fontWeight: 600,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Disaster Management
        </Typography>
        <Button 
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            padding: 3,
            backgroundColor: '#ffffff',
            borderRadius: 4,
            marginBottom: 2,
            textAlign: 'center',
            background: 'transparent', // No background
            backdropFilter: 'blur(10px)', // Optional: blurred effect on background
            boxShadow: 'none',
            color: '#f8fafc',
            px: { xs: 2, md: 4 },
            py: 1.5,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#455880',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Add New Disaster
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{

          // overflow: 'hidden',
          // mb: 3,



        padding: 3,
        borderRadius: 4,
        marginBottom: 2,
        textAlign: 'center',
        background: 'transparent', // No background
        backdropFilter: 'blur(10px)', // Optional: blurred effect on background
        color: '#030302', // Text color
        marginTop: -9,
          
        }}
      >
        <Table>
          <TableHead 
            sx={{ 
              '& th': {
                fontWeight: 600,
                color: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '0.975rem'
                
              }
            }}
>
            <TableRow>           
              <TableCell  width="10%" >ID</TableCell>
              <TableCell width="10%">Name</TableCell>
              <TableCell width="50%">Description</TableCell>
              <TableCell width="15%">Image</TableCell>
              <TableCell width="15%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disasters.content?.map((disaster) => (
              <React.Fragment key={disaster.disasterId}>
                <TableRow 
                  onClick={() => toggleDisasterInfoVisibility(disaster.disasterId)}
                >
                  <TableCell>{disaster.disasterId}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{disaster.disasterName}</TableCell>
                  <TableCell>{disaster.description}</TableCell>
                  <TableCell>
                    <img 
                      src={disaster.imageUrl} 
                      alt={disaster.disasterName || "Disaster Image"} 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover', 
                        borderRadius: '10px' 
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      '& button': {
                        transition: 'all 0.2s ease',
                        p: 1
                      }
                    }}>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDisaster(disaster.disasterId);
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#d7e2f7',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon sx={{ color: '#2d3a54' }} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDisaster(disaster);
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#d7e2f7',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon sx={{ color: '#2d3a54' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                {expandedDisasterId === disaster.disasterId && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Box sx={{ 
                        backgroundColor: '#f8fafc',
                        p: 2,
                        borderRadius: '8px',
                        m: 2
                      }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{
                              '& th': {
                                backgroundColor: '#f1f5f9',
                                fontWeight: 500,
                                color: '#475569'
                              }
                            }}>
                              <TableCell>ID</TableCell>
                              <TableCell>Type Info</TableCell>
                              <TableCell>Information</TableCell>
                              <TableCell>Image</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {disaster.disasterInfos?.map((info, index) => (
                              <TableRow key={index} sx={{
                                '&:hover': {
                                  backgroundColor: 'white'
                                }
                              }}>
                                <TableCell>{info.disasterInfoId}</TableCell>
                                <TableCell>{info.typeInfo}</TableCell>
                                <TableCell>{info.information}</TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {info.images.map((image, index) => (
                                      <img
                                        key={index}
                                        src={image.imageUrl}
                                        alt={`Image ${index + 1}`}
                                        style={{
                                          width: '60px',
                                          height: '60px',
                                          objectFit: 'cover',
                                          borderRadius: '8px',
                                          border: '1px solid #ccc',
                                        }}
                                      />
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDisasterInfo(info.disasterInfoId);
                                    }}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: '#d7e2f7',
                                        transform: 'scale(1.1)'
                                      }
                                    }}>
                                      <DeleteIcon sx={{ color: '#2d3a54' }} />
                                    </IconButton>
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditDisasterInfo(info.disasterInfoId ,info);
                                      }}
                                      sx={{
                                        '&:hover': {
                                          backgroundColor: '#d7e2f7',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <EditIcon sx={{ color: '#2d3a54' }} />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
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
        onChange={handleChangePage}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          '& .MuiPaginationItem-root': {
            borderRadius: '8px',
            margin: '0 4px',
            backgroundColor: '#2d3a54',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#f8fafc',
              color: '#2d3a54',
            },
            '&.Mui-selected': {
              fontWeight: 600,
              backgroundColor: '#3b4a67',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4c5c78',
              },
            },
          },
        }}
      />


      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #e2e8f0',
          px: 3,
          py: 2,
          backgroundColor: '#f8fafc'
        }}>
          Add New Disaster
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3 
          }}>
            <div style={{fontSize: '1.15rem', fontWeight: "bold"}}>Disaster:</div>
            <TextField
              label="Disaster Name"
              fullWidth
              variant="outlined"
              value={disasterForm.disasterName || ''}
              onChange={(e) => setDisasterForm({ 
                ...disasterForm, 
                disasterName: e.target.value 
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  marginTop: '8px'
                }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              value={disasterForm.description || ''}
              onChange={(e) => setDisasterForm({ 
                ...disasterForm, 
                description: e.target.value 
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <Button
              variant="outlined"
              component="label"
               sx={{
                    display: 'block',
                    margin: '16px 0',
                    padding: '8px',
                    border: '2px dashed #1976d2',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDisasterForm({ 
                      ...disasterForm, 
                      imageFile: file,
                    });
                    setUploadedImage(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>

            {/* Hiển thị ảnh đã upload */}
            {uploadedImage && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p>Preview:</p>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            )}
            <div style={{fontSize: '1.15rem', fontWeight: "bold"}}>Disaster Info:</div>
            {disasterForm.disasterInfos?.map((info, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                p: 3, 
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <TextField
                  label="Info Type"
                  fullWidth
                  variant="outlined"
                  value={info.typeInfo || ''}
                  onChange={(e) => handleDisasterInfoChange(index, 'typeInfo', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }
                  }}
                />
                <TextField
                  label="Information"
                  fullWidth
                  variant="outlined"
                  value={info.information || ''}
                  onChange={(e) => handleDisasterInfoChange(index, 'information', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  component="label"
                   sx={{
                    display: 'block',
                    margin: '16px 0',
                    padding: '8px',
                    border: '2px dashed #1976d2',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  Upload Info Images
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </Button>
                {info.images?.map((image, imgIndex) => (
                  <Grid 
                    container 
                    key={imgIndex} 
                    alignItems="center" 
                    justifyContent="space-between"
                    sx={{
                      backgroundColor: 'white',
                      p: 1.5,
                      borderRadius: '8px'
                    }}
                  >
                    <Grid item>
                      <Typography variant="body2" sx={{ color: '#475569' }}>
                        {image.imageFile?.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton 
                        onClick={() => handleDeleteImage(index, imgIndex)}
                        size="small"
                        sx={{
                          '&:hover': {
                            backgroundColor: '#d7e2f7'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: '#2d3a54' }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            ))}

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddDisasterInfo}
              sx={{ 
                py: 1.5,
                borderRadius: '8px',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  backgroundColor: '#f0f9ff'
                }
              }}
            >
              Add Disaster Info
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDisasterAndInfo} 
            variant="contained" 
            sx={{
              px: 4,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDisasterDialog} onClose={handleCloseDisasterDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Disaster</DialogTitle>
        <DialogContent>
          {editingDisaster && (
            <Box>
              <TextField
                fullWidth
                label="Disaster Name"
                value={editingDisaster.disasterName || ''}
                onChange={(e) =>
                  setEditingDisaster((prev) => ({
                    ...prev,
                    disasterName: e.target.value,
                  }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editingDisaster.description || ''}
                onChange={(e) =>
                  setEditingDisaster((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                margin="normal"
                multiline
                rows={3}
              />

              {/* Hiển thị ảnh cũ nếu có */}
              {editingDisaster.imageUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Typography variant="body2" sx={{ marginTop: '8px', color: '#333' }}>
                    Current Image:
                  </Typography>
                  <img
                    src={editingDisaster.imageUrl}
                    alt={editingDisaster.disasterName || "Disaster Image"}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginLeft: '16px',
                    }}
                  />
                </Box>
              )}

              {/* Hiển thị ảnh mới nếu có */}
                {editingDisaster.imageFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="body2" sx={{ marginTop: '8px', color: '#333' }}>
                      New Image Preview:
                    </Typography>
                    <img
                      src={URL.createObjectURL(editingDisaster.imageFile)}
                      alt="New Disaster Image"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginLeft: '16px',
                      }}
                    />
                  </Box>
                )}

              <Box>
                <Box
                  sx={{
                    display: 'block',
                    margin: '16px 0',
                    padding: '8px',
                    border: '2px dashed #1976d2',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditingDisaster((prev) => ({
                          ...prev,
                          imageFile: file,
                        }));
                      }
                    }}
                    style={{ display: 'none' }}
                    id="upload-button"
                  />
                  <label htmlFor="upload-button" style={{ cursor: 'pointer', fontWeight: 'bold', color: '#1976d2' }}>
                    Click to upload an image
                  </label>
                </Box>
              </Box>

            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisasterDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveDisaster}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDisasterInfoDialog} onClose={handleCloseDisasterInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Disaster Info</DialogTitle>
        <DialogContent>
          {editingDisasterInfo && (
            <Box>
              {/* Type Info */}
              <TextField
                fullWidth
                label="Type Info"
                value={editingDisasterInfo.disasterInfo?.typeInfo || ''}
                onChange={(e) =>
                  setEditingDisasterInfo((prev) => ({
                    ...prev,
                    disasterInfo: {
                      ...prev?.disasterInfo,
                      typeInfo: e.target.value, // Cập nhật chính xác field `typeInfo`
                    },
                  }))
                }
                margin="normal"
              />

              {/* Information */}
              <TextField
                fullWidth
                label="Information"
                value={editingDisasterInfo.disasterInfo?.information || ''}
                onChange={(e) =>
                  setEditingDisasterInfo((prev) => ({
                    ...prev,
                    disasterInfo: {
                      ...prev?.disasterInfo,
                      information: e.target.value, // Cập nhật chính xác field `typeInfo`
                    },
                  }))
                }
                margin="normal"
                multiline
                rows={3}
              />

              {/* Current Images (Cũ) */}
              <Box>
                <Typography variant="subtitle1">Current Images:</Typography>
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {editingDisasterInfo.disasterInfo?.images
                    ?.filter((image) => image.imageUrl) // Chỉ hiển thị ảnh cũ có URL
                    .map((image, index) => (
                      <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img
                          src={image.imageUrl || ''}
                          alt={`Current ${index}`}
                          style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                </Box>
              </Box>

              {/* New Images (Mới tải lên) */}
              <Box>
                <Typography variant="subtitle1">New Images:</Typography>
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {(editingDisasterInfo.disasterInfo?.newImages || []).map((image, index) => (
                  <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px' }}>
                    {image.imageFile ? (
                      <img
                        src={URL.createObjectURL(image.imageFile)} 
                        alt={`New Image ${index}`}
                        style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No image available
                      </Typography>
                    )}
                  </Box>
                ))}
                </Box>
              </Box>

              {/* Upload New Images */}
              <Box
                sx={{
                  display: 'block',
                  margin: '16px 0',
                  padding: '8px',
                  border: '2px dashed #1976d2',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const newImages = Array.from(files).map((file) => ({
                        imageFile: file,
                        imageUrl: URL.createObjectURL(file), // Lưu trữ URL tạm thời của file mới
                      }));
                      setEditingDisasterInfo((prev) => ({
                        ...prev,
                        disasterInfo: {
                          ...prev?.disasterInfo, // Giữ lại các thông tin cũ trong disasterInfo
                          newImages: [...(prev?.disasterInfo?.newImages || []), ...newImages], // Thêm ảnh mới vào mảng newImages
                        },
                      }));
                    }
                  }}
                  style={{ display: 'none' }}
                  id="upload-button"
                />
                <label htmlFor="upload-button" style={{ cursor: 'pointer', fontWeight: 'bold', color: '#1976d2' }}>
                  Click to upload new images
                </label>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisasterInfoDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleEditingDisasterInfo1}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>


     <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DisasterCategoriesPage;
