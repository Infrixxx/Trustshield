const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// 1. Enable CORS first
app.use(cors());

// 2. Simple JSON middleware
app.use(express.json());

// 3. Load data files
const dataPath = path.join(__dirname, 'data');
const cipcData = JSON.parse(fs.readFileSync(path.join(dataPath, 'cipc.json'), 'utf8'));
const watchlistData = JSON.parse(fs.readFileSync(path.join(dataPath, 'watchlist.json'), 'utf8'));

// 4. Health endpoint (SIMPLIFIED)
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    region: 'South Africa',
    data: {
      cipc: cipcData.length,
      watchlist: watchlistData.length
    }
  });
});

// 5. Scoring endpoint
app.post('/score', (req, res) => {
  try {
    const { merchant, amount } = req.body;
    
    // Input validation
    if (!merchant || typeof amount !== 'number') {
      return res.status(400).json({
        error: "Invalid input",
        details: "Merchant (string) and amount (number) are required"
      });
    }

    // Find business data
    const business = cipcData.find(b => 
      b.name.toLowerCase() === merchant.toLowerCase()
    ) || { status: 'UNREGISTERED' };
    
    // Find watchlist entry
    const watchlistEntry = watchlistData.find(w => 
      w.name.toLowerCase() === merchant.toLowerCase()
    );
    
    // Calculate risk
    let score = 5;
    const triggers = [];
    
    if (amount > 5000) {
      score += 40;
      triggers.push(`High amount (R${amount.toLocaleString('en-ZA')})`);
    }
    
    if (business.status === 'UNREGISTERED') {
      score += 30;
      triggers.push("Unregistered business");
    }
    
    if (watchlistEntry) {
      score += Math.min(25, watchlistEntry.reports * 5);
      triggers.push(`Watchlisted (${watchlistEntry.reports} reports)`);
    }
    
    res.json({
      score: Math.min(score, 100),
      triggers,
      recommendation: score >= 70 ? "BLOCK" : "ALLOW"
    });
    
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`TrustShield API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});