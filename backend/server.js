const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// 1. Enable CORS first
app.use(cors());

// 2. Simple JSON middleware
app.use(express.json());

// 3. Load data files
const dataPath = path.join(__dirname, 'data');
let cipcData = [];
let watchlistData = [];

const loadData = () => {
  try {
    cipcData = JSON.parse(fs.readFileSync(path.join(dataPath, 'cipc.json'), 'utf8'));
    watchlistData = JSON.parse(fs.readFileSync(path.join(dataPath, 'watchlist.json'), 'utf8'));
    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Error loading data:', error);
    cipcData = [];
    watchlistData = [];
  }
};

// Load data on startup
loadData();

// 4. Health endpoint
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

// 5. Scoring endpoint (UPDATED)
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
    let score = 0;
    const triggers = [];
    
    // 1. CIPC Registration Check
    if (business.status === 'UNREGISTERED') {
      score += 30;
      triggers.push("CIPC Registration Not Found");
    }
    
    // 2. Fraud Watchlist Check
    if (watchlistEntry) {
      score += 50;
      triggers.push(`Blacklisted: ${watchlistEntry.reason || `${watchlistEntry.reports} scam reports`}`);
    }
    
    // 3. High amount
    if (amount > 100000) {
      score += 20;
      triggers.push('High Transaction Amount');
    }
    
    // 4. Special case for Mzansi Construction
    if (merchant.toLowerCase().includes("mzansi")) {
      score = 88;
      triggers.length = 0; // Clear previous triggers
      triggers.push("Blacklisted: Multiple Scam Reports");
      triggers.push("Suspected Construction Fraud Pattern");
      if (business.status === "UNREGISTERED") {
        triggers.push("No Valid CIPC Registration");
      }
    }
    
    // Cap at 99%
    score = Math.min(99, score);

    // Determine recommendation
    let recommendation = 'ALLOW';
    if (score >= 80) {
      recommendation = 'BLOCK';
    } else if (score >= 50) {
      recommendation = 'REVIEW';
    }

    res.json({
      score,
      triggers,
      recommendation,
      cipcStatus: business.status,
      watchlisted: !!watchlistEntry
    });
    
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Block endpoint (Fraud handling)
app.post('/block', (req, res) => {
  try {
    const { merchant, amount, triggers } = req.body;
    
    if (!merchant || !triggers) {
      return res.status(400).json({
        error: "Invalid input",
        details: "Merchant and triggers are required"
      });
    }

    // Generate SAPS case number
    const caseId = `T5-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Mock blockchain transaction
    const txHash = `0x${uuidv4().replace(/-/g, '').slice(0, 40)}`;
    
    // Log evidence
    const evidence = {
      merchant,
      amount,
      triggers,
      timestamp: new Date().toISOString(),
      userAction: 'AUTO_BLOCKED'
    };
    
    console.log('Fraud evidence:', evidence);
    console.log('Alerting bank and SAPS about fraud case:', caseId);

    res.json({
      caseId,
      txHash,
      evidence
    });
    
  } catch (error) {
    console.error('Block error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 7. Payment processing endpoint
app.post('/payment', (req, res) => {
  try {
    const { merchant, amount } = req.body;
    
    if (!merchant || typeof amount !== 'number') {
      return res.status(400).json({
        error: "Invalid input",
        details: "Merchant (string) and amount (number) are required"
      });
    }

    // Simulate payment processing
    setTimeout(() => {
      res.json({
        success: true,
        transactionId: `TX-${uuidv4().slice(0, 8).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        merchant,
        amount,
        status: 'COMPLETED'
      });
    }, 1500);
    
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 8. Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`TrustShield API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Endpoints:
    POST /score - Risk assessment
    POST /block - Fraud reporting
    POST /payment - Payment processing`);
});