import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Collapse,
  IconButton
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';

const RiskPanel = ({ riskData, onBlock, onConfirm2PA, isGenerating }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!riskData) return null;
  
  const isBlock = riskData.recommendation === 'BLOCK';
  const isReview = riskData.recommendation === 'REVIEW';
  const riskColor = isBlock ? 'error' : isReview ? 'warning' : 'success';

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: 2,
        borderRadius: 2,
        borderColor: `${riskColor}.main`,
        backgroundColor: `${riskColor}.light`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningIcon sx={{ fontSize: 32, mr: 1.5, color: `${riskColor}.dark` }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: `${riskColor}.dark` }}>
            AI Risk Score: {riskData.score}% - {riskData.recommendation}
          </Typography>
          <Typography variant="body2" sx={{ color: `${riskColor}.dark` }}>
            AI Model: {riskData.aiModel || "TrustShield FraudNet"}
          </Typography>
        </Box>
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
      
      {riskData.aiInsights.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setExpanded(!expanded)}
            endIcon={<ExpandMoreIcon sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s'
            }} />}
            sx={{ 
              justifyContent: 'space-between',
              fontWeight: 'bold',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              borderColor: '#1976d2',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.2)'
              }
            }}
          >
            AI Insights & Reasoning
          </Button>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List dense sx={{ mt: 1, bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
              {riskData.aiInsights.map((insight, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PsychologyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={insight} 
                    primaryTypographyProps={{ variant: 'body2' }} 
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
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