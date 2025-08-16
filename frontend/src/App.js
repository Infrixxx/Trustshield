import React, { useState } from 'react';
import PaymentForm from './components/PaymentForm';
import RiskPanel from './components/RiskPanel';
import FraudPacket from './components/FraudPacket';
import { checkRisk, generateFraudPacket } from './services/api';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress,
  CssBaseline
} from '@mui/material';

function App() {
  const [riskData, setRiskData] = useState(null);
  const [fraudPacket, setFraudPacket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRiskCheck = async (formData) => {
    setIsLoading(true);
    setRiskData(null);
    setFraudPacket(null);
    
    try {
      const result = await checkRisk(formData.merchant, formData.amount);
      setRiskData(result);
    } catch (error) {
      console.error('Risk assessment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const packet = await generateFraudPacket(riskData);
      setFraudPacket(packet);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1971c2',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 1
            }}
          >
            TRUSTSHIELD
          </Typography>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              color: '#495057',
              letterSpacing: 1.5,
              textTransform: 'uppercase'
            }}
          >
            South African Fraud Prevention System
          </Typography>
        </Box>

        <PaymentForm onSubmit={handleRiskCheck} isLoading={isLoading} />
        
        {isLoading && !riskData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={80} thickness={4} />
            <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
              Analyzing SA Fraud Patterns...
            </Typography>
          </Box>
        )}

        {riskData && (
          <RiskPanel 
            riskData={riskData} 
            onGenerateReport={handleGenerateReport} 
            isGenerating={isGenerating}
          />
        )}
        
        {fraudPacket && <FraudPacket caseData={fraudPacket} />}
        
        <Box sx={{ 
          mt: 6, 
          pt: 3, 
          borderTop: '1px solid #dee2e6', 
          textAlign: 'center' 
        }}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} TrustShield | Preventing R740m in SA fraud annually
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
            Developed for SA Hackathon 2025 | All rights reserved
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;