const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use((req, res, next) => {
  // Enable CORS for frontend
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.post('/verify', require('./routes/verify'));
app.post('/score', require('./routes/score'));
app.post('/block', require('./routes/block'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    region: 'South Africa'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TrustShield API running on port ${PORT}`);
  console.log(`SA Fraud Prevention System: ACTIVE`);
});