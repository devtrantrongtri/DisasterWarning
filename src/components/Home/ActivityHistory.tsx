import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';

const ActivityHistory = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve the activity history from sessionStorage
    const loginHistory = sessionStorage.getItem('expirationDate');

    const activitiesList: any[] = [];

    if (loginHistory) {
      activitiesList.push({ action: 'Đăng nhập', date: formatDate(loginHistory) });
    }

    // Set the activities state with the retrieved data
    setActivities(activitiesList);
  }, []);

  // Function to format date as dd/mm/yyyy - hh:mm
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <Box sx={{ width: '100%', mt: 4, }} >
      <Typography variant="h6" sx={{ mb: 1, fontSize: '20px', textShadow:'2px 2px rgba(128, 128, 128, 0.5)', color:'#fcebdd' }}>
       - Lịch sử hoạt động -
      </Typography>
      <List sx={{backgroundColor:'rgba(175, 175, 175, 0.8)', borderRadius:10}}>
        {activities.map((activity, index) => (
          <ListItem key={index} >
            <ListItemText
              primary={activity.action}
              secondary={`Ngày ${activity.date} - Thành công`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ActivityHistory;
