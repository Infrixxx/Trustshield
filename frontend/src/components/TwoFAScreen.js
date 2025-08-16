import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress
} from '@mui/material';
import LockClockIcon from '@mui/icons-material/LockClock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TwoFAScreen = ({ countdown, riskLevel, onApprove, onCancel }) => {
  const isHighRisk = riskLevel === 'high';
  
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: '2px solid #1976d2',
        borderRadius: 2,
        backgroundColor: isHighRisk ? '#fff8e1' : '#e3f2fd',
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
      
      {isHighRisk && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <CircularProgress 
              variant="determinate" 
              value={(countdown / 60) * 100} 
              size={80}
              thickness={4}
              sx={{ color: '#d32f2f' }}
            />
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" component="div" color="text.secondary">
                {countdown}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, color: '#d32f2f' }}>
            Auto-block in {countdown} seconds
          </Typography>
        </>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={onApprove}
          sx={{ 
            fontWeight: 'bold',
            py: 1.5,
            backgroundColor: '#388e3c',
            minWidth: '180px'
          }}
        >
          APPROVE PAYMENT
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
          sx={{ 
            fontWeight: 'bold',
            py: 1.5,
            minWidth: '180px'
          }}
        >
          CANCEL PAYMENT
        </Button>
      </Box>
      
      {isHighRisk && (
        <Typography variant="body2" sx={{ mt: 3, color: '#d32f2f', fontStyle: 'italic' }}>
          Note: High-risk transactions will be blocked even after approval
        </Typography>
      )}
    </Box>
  );
};

export default TwoFAScreen;