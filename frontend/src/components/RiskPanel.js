import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const RiskPanel = ({ riskData, onBlock, onConfirm2PA, isGenerating }) => {
  if (!riskData) return null;
  
  const isBlock = riskData.recommendation === 'BLOCK';
  const isReview = riskData.recommendation === 'REVIEW';
  const riskColor = isBlock ? 'error' : isReview ? 'warning' : 'success';
  const RiskIcon = isBlock ? BlockIcon : isReview ? WarningIcon : CheckCircleIcon;
  
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: 1,
        borderRadius: 2,
        borderColor: `${riskColor}.main`,
        backgroundColor: `${riskColor}.light`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <RiskIcon sx={{ fontSize: 32, mr: 1.5, color: `${riskColor}.dark` }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: `${riskColor}.dark` }}>
          Risk Score: {riskData.score} - {riskData.recommendation}
        </Typography>
      </Box>
      
      {riskData.triggers.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Fraud Triggers:
          </Typography>
          <List dense>
            {riskData.triggers.map((trigger, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={trigger} 
                  primaryTypographyProps={{ variant: 'body1' }} 
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      {isBlock && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
            High-Risk Action Required
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<BlockIcon />}
              onClick={onBlock}
              disabled={isGenerating}
              sx={{ 
                fontWeight: 'bold',
                py: 1.5
              }}
            >
              {isGenerating ? (
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              ) : null}
              BLOCK PAYMENT
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VerifiedUserIcon />}
              onClick={onConfirm2PA}
              disabled={isGenerating}
              sx={{ 
                fontWeight: 'bold',
                py: 1.5,
                backgroundColor: '#388e3c',
                '&:hover': { backgroundColor: '#2e7d32' }
              }}
            >
              CONFIRM WITH 2PA
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RiskPanel;