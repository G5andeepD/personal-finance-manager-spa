// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import Income from './components/Income';
import Expense from './components/Expense';
import Summary from './components/Summary';
import axios from 'axios';

const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";
function App() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, cashInHand: 0 });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${apiUrl}/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        Personal Finance Manager
      </header>
      <div className="summary">
        <Summary summary={summary} />
      </div>
      <div className="content">
        <div className="income">
          <Income onIncomeAdded={fetchSummary} />
        </div>
        <div className="expense">
          <Expense onExpenseAdded={fetchSummary} />
        </div>
      </div>
    </div>
  );
}

export default App;
