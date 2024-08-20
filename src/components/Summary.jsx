// src/components/Summary.jsx

import React from 'react';

const Summary = ({ summary }) => {
  return (
    <div className="summary-container">
      <div className="summary-item">
        <p>Total Income:</p>
        <p>Rs. {summary.totalIncome}</p>
      </div>
      <div className="summary-item">
        <p>Total Expenses:</p>
        <p>Rs. {summary.totalExpenses}</p>
      </div>
      <div className="summary-item">
        <p>Cash in Hand:</p>
        <p>Rs. {summary.cashInHand}</p>
      </div>
    </div>
  );
};

export default Summary;
