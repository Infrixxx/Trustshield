const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Create directory if doesn't exist
const outputDir = path.join(__dirname, '../public/fraud-packets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createFraudPDF(caseId, merchant, amount) {
  const doc = new PDFDocument();
  const filePath = path.join(outputDir, `SAPS_Case_${caseId.split('-').pop()}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header with logo placeholder
  doc.image('public/trust-shield-logo.png', 50, 45, { width: 50 })
     .fillColor('#2e7d32')
     .fontSize(20)
     .text('TRUST SHIELD', 110, 50)
     .fontSize(12)
     .text('AI-Powered Payment Security & Fraud Detection', 110, 75);

  doc.moveDown(2);
  
  // Case details
  doc.fillColor('#1565c0')
     .fontSize(16)
     .text(`SAPS Fraud Case: ${caseId}`, { underline: true });
  
  doc.fillColor('black')
     .fontSize(12)
     .text(`Generated: ${new Date().toLocaleString('en-ZA')}`);
  
  doc.moveDown();
  
  // Transaction evidence
  doc.fontSize(14)
     .text('TRANSACTION EVIDENCE:', { underline: true });
  
  doc.fontSize(12)
     .text(`• Merchant: ${merchant}`)
     .text(`• Amount: R${amount}`)
     .text(`• Date: ${new Date().toLocaleDateString('en-ZA')}`)
     .text(`• Time: ${new Date().toLocaleTimeString('en-ZA')}`)
     .text(`• Risk Score: 98/100 (CRITICAL)`);
  
  doc.moveDown();
  
  // Blockchain proof
  doc.fontSize(14)
     .text('BLOCKCHAIN VERIFICATION:', { underline: true });
  
  const txHash = caseId.replace(/-/g, '').toLowerCase();
  doc.fontSize(12)
     .text(`• TX Hash: ${txHash}`)
     .text(`• Network: Polygon Mumbai`)
     .text(`• Block: 4,892,183`)
     .text(`• Timestamp: ${new Date().toISOString()}`);
  
  doc.moveDown(2);
  
  // QR code placeholder
  doc.fillColor('#999')
     .text('Blockchain Verification QR:')
     .rect(50, doc.y, 100, 100)
     .stroke();
  
  doc.text('Scan to verify on PolygonScan', 50, doc.y + 110);
  
  // Footer
  doc.fontSize(10)
     .fillColor('#555')
     .text('TrustShield AI - Real-Time Fraud Prevention System | Developed for BET Habitatnon', 50, 750, {
        align: 'center',
        width: 500
     });

  doc.end();
  console.log(`Generated: ${filePath}`);
}

// Generate sample PDFs
createFraudPDF('T5-2025-001', 'Suspicious Merchant Pty', 12500);
createFraudPDF('T5-2025-002', 'Online Scam Ltd', 8750);
createFraudPDF('T5-2025-003', 'Phishing Store SA', 15230);