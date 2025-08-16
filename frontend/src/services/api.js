import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const checkRisk = async (merchant, amount) => {
  try {
    const response = await axios.post(`${API_BASE}/score`, {
      merchant,
      amount: Number(amount)
    });
    
    return {
      score: response.data.score,
      triggers: response.data.triggers,
      recommendation: response.data.recommendation,
      merchantData: {
        name: merchant,
        status: response.data.cipcStatus || 'UNREGISTERED',
        isWatchlisted: response.data.watchlisted
      }
    };
    
  } catch (error) {
    let errorMessage = 'Fraud check failed';
    
    if (error.response) {
      errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Backend not responding. Is it running?';
    } else {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const generateFraudPacket = async (riskData) => {
  try {
    const response = await axios.post(`${API_BASE}/block`, {
      merchant: riskData.merchantData.name,
      amount: riskData.amount || 0,
      verification: riskData.merchantData,
      triggers: riskData.triggers
    });
    
    return {
      success: true,
      caseId: response.data.caseId,
      filename: `SAPS_Case_${response.data.caseId.replace(/\//g, '_')}.pdf`,
      timestamp: new Date().toISOString(),
      blockchainHash: response.data.txHash
    };
    
  } catch (error) {
    let errorMessage = 'Fraud packet generation failed';
    
    if (error.response) {
      errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Backend not responding. Is it running?';
    } else {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};