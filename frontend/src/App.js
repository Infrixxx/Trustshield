import React, { useState, useEffect } from 'react';
import PaymentForm from './components/PaymentForm';
import RiskPanel from './components/RiskPanel';
import FraudPacket from './components/FraudPacket';
import TwoFAScreen from './components/TwoFAScreen';
import PaymentProcessing from './components/PaymentProcessing';
import PaymentSuccess from './components/PaymentSuccess';
import { checkRisk, generateFraudPacket, processPayment } from './services/api';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress,
  CssBaseline,
  Button,
  Alert
} from '@mui/material';

function App() {
  const [riskData, setRiskData] = useState(null);
  const [fraudPacket, setFraudPacket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [verificationState, setVerificationState] = useState('idle');
  const [countdown, setCountdown] = useState(60);
  const [transactionData, setTransactionData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (verificationState === 'awaiting2FA' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleBlockPayment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationState, countdown]);

  const handleRiskCheck = async (formData) => {
    setIsLoading(true);
    setVerificationState('verifying');
    setRiskData(null);
    setFraudPacket(null);
    setError(null);
    setTransactionData(formData);
    
    try {
      const result = await checkRisk(formData.merchant, formData.amount);
      setRiskData(result);
      
      if (result.recommendation === 'BLOCK') {
        setVerificationState('highRisk');
      } else {
        setVerificationState('lowRisk');
      }
    } catch (error) {
      console.error('Risk assessment failed:', error);
      setError(error.message);
      setVerificationState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const packet = await generateFraudPacket(riskData);
      setFraudPacket(packet);
      setVerificationState('blocked');
      
      // In real app: Alert bank and SAPS
      console.log('Alerting bank and SAPS about fraud case:', packet.caseId);
    } catch (error) {
      console.error('Report generation failed:', error);
      setError(error.message);
      setVerificationState('highRisk');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlockPayment = () => {
    setVerificationState('blocking');
    handleGenerateReport();
  };

  const handleConfirm2PA = () => {
    setVerificationState('awaiting2FA');
  };

  const handleProceedToPayment = () => {
    setVerificationState('awaiting2FA');
  };

  const handleApprovePayment = async () => {
    setVerificationState('processingPayment');
    try {
      const result = await processPayment(transactionData);
      setPaymentStatus(result);
      setVerificationState('paymentSuccess');
    } catch (error) {
      setError('Payment failed: ' + error.message);
      setVerificationState('lowRisk');
    }
  };

  const handleCancelPayment = () => {
    if (verificationState === 'awaiting2FA' && riskData?.recommendation === 'BLOCK') {
      handleBlockPayment();
    } else {
      resetFlow();
    }
  };

  const testBackendConnection = async () => {
    setError(null);
    try {
      const testData = await checkRisk("Taxi Scam Pty", 15000);
      console.log("Backend test successful:", testData);
      setError("Backend connection successful! ✔️");
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      setError(`Connection failed: ${error.message}`);
    }
  };

  const resetFlow = () => {
    setVerificationState('idle');
    setRiskData(null);
    setFraudPacket(null);
    setPaymentStatus(null);
    setCountdown(60);
    setTransactionData(null);
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
          <Typography 
            variant="subtitle1" 
            component="h3" 
            sx={{ 
              color: '#495057',
              mt: 2
            }}
          >
            South African Payment Verification
          </Typography>
        </Box>

        {error && (
          <Alert severity={error.includes('successful') ? "success" : "error"} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {verificationState === 'idle' && (
          <PaymentForm onSubmit={handleRiskCheck} isLoading={isLoading} />
        )}

        {verificationState === 'verifying' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={80} thickness={4} />
            <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
              Analyzing SA Fraud Patterns...
            </Typography>
          </Box>
        )}

        {verificationState === 'lowRisk' && transactionData && (
          <Box sx={{
            mt: 3,
            p: 3,
            border: '2px solid #4caf50',
            borderRadius: 2,
            backgroundColor: '#e8f5e9',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Transaction Verified
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontSize: '1.2rem' }}>
              {transactionData.merchant} - R{transactionData.amount}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Risk assessment: Low Risk
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
              onClick={handleProceedToPayment}
            >
              PROCEED TO PAYMENT
            </Button>
          </Box>
        )}

        {verificationState === 'highRisk' && riskData && (
          <RiskPanel 
            riskData={riskData} 
            onBlock={handleBlockPayment}
            onConfirm2PA={handleConfirm2PA}
            isGenerating={isGenerating}
          />
        )}

        {verificationState === 'awaiting2FA' && (
          <TwoFAScreen 
            countdown={countdown} 
            riskLevel={riskData?.recommendation === 'BLOCK' ? 'high' : 'low'}
            onApprove={handleApprovePayment}
            onCancel={handleCancelPayment}
          />
        )}

        {verificationState === 'processingPayment' && (
          <PaymentProcessing />
        )}

        {verificationState === 'paymentSuccess' && paymentStatus && (
          <PaymentSuccess 
            transactionData={transactionData} 
            onReset={resetFlow} 
          />
        )}

        {(verificationState === 'blocking' || isGenerating) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={80} thickness={4} />
            <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
              Generating Fraud Packet...
            </Typography>
          </Box>
        )}

        {verificationState === 'blocked' && fraudPacket && (
          <FraudPacket caseData={fraudPacket} onReset={resetFlow} />
        )}
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={testBackendConnection}
            sx={{ fontWeight: 'bold' }}
          >
            TEST BACKEND CONNECTION
          </Button>
        </Box>

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
            Developed for BET Hackathon | All rights reserved
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;