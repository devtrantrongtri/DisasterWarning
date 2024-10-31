import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, Button } from '@mui/material';

function NotFoundPage() {
    return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
          sx={{
            background: 'linear-gradient(to bottom, #1f3c78 40%, #ffffff 100%)',
            color: 'white',
          }}
        >
          <Stack spacing={2} alignItems="center">
            {/* 404 Section */}
            <Box
              fontSize="8rem"
              fontWeight="bold"
              lineHeight="1"
              color="#ff0000"
              sx={{
                textShadow: '2px 4px 8px rgba(0, 0, 0, 0.5)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              404
            </Box>
    
            {/* Text Section */}
            <Box fontSize="2rem" fontWeight="medium" sx={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
              Oops! Page Not Found
            </Box>
            <Box fontSize="1.2rem" color="rgba(255, 255, 255, 0.8)">
              The page you are looking for does not exist or has been moved.
            </Box>
    
            {/* Button */}
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                backgroundColor: "#3b5aa6",
                '&:hover': {
                  backgroundColor: "#334b8f",
                },
                mt: 3,
                px: 4,
                py: 1,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Go Back to Home
            </Button>
          </Stack>
        </Box>
      );
}

export default NotFoundPage;
