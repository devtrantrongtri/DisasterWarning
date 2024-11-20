import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { 
  LocationOn,
  Message,
  Share
} from '@mui/icons-material';

interface TeamMember {
  name: string;
  role: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
}

interface RescueTeam {
  id: string;
  name: string;
  location: string;
  members: TeamMember[];
  activeOperations: number;
  lastUpdate: string;
  image: string;
  description: string;
}

const SupportPage: React.FC = () => {
  const rescueTeams: RescueTeam[] = [
    {
      id: 'team-a',
      name: 'ĐỘI CỨU TRỢ A',
      location: 'Quận 1, TP.HCM',
      members: [
        { name: 'Nguyễn Văn A', role: 'Đội trưởng', phone: '0901234567', status: 'available' },
        { name: 'Trần Thị B', role: 'Y tế', phone: '0901234568', status: 'busy' },
        { name: 'Lê Văn C', role: 'Hậu cần', phone: '0901234569', status: 'available' },
      ],
      activeOperations: 2,
      lastUpdate: '10 phút trước',
      image: 'https://img.freepik.com/premium-vector/rescue-teams-save-people-drowning-ocean-by-helicopter-inflatable-rubber-boat-life-jacket_343650-99.jpg?w=740', // Thay thế URL hình ảnh thực tế của đội A
      description: 'Chuyên về cứu hộ đường thủy và hỗ trợ di tản trong vùng ngập lụt. Trang bị đầy đủ phương tiện cứu sinh và thiết bị chuyên dụng.'
    },
    {
      id: 'team-b',
      name: 'ĐỘI CỨU TRỢ B',
      location: 'Quận 2, TP.HCM',
      members: [
        { name: 'Phạm Văn D', role: 'Đội trưởng', phone: '0901234570', status: 'available' },
        { name: 'Hoàng Thị E', role: 'Y tế', phone: '0901234571', status: 'offline' },
      ],
      activeOperations: 1,
      lastUpdate: '30 phút trước',
      image: 'https://img.freepik.com/free-vector/modern-emergency-word-concept-with-flat-design_23-2147934544.jpg?t=st=1732088279~exp=1732091879~hmac=93d8e42f4b2717058a42a379a0986586424cd3503ba0c45b59ca82ab5420e1b9&w=740', // Thay thế URL hình ảnh thực tế của đội B
      description: 'Đội chuyên về y tế cấp cứu và sơ cứu ban đầu. Được trang bị xe cứu thương và thiết bị y tế hiện đại.'
    },
    {
      id: 'team-c',
      name: 'ĐỘI CỨU TRỢ C',
      location: 'Quận 3, TP.HCM',
      members: [
        { name: 'Vũ Văn F', role: 'Đội trưởng', phone: '0901234572', status: 'busy' },
        { name: 'Ngô Thị G', role: 'Hậu cần', phone: '0901234573', status: 'available' },
      ],
      activeOperations: 3,
      lastUpdate: '1 giờ trước',
      image: 'https://img.freepik.com/free-vector/rescue-using-stretcher-forest_1308-107868.jpg?t=st=1732087612~exp=1732091212~hmac=017802e4ecad9236dcef897175feed5a26aef5486e41ae01c137d4d1f5dff8ec&w=826', // Thay thế URL hình ảnh thực tế của đội C
      description: 'Chuyên về hậu cần và vận chuyển hàng cứu trợ. Sở hữu đội xe tải và kho bãi rộng lớn.'
    }
  ];

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return '#4caf50';
      case 'busy':
        return '#ff9800';
      case 'offline':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'busy':
        return 'Đang bận';
      case 'offline':
        return 'Ngoại tuyến';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          mt: 4,
          mb: 4,
          fontWeight: 'bold',
          color: '#1a237e'
        }}
      >
        Thông Tin Cứu Trợ
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {rescueTeams.map((team) => (
          <Grid item xs={12} md={4} key={team.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={team.image}
                alt={team.name}
                sx={{
                  objectFit: 'contain', // Hiển thị toàn bộ hình ảnh trong khung
                  
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {team.name}
                  </Typography>
                  <Chip 
                    label={`${team.activeOperations} hoạt động`}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {team.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body2" color="text.secondary">
                    {team.location}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Thành viên chính:
                </Typography>
                {team.members.map((member, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        backgroundColor: '#1a237e'
                      }}>
                        {member.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {member.name} - {member.role}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(member.status)
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getStatusText(member.status)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Cập nhật: {team.lastUpdate}
                    </Typography>
                    <Box>
                      <Button
                        startIcon={<Message />}
                        variant="contained"
                        size="small"
                        sx={{ 
                          mr: 1,
                          backgroundColor: '#1a237e',
                          '&:hover': {
                            backgroundColor: '#0d47a1'
                          }
                        }}
                      >
                        Liên hệ
                      </Button>
                      <Button
                        startIcon={<Share />}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          color: '#1a237e',
                          borderColor: '#1a237e',
                          '&:hover': {
                            borderColor: '#0d47a1',
                            backgroundColor: 'rgba(26, 35, 126, 0.04)'
                          }
                        }}
                      >
                        Chia sẻ
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SupportPage;