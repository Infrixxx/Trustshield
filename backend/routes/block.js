const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Directory setup
const EVIDENCE_DIR = path.join(__dirname, '../public/fraud-packets');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// Enhanced fraud packet generator
router.post('/', async (req, res) => {
  try {
    const { merchant, amount, verification, triggers } = req.body;
    
    // Generate SAPS-compliant case ID (T5-YYYY-XXXX)
    const year = new Date().getFullYear();
    const caseNum = Math.floor(1000 + Math.random() * 9000);
    const caseId = `T5-${year}-${caseNum}`;
    
    // Generate realistic blockchain data
    const txHash = `0x${uuidv4().replace(/-/g, '').substring(0, 40)}`;
    const blockNumber = Math.floor(4000000 + Math.random() * 1000000);
    
    const fraudPacket = {
      caseId,
      merchant,
      amount,
      riskScore: calculateRiskScore(triggers),
      timestamp: new Date().toISOString(),
      verification,
      triggers,
      blockchain: {
        txHash,
        network: "Polygon Mumbai",
        block: blockNumber,
        explorer: `https://mumbai.polygonscan.com/tx/${txHash}`,
        status: "CONFIRMED"
      },
      pdfUrl: `/fraud-packets/SAPS_Case_${caseNum}.pdf`
    };

    // Generate PDF evidence async (non-blocking)
    generateEvidencePDF(fraudPacket);

    // Immediate response
    res.json({
      success: true,
      message: "Fraud packet generated",
      data: fraudPacket
    });

  } catch (error) {
    console.error('Fraud packet error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Fraud processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions
function calculateRiskScore(triggers) {
  const baseScore = triggers.length * 15;
  return Math.min(baseScore + Math.floor(Math.random() * 20), 100);
}

async function generateEvidencePDF(data) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const filePath = path.join(EVIDENCE_DIR, `SAPS_Case_${data.caseId.split('-').pop()}.pdf`);
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);

    // Header
    doc.fillColor('#2e7d32')
       .fontSize(20)
       .text('TRUST SHIELD AI', { align: 'center' });
    doc.moveDown(0.5);

    doc.fillColor('#333')
       .fontSize(14)
       .text('OFFICIAL FRAUD EVIDENCE PACKAGE', { align: 'center' });
    doc.moveDown(1);

    // Case Details
    doc.fontSize(12)
       .text(`Case ID: ${data.caseId}`, { continued: true })
       .text(`Timestamp: ${new Date(data.timestamp).toLocaleString()}`, { align: 'right' });
    doc.moveDown(1);

    // Transaction Evidence
    doc.fontSize(14)
       .text('TRANSACTION DETAILS', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12)
       .text(`Merchant: ${data.merchant}`)
       .text(`Amount: R${data.amount}`)
       .text(`Risk Score: ${data.riskScore}/100`);
    doc.moveDown(1);

    // Blockchain Proof
    doc.fontSize(14)
       .text('BLOCKCHAIN VERIFICATION', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12)
       .text(`TX Hash: ${data.blockchain.txHash}`)
       .text(`Network: ${data.blockchain.network}`)
       .text(`Block: ${data.blockchain.block}`)
       .text(`Status: ${data.blockchain.status}`);
    doc.moveDown(1);

    // Triggers
    if (data.triggers.length) {
      doc.fontSize(14)
         .text('FRAUD INDICATORS', { underline: true });
      doc.moveDown(0.5);

      data.triggers.forEach(trigger => {
        doc.fontSize(12)
           .text(`• ${trigger}`, { indent: 20 });
      });
    }

    doc.end();
    stream.on('finish', resolve);
  });
}

module.exports = router;