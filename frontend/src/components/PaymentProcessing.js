import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

const PaymentProcessing = () => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: '2px solid #1976d2',
        borderRadius: 2,
        backgroundColor: '#e3f2fd',
        textAlign: 'center'
      }}
    >
      <PaymentIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Processing Payment
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
      
      <Typography variant="body1" sx={{ mt: 3 }}>
        Completing transaction with bank...
      </Typography>
    </Box>
  );
};

export default PaymentProcessing;