const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// 1. Configure bulletproof JSON parsing
app.use(express.json({
  strict: true,
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
    try {
      JSON.parse(req.rawBody);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));

// 2. Load data files with validation
const dataPath = path.join(__dirname, 'data');
const loadData = (file) => {
  try {
    const raw = fs.readFileSync(path.join(dataPath, file), 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    return data;
  } catch (e) {
    console.error(`CRITICAL: Failed to load ${file}`, e);
    process.exit(1); // Exit if data fails to load
  }
};

const cipcData = loadData('cipc.json');
const watchlistData = loadData('watchlist.json');

// 3. Scoring endpoint with atomic error handling
app.post('/score', (req, res) => {
  try {
    // Validate request structure
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        error: "Invalid request",
        details: "Request body must be a JSON object"
      });
    }

    const { merchant, amount } = req.body;

    // Validate field types
    if (typeof merchant !== 'string' || merchant.trim() === '') {
      return res.status(400).json({
        error: "Invalid merchant",
        details: "Must be a non-empty string"
      });
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({
        error: "Invalid amount",
        details: "Must be a valid number"
      });
    }

    // Find business data (case-insensitive)
    const business = cipcData.find(b => 
      b?.name?.toLowerCase() === merchant.toLowerCase()
    ) || { status: 'UNREGISTERED' };

    // Calculate risk score
    let score = 5;
    const triggers = [];
    
    // SA-specific rules
    if (amount > 5000) {
      score += 40;
      triggers.push(`High amount (R${amount.toLocaleString('en-ZA')})`);
    }
    
    if (business.status === 'UNREGISTERED') {
      score += 30;
      triggers.push("Unregistered business");
    }
    
    // Check watchlist
    const watchlistEntry = watchlistData.find(w => 
      w?.name?.toLowerCase() === merchant.toLowerCase()
    );
    
    if (watchlistEntry) {
      score += Math.min(25, watchlistEntry.reports * 5);
      triggers.push(`Watchlisted (${watchlistEntry.reports} reports)`);
    }

    // Successful response
    res.json({
      success: true,
      score: Math.min(score, 100),
      triggers,
      recommendation: score >= 70 ? "BLOCK" : "ALLOW",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('SERVER ERROR:', error);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 4. Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TrustShield API running on port ${PORT}`);
  console.log('Data loaded:', {
    cipcRecords: cipcData.length,
    watchlistRecords: watchlistData.length
  });
});