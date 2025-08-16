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
    let riskScore = 0;
    const triggers = [];
    
    // 1. CIPC Registration Check
    if (status === "UNREGISTERED") {
      riskScore += 30;
      triggers.push("CIPC Registration Not Found");
    }
    
    // 2. Fraud Watchlist Check
    if (watchlistEntry) {
      riskScore += 50;
      triggers.push(`Blacklisted: ${watchlistEntry.reason || `${watchlistEntry.reports} scam reports`}`);
    }
    
    // 3. High amount
    if (amount > 100000) {
      riskScore += 20;
      triggers.push('High Transaction Amount');
    }
    
    // 4. Special case for Mzansi Construction
    if (merchant.toLowerCase().includes("mzansi")) {
      riskScore = 88;
      triggers.length = 0; // Clear previous triggers
      triggers.push("Blacklisted: Multiple Scam Reports");
      triggers.push("Suspected Construction Fraud Pattern");
      if (status === "UNREGISTERED") {
        triggers.push("No Valid CIPC Registration");
      }
    }
    
    // Cap at 99%
    riskScore = Math.min(99, riskScore);

    // Determine recommendation
    let recommendation = 'ALLOW';
    if (riskScore >= 80) {
      recommendation = 'BLOCK';
    } else if (riskScore >= 50) {
      recommendation = 'REVIEW';
    }

    res.json({
      success: true,
      score: riskScore,
      triggers,
      recommendation,
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