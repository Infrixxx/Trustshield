import cipcData from './cipc.json';
import watchlistData from './watchlist.json';

export function assessRisk(merchant, amount) {
  const merchantLower = merchant.toLowerCase();
  let score = 0;
  const triggers = [];
  
  // 1. Check CIPC registration
  const cipcRecord = cipcData.find(item => 
    item.name.toLowerCase() === merchantLower
  );
  
  if (!cipcRecord) {
    triggers.push('Unregistered business (CIPC)');
    score += 70;
  } else if (cipcRecord.status === 'UNREGISTERED') {
    triggers.push('CIPC registration: UNREGISTERED');
    score += 70;
  }
  
  // 2. Check watchlist
  const watchlistRecord = watchlistData.find(item => 
    merchantLower.includes(item.name.toLowerCase())
  );
  
  if (watchlistRecord) {
    triggers.push(`Watchlist match: ${watchlistRecord.reason}`);
    score += watchlistRecord.riskScore * 0.3;
  }
  
  // 3. Check for scam keywords
  if (merchantLower.includes('scam')) {
    triggers.push('Contains scam terminology');
    score = 100; // Automatic 100% for scam names
  }
  
  // 4. Amount-based risk
  if (amount > 5000) {
    triggers.push(`High amount: R${amount}`);
    score += 20;
  }
  
  // Ensure score is between 0-100
  score = Math.min(Math.max(score, 0), 100);
  
  return {
    score: Math.round(score),
    isHighRisk: score >= 65,
    triggers
  };
}