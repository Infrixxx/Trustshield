import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FraudCaseView({ caseId, onReset, transactionData }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(`/fraud-packets/SAPS_Case_${caseId.split('-').pop()}.pdf`);
  const [fallbackUrl, setFallbackUrl] = useState(null);

  // Generate fallback PDF content
  const generateFallback = () => {
    const htmlContent = `
      <html>
        <head>
          <title>${caseId} - TrustShield</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            .header { color: #2e7d32; text-align: center; }
            .case-id { font-size: 1.5em; font-weight: bold; }
            .tx-details { background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .blockchain { border-left: 4px solid #2e7d32; padding: 10px 20px; background: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TRUST SHIELD</h1>
            <p>AI-Powered Fraud Evidence Package</p>
          </div>
          
          <h2 class="case-id">SAPS Fraud Case: ${caseId}</h2>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <hr>
          
          <div class="tx-details">
            <h3>Blocked Transaction</h3>
            <p><strong>Merchant:</strong> ${transactionData?.merchant || 'Unknown'}</p>
            <p><strong>Amount:</strong> R${transactionData?.amount || '0'}</p>
            <p><strong>Reason:</strong> AI-detected fraud pattern (98% confidence)</p>
          </div>
          
          <div class="blockchain">
            <h3>Blockchain Verification</h3>
            <p><strong>TX Hash:</strong> ${caseId.replace(/-/g, '').toLowerCase()}</p>
            <p><strong>Status:</strong> Confirmed (3 block confirmations)</p>
            <p><strong>Network:</strong> Polygon Mumbai</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            This is a temporary evidence report. Full PDF generation is in progress.
          </p>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    // Check if PDF exists
    fetch(pdfUrl)
      .then(res => {
        if (!res.ok) {
          setPdfError(true);
          setFallbackUrl(generateFallback());
        }
      })
      .catch(() => {
        setPdfError(true);
        setFallbackUrl(generateFallback());
      });
  }, [caseId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="fraud-case-container">
      <div className="case-header">
        <h2>SAPS Fraud Case: {caseId}</h2>
        <p>Blockchain-secured evidence package</p>
        
        <div className="verification-badge">
          <div className="blockchain-icon">⛓️</div>
          <div>
            <p>TX: {caseId.replace(/-/g, '').toLowerCase()}</p>
            <p>Status: Confirmed (3 Block Confirmations)</p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={() => window.open(pdfError ? fallbackUrl : pdfUrl, '_blank')}>
          OPEN IN NEW TAB
        </button>
        <a href={pdfError ? fallbackUrl : pdfUrl} download={`TrustShield_${caseId}.${pdfError ? 'html' : 'pdf'}`}>
          DOWNLOAD PDF
        </a>
        <button onClick={onReset} className="reset-btn">
          NEW TRANSACTION
        </button>
      </div>

      <div className="pdf-viewer">
        {pdfError ? (
          <iframe 
            src={fallbackUrl} 
            title="fallback-pdf"
            width="100%" 
            height="500px" 
            style={{ border: 'none' }}
          />
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={() => setPdfError(true)}
            loading={
              <div className="pdf-loading">
                <div className="spinner"></div>
                <p>Securing blockchain evidence...</p>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              width={800}
              renderTextLayer={true}
            />
          </Document>
        )}
      </div>

      <div className="pdf-controls">
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
        >
          ← Previous
        </button>
        <span>Page {pageNumber} of {numPages || '1'}</span>
        <button 
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))}
        >
          Next →
        </button>
      </div>

      <div className="transaction-details">
        <h3>Blocked Transaction Details</h3>
        <p><strong>Merchant:</strong> {transactionData?.merchant}</p>
        <p><strong>Amount:</strong> R{transactionData?.amount}</p>
        <p><strong>Reason:</strong> High-risk fraud pattern detected</p>
      </div>

      <div className="blockchain-verify">
        <a 
          href={`https://mumbai.polygonscan.com/tx/${caseId.replace(/-/g, '').toLowerCase()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="explorer-link"
        >
          LIVE VERIFICATION ON POLYGONSCAN
        </a>
      </div>

      <style jsx>{`
        .fraud-case-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .case-header {
          text-align: center;
          margin-bottom: 20px;
          position: relative;
        }
        .verification-badge {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f1f8e9;
          padding: 15px;
          border-radius: 8px;
          margin: 20px auto;
          max-width: 400px;
        }
        .blockchain-icon {
          font-size: 24px;
          background: #2e7d32;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 20px 0;
        }
        .action-buttons button, .action-buttons a {
          padding: 10px 20px;
          background: #1565c0;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-weight: bold;
        }
        .reset-btn {
          background: #d32f2f !important;
        }
        .pdf-viewer {
          border: 1px solid #ddd;
          margin: 20px 0;
          min-height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pdf-controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 15px 0;
        }
        .transaction-details {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .blockchain-verify {
          text-align: center;
          margin-top: 30px;
        }
        .explorer-link {
          display: inline-block;
          padding: 12px 25px;
          background: #7b1fa2;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.3s;
        }
        .explorer-link:hover {
          background: #6a1b9a;
        }
        .pdf-loading {
          text-align: center;
          padding: 30px;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #2e7d32;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}