import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const checkRisk = async (merchant, amount) => {
  try {
    const response = await axios.post(`${API_BASE}/score`, {
      merchant,
      amount: Number(amount)
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error('Failed to assess fraud risk. Please try again.');
  }
};

export const generateFraudPacket = async (riskData) => {
  // In a real implementation, this would call /block endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        caseId: `SAPS-${Math.floor(1000 + Math.random() * 9000)}`,
        filename: `SAPS_Case_00${Math.floor(Math.random() * 3) + 1}.pdf`,
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    }, 1500);
  });
};