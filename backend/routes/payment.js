const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  const { merchant, amount } = req.body;
  
  // Simulate payment processing
  setTimeout(() => {
    res.json({
      success: true,
      transactionId: `TX-${uuidv4().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      merchant,
      amount,
      status: 'COMPLETED'
    });
  }, 1500);
};