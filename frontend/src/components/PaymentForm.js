import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    merchant: '',
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="payment-form">
      <h2 className="subheader">Payment Security Check</h2>
      <p className="form-description">
        Enter transaction details for AI-powered fraud detection
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="merchant">Merchant Name</label>
          <input
            type="text"
            id="merchant"
            name="merchant"
            value={formData.merchant}
            onChange={handleChange}
            placeholder="e.g., Amazon, Pick n Pay, Shoprite"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Transaction Amount (ZAR)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="1"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="verify-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'ANALYSE RISK'
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;