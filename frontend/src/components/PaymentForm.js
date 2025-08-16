import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  CircularProgress
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

const PaymentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    merchant: '',
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        backgroundColor: '#f8f9fa'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FlagIcon sx={{ color: '#007749', mr: 1.5, fontSize: 32 }} />
        South African Payment Verification
      </Typography>
      
      <TextField
        fullWidth
        label="Merchant Name"
        name="merchant"
        value={formData.merchant}
        onChange={handleChange}
        margin="normal"
        placeholder="e.g. Taxi Scam Pty"
        required
        disabled={isLoading}
        sx={{ backgroundColor: 'white' }}
      />
      
      <TextField
        fullWidth
        label="Amount (ZAR)"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        margin="normal"
        inputProps={{ min: 1 }}
        required
        disabled={isLoading}
        sx={{ backgroundColor: 'white' }}
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        size="large"
        sx={{ 
          mt: 2,
          py: 1.5,
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          'Verify Transaction'
        )}
      </Button>
    </Box>
  );
};

export default PaymentForm;