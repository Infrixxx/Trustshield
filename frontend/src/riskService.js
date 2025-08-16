// src/services/riskService.js
import cipcData from './cipc.json';
import watchlistData from './watchlist.json';

export function assessRisk(merchant, amount) {
  // Normalize merchant name for comparison
  const merchantLower = merchant.toLowerCase();
  
  // 1. Check CIPC registration status
  const cipcRecord = cipcData.find(item => 
    item.name.toLowerCase() === merchantLower
  );
  
  // 2. Check watchlist
  const watchlistRecord = watchlistData.find(item => 
    merchantLower.includes(item.name.toLowerCase())
  );

  // 3. Calculate risk score
  let score = 0;
  const triggers = [];
  
  // Penalty for unregistered businesses
  if (!cipcRecord || cipcRecord.status === 'UNREGISTERED') {
    score += 70;
    triggers.push('Unregistered business (CIPC)');
  }
  
  // Watchlist match penalty
  if (watchlistRecord) {
    score += watchlistRecord.riskScore * 0.3;
    triggers.push(`Watchlist match: ${watchlistRecord.reason}`);
  }
  
  // Amount risk (R10,000 = 30% risk)
  const amountRisk = Math.min(amount / 10000 * 30, 30);
  score += amountRisk;
  
  // Critical if contains 'scam'
  if (merchantLower.includes('scam')) {
    score = 100;
    triggers.push('Contains scam terminology');
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  // Add high amount trigger
  if (amount > 10000) {
    triggers.push(`High amount: R${amount}`);
  }
  
  return {
    score: Math.round(score),
    isHighRisk: score >= 65,
    triggers
  };
}