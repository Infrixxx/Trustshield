const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  const { merchant, amount, verification, triggers } = req.body;
  
  // Generate unique case ID (SAPS format)
  const caseId = `T5-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Mock Polygon TX hash
  const txHash = `0x${uuidv4().replace(/-/g, '').slice(0, 40)}`;
  
  // Log evidence
  const evidence = {
    merchant,
    amount,
    verification,
    triggers,
    timestamp: new Date().toISOString(),
    userAction: 'AUTO_BLOCKED'
  };
  
  console.log('Fraud evidence:', evidence);

  res.json({
    success: true,
    caseId,
    txHash,
    evidence
  });
};