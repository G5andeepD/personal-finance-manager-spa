// src/components/Income.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// src/components/Income.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const incomeSources = [
  "Salary", "Freelancing", "Investments", "Interest", "Rent", "Business", 
  "Gifts", "Bonuses", "Dividends", "Other"
];

const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";

const Income = ({ onIncomeAdded }) => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState(0);
  const [source, setSource] = useState('');
  const [filteredSources, setFilteredSources] = useState(incomeSources);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/income`);
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const addIncome = async () => {
    try {
      const response = await axios.post(`${apiUrl}/income`, { amount, source });
      //sort the incomes by timestamp
      response.data.sort((a, b) => a.timestamp - b.timestamp
      );
      setIncomes([...incomes, response.data]);
      setAmount(0);
      setSource('');
      onIncomeAdded(); // Trigger the summary update
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${apiUrl}/income?id=${id}`);
      setIncomes(incomes.filter(income => income.id !== id));
      onIncomeAdded(); // Trigger the summary update
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  const handleSourceSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredSources(
      incomeSources.filter(source => source.toLowerCase().includes(query))
    );
    setSource(e.target.value);
  };

  return (
    <div>
      <h2>Income</h2>
      <input
        type="number"
        value={amount}
        step="100"
        min="0"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <input
        type="text"
        value={source}
        onChange={handleSourceSearch}
        placeholder="Search or select source"
        list="income-sources"
      />
      <datalist id="income-sources">
        {filteredSources.map((source, index) => (
          <option key={index} value={source} />
        ))}
      </datalist>
      <button onClick={addIncome}>Add Income</button>
      <table>
        <thead>
          <tr>
            <th>Amount (Rs.)</th>
            <th>Source</th>
            <th>Date</th>
            <th>Time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => {
            const { formattedDate, formattedTime } = formatDateTime(income.timestamp);
            return (
              <tr key={income.id}>
                <td>{income.amount}</td>
                <td>{income.source}</td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                  <button onClick={() => deleteIncome(income.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Income;

