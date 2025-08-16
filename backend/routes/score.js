const path = require('path');
const fs = require('fs');

// Cache data files in memory
let cipcData = [];
let watchlistData = [];

// Reload data files function
const reloadData = () => {
  try {
    cipcData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cipc.json')));
    watchlistData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/watchlist.json')));
    console.log('Data reloaded successfully');
  } catch (err) {
    console.error('Data loading failed:', err);
    // Fallback empty data
    cipcData = [];
    watchlistData = [];
  }
};

// Initial load
reloadData();

module.exports = (req, res) => {
  try {
    const { merchant, amount } = req.body;

    // Validate merchant exists in data
    const business = cipcData.find(b => 
      b && b.name && b.name.toLowerCase() === merchant.toLowerCase()
    );
    
    const status = business?.status || 'UNREGISTERED';
    const watchlistEntry = watchlistData.find(w => 
      w && w.name && w.name.toLowerCase() === merchant.toLowerCase()
    );

    // Calculate risk
    let riskScore = 5;
    const triggers = [];
    
    if (amount > 5000) {
      riskScore += 40;
      triggers.push(`High amount (R${amount.toLocaleString('en-ZA')})`);
    }
    
    if (status === "UNREGISTERED") {
      riskScore += 30;
      triggers.push("Unregistered business");
    }
    
    if (watchlistEntry) {
      riskScore += Math.min(25, watchlistEntry.reports * 5);
      triggers.push(`Watchlisted (${watchlistEntry.reports} reports)`);
    }
    
    riskScore = Math.min(riskScore, 100);

    res.json({
      success: true,
      riskScore,
      triggers,
      recommendation: riskScore >= 70 ? "BLOCK" : "ALLOW",
      merchantData: {
        name: merchant,
        status,
        isWatchlisted: !!watchlistEntry
      }
    });

  } catch (error) {
    console.error('Scoring failed:', error);
    res.status(500).json({
      success: false,
      error: "Scoring process failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};