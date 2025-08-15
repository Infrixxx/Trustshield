const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  const { merchant, amount, verification } = req.body;
  
  // Generate unique case ID (SAPS format)
  const caseId = `SAPS/${new Date().getFullYear()}/${uuidv4().slice(0,8).toUpperCase()}`;
  
  // Mock Polygon TX hash (real implementation would use Alchemy SDK)
  const txHash = `0x${uuidv4().replace(/-/g, '').slice(0,40)}`;
  
  res.json({
    success: true,
    caseId,
    txHash,
    pdfUrl: `/fraud-packets/${caseId.replace('/', '_')}.pdf`,
    timestamp: new Date().toISOString()
  });
};