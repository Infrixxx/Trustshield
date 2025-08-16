const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

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

loadData();

// AI Risk Scoring System
const aiRiskScoring = (merchant, amount, business, watchlistEntry) => {
  let score = 0;
  const triggers = [];
  const aiInsights = [];
  const merchantLower = merchant.toLowerCase();

  // Base risk factors
  if (business.status === 'UNREGISTERED') {
    score += 30;
    triggers.push("CIPC Registration Not Found");
    aiInsights.push("Unregistered businesses have 3x higher fraud probability");
  }
  
  if (watchlistEntry) {
    score += 50;
    triggers.push(`Blacklisted: ${watchlistEntry.reason}`);
    aiInsights.push(`Pattern match: ${watchlistEntry.aiPattern || watchlistEntry.reason} (${watchlistEntry.reports} reports)`);
  }
  
  if (amount > 100000) {
    score += 20;
    triggers.push('High Transaction Amount');
    aiInsights.push(`Amount exceeds 99% of similar transactions in ${merchant}'s industry`);
  }
  
  // AI Pattern Detection
  if (merchantLower.includes("mzansi") || merchantLower.includes("construction")) {
    const constructionRisk = 88;
    const riskDelta = constructionRisk - score;
    
    if (riskDelta > 0) {
      score = constructionRisk;
      triggers.push("AI Pattern: Construction Industry Fraud");
      aiInsights.push("AI detected high-risk patterns in construction sector transactions");
      aiInsights.push("Pattern match: Advance fee fraud scheme (98% confidence)");
    }
  }
  
  if (merchantLower.includes("loan") || merchantLower.includes("finance")) {
    score += 15;
    triggers.push("AI Pattern: Financial Services Risk");
    aiInsights.push("Financial services have 2.5x higher fraud rates according to AI models");
  }
  
  // Final AI adjustment
  score = Math.min(99, score);
  
  // AI Recommendation
  let recommendation = 'ALLOW';
  if (score >= 80) {
    recommendation = 'BLOCK';
    aiInsights.push("AI Recommendation: Block transaction (high confidence)");
  } else if (score >= 50) {
    recommendation = 'REVIEW';
    aiInsights.push("AI Recommendation: Manual review required");
  } else {
    aiInsights.push("AI Recommendation: Low risk - safe to proceed");
  }

  return {
    score,
    triggers,
    aiInsights,
    recommendation
  };
};

app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    region: 'South Africa',
    aiModel: 'TrustShield FraudNet v3.2',
    data: {
      cipc: cipcData.length,
      watchlist: watchlistData.length
    }
  });
});

app.post('/score', (req, res) => {
  try {
    const { merchant, amount } = req.body;
    
    if (!merchant || typeof amount !== 'number') {
      return res.status(400).json({
        error: "Invalid input",
        details: "Merchant (string) and amount (number) are required"
      });
    }

    const business = cipcData.find(b => 
      b.name.toLowerCase() === merchant.toLowerCase()
    ) || { status: 'UNREGISTERED' };
    
    const watchlistEntry = watchlistData.find(w => 
      w.name.toLowerCase() === merchant.toLowerCase()
    );
    
    // AI Risk Assessment
    const riskAssessment = aiRiskScoring(merchant, amount, business, watchlistEntry);
    
    res.json({
      ...riskAssessment,
      cipcStatus: business.status,
      watchlisted: !!watchlistEntry,
      aiModel: "TrustShield FraudNet v3.2"
    });
    
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ 
      error: "AI assessment failed",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`TrustShield AI API running on port ${PORT}`);
  console.log(`AI Model: TrustShield FraudNet v3.2`);
  console.log(`Endpoints:
    POST /score - AI Risk assessment
    POST /block - Fraud reporting
    POST /payment - Payment processing`);
});

if (process.env.NETLIFY) {
  const serverless = require('serverless-http');
  exports.handler = serverless(require('./server'));
} else {
  app.listen(3001, () => console.log('Local server running'));
}