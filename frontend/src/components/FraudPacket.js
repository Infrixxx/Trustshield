import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { 
  Box, 
  Typography, 
  Button, 
  Link, 
  CircularProgress,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const FraudPacket = ({ caseData }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  if (!caseData) return null;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: '1px solid #339af0',
        borderRadius: 2,
        backgroundColor: '#e7f5ff'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PictureAsPdfIcon sx={{ fontSize: 32, mr: 1.5, color: '#e03131' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SAPS Fraud Case: {caseData.caseId}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Generated: {new Date(caseData.timestamp).toLocaleString()}
      </Typography>
      
      <Box sx={{ 
        border: '1px solid #d0ebff', 
        minHeight: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        mb: 2
      }}>
        <Document
          file={`/fraud-packets/${caseData.filename}`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading fraud evidence...
              </Typography>
            </Box>
          }
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </Box>
      
      {numPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <Typography variant="body1" sx={{ mx: 2, alignSelf: 'center' }}>
            Page {pageNumber} of {numPages}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          href={`/fraud-packets/${caseData.filename}`}
          download
          sx={{ fontWeight: 'bold' }}
        >
          Download PDF
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          endIcon={<OpenInNewIcon />}
          href={`/fraud-packets/${caseData.filename}`}
          target="_blank"
          sx={{ fontWeight: 'bold' }}
        >
          Open in New Tab
        </Button>
      </Box>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#d3f9d8', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Blockchain Verification:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
          TX Hash: {caseData.blockchainHash}
        </Typography>
        <Link 
          href={`https://mumbai.polygonscan.com/tx/${caseData.blockchainHash}`} 
          target="_blank"
          sx={{ mt: 1, display: 'inline-block' }}
        >
          View on Polygon Explorer
        </Link>
      </Box>
    </Box>
  );
};

export default FraudPacket;