import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress
} from '@mui/material';
import LockClockIcon from '@mui/icons-material/LockClock';

const TwoFAScreen = ({ countdown, onCancel }) => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: '1px solid #1976d2',
        borderRadius: 2,
        backgroundColor: '#e3f2fd',
        textAlign: 'center'
      }}
    >
      <LockClockIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Two-Factor Authentication
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        FIDO2 passkey sent to your mobile device
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <CircularProgress 
          variant="determinate" 
          value={(countdown / 60) * 100} 
          size={80}
          thickness={4}
          sx={{ color: '#1976d2' }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" component="div" color="text.secondary">
            {countdown}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Auto-block in {countdown} seconds
      </Typography>
      
      <Button
        variant="outlined"
        color="error"
        onClick={onCancel}
        sx={{ fontWeight: 'bold', py: 1.5 }}
      >
        CANCEL PAYMENT
      </Button>
    </Box>
  );
};

export default TwoFAScreen;