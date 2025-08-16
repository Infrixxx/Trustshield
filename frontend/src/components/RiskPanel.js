import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Divider,
  Collapse,
  IconButton,
  useTheme
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RiskPanel = ({ riskData, onBlock, onConfirm2PA, isGenerating }) => {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  
  if (!riskData) return null;
  
  const isHighRisk = riskData.score >= 65;
  const riskColor = isHighRisk ? '#ff416c' : '#38ef7d';

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: 1,
        borderRadius: 2,
        borderColor: '#2a4a8c',
        background: 'linear-gradient(to right, #141e30, #243b55)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mr: 1
        }}>
          AI Risk Score: {riskData.score}%
        </Typography>
        
        {isHighRisk ? (
          <Box sx={{
            bgcolor: '#ff416c',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            BLOCK
          </Box>
        ) : (
          <Box sx={{
            bgcolor: '#38ef7d',
            color: '#0f3460',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            SAFE
          </Box>
        )}
      </Box>
      
      <Typography variant="body2" sx={{ color: '#a0c3ff', mb: 2 }}>
        AI Model: TrustShield FraudNet v3.2
      </Typography>
      
      <Divider sx={{ bgcolor: '#2a4a8c', mb: 2 }} />
      
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#4facfe' }}>
        Fraud Triggers:
      </Typography>
      
      <List dense sx={{ mb: 2 }}>
        {riskData.triggers.map((trigger, index) => (
          <ListItem key={index} sx={{ py: 0, color: '#ffcc00' }}>
            <ListItemText 
              primary={`• ${trigger}`} 
              primaryTypographyProps={{ variant: 'body1' }} 
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ 
        bgcolor: 'rgba(0, 0, 0, 0.2)', 
        borderRadius: 1, 
        p: 2,
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4facfe' }}>
            AI INSIGHTS & REASONING
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#a0c3ff' }}
          >
            <ExpandMoreIcon sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s'
            }} />
          </IconButton>
        </Box>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List dense>
            {riskData.aiInsights.map((insight, index) => (
              <ListItem key={index} sx={{ py: 0.5, color: '#e0e0e0' }}>
                <ListItemText 
                  primary={`• ${insight}`} 
                  primaryTypographyProps={{ variant: 'body2' }} 
                />
              </ListItem>
            ))}
          </List>
          
          {riskData.recommendation && (
            <Box sx={{ 
              mt: 1,
              p: 1.5,
              bgcolor: 'rgba(255, 107, 107, 0.1)',
              borderLeft: '3px solid #ff6b6b',
              borderRadius: '0 4px 4px 0'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffcc00' }}>
                AI Recommendation: {riskData.recommendation} (high confidence)
              </Typography>
            </Box>
          )}
        </Collapse>
      </Box>
      
      {isHighRisk && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            mb: 2,
            color: '#ffcc00'
          }}>
            High-Risk Action Required
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<BlockIcon />}
              onClick={onBlock}
              disabled={isGenerating}
              sx={{ 
                fontWeight: 'bold',
                py: 1.5,
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                '&:hover': {
                  background: 'linear-gradient(to right, #e03a5e, #e04427)',
                  boxShadow: '0 6px 20px rgba(255, 75, 43, 0.4)'
                },
                boxShadow: '0 4px 15px rgba(255, 75, 43, 0.3)'
              }}
            >
              {isGenerating ? (
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              ) : null}
              BLOCK PAYMENT
            </Button>
            
            <Button
              variant="contained"
              startIcon={<VerifiedUserIcon />}
              onClick={onConfirm2PA}
              disabled={isGenerating}
              sx={{ 
                fontWeight: 'bold',
                py: 1.5,
                background: 'linear-gradient(to right, #11998e, #38ef7d)',
                '&:hover': {
                  background: 'linear-gradient(to right, #0f857b, #30d46e)',
                  boxShadow: '0 6px 20px rgba(17, 153, 142, 0.4)'
                },
                boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)'
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