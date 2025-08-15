module.exports = (req, res) => {
  const { amount, verification } = req.body;
  
  // Simplified risk scoring algorithm
  let riskScore = 5; // Base risk
  const triggers = [];
  
  if (amount > 5000) {
    riskScore += 40;
    triggers.push("High transaction amount");
  }
  
  if (verification.status === "UNREGISTERED") {
    riskScore += 30;
    triggers.push("Unregistered business");
  }
  
  if (verification.watchlisted) {
    riskScore += Math.min(25, verification.reports * 5);
    triggers.push(`Blacklisted (${verification.reports} reports)`);
  }
  
  // Cap at 100%
  riskScore = Math.min(riskScore, 100);
  
  res.json({ risk: riskScore, triggers });
};