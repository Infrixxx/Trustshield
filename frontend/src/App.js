import React, { useState, useEffect } from 'react';
import PaymentForm from './components/PaymentForm';
import RiskPanel from './components/RiskPanel';
import FraudPacket from './components/FraudPacket';
import PaymentSuccess from './components/PaymentSuccess';
import { checkRisk, generateFraudPacket, processPayment } from './services/api';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <button onClick={() => window.location.reload()}>Reload Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      setError(error.message || 'Risk assessment failed');
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
      setError(error.message || 'Report generation failed');
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
      setError('Payment failed: ' + (error.message || 'Unknown error'));
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
      setError(`Connection failed: ${error.message || 'Unknown error'}`);
    }
  };

  const resetFlow = () => {
    setVerificationState('idle');
    setRiskData(null);
    setFraudPacket(null);
    setPaymentStatus(null);
    setCountdown(60);
    setTransactionData(null);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            {/* Use a simple SVG instead of react-icons to avoid rendering issues */}
            <svg className="app-logo" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div className="header-text">
              <h1>TRUST SHIELD</h1>
              <p>AI-Powered Payment Security & Fraud Detection Platform</p>
              <div className="subheader">Protecting transactions with blockchain-secured evidence generation</div>
            </div>
          </div>
        </header>

        <main className="app-main">
          {error && (
            <div className={`error-alert ${error.includes('successful') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}

          {verificationState === 'idle' && (
            <PaymentForm onSubmit={handleRiskCheck} isLoading={isLoading} />
          )}

          {verificationState === 'verifying' && (
            <div className="verifying-screen">
              <div className="spinner"></div>
              <p>Analyzing SA Fraud Patterns...</p>
            </div>
          )}

          {verificationState === 'lowRisk' && transactionData && (
            <div className="low-risk-panel">
              <h2>Transaction Verified</h2>
              <div className="transaction-details">
                <p>{transactionData.merchant} - R{transactionData.amount}</p>
                <p>Risk assessment: Low Risk</p>
              </div>
              <button 
                className="proceed-btn"
                onClick={handleProceedToPayment}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
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
            <div className="awaiting-2fa">
              <h3>Two-Factor Authentication</h3>
              <p>FIDO2 passkey sent to your mobile device</p>
              
              <div className="countdown-timer">{countdown}</div>
              <p className="countdown-label">Auto-block in {countdown} seconds</p>
              
              <div className="action-buttons">
                <button onClick={handleApprovePayment} className="confirm-btn">
                  APPROVE PAYMENT
                </button>
                <button onClick={handleCancelPayment} className="cancel-btn">
                  CANCEL PAYMENT
                </button>
              </div>
              
              <p className="warning-note">
                Note: High-risk transactions will be blocked even after approval
              </p>
              
              <button 
                className="test-btn"
                onClick={testBackendConnection}
              >
                TEST BACKEND CONNECTION
              </button>
            </div>
          )}

          {verificationState === 'processingPayment' && (
            <div className="verifying-screen">
              <div className="spinner"></div>
              <p>Processing Payment...</p>
            </div>
          )}

          {verificationState === 'paymentSuccess' && paymentStatus && (
            <PaymentSuccess 
              transactionData={transactionData} 
              onReset={resetFlow} 
            />
          )}

          {(verificationState === 'blocking' || isGenerating) && (
            <div className="verifying-screen">
              <div className="spinner"></div>
              <p>Generating Fraud Packet...</p>
            </div>
          )}

          {verificationState === 'blocked' && fraudPacket && (
            <FraudPacket caseData={fraudPacket} onReset={resetFlow} />
          )}
        </main>

        <footer className="app-footer">
          <div>2025 TrustShield | Preventing R740m in SA fraud annually</div>
          <div>Developed for BET Hackathon | All rights reserved</div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;