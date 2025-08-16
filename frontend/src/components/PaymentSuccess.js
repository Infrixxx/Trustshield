import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  CheckCircleIcon
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccess = ({ transactionData, onReset }) => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: '2px solid #4caf50',
        borderRadius: 2,
        backgroundColor: '#e8f5e9',
        textAlign: 'center'
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
        Payment Successful
      </Typography>
      
      <Typography variant="body1" sx={{ mt: 2, fontSize: '1.2rem' }}>
        {transactionData.merchant} - R{transactionData.amount}
      </Typography>
      
      <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
        Transaction completed and funds transferred
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
        onClick={onReset}
      >
        MAKE ANOTHER PAYMENT
      </Button>
    </Box>
  );
};

export default PaymentSuccess;