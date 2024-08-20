// src/components/Expense.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const expenseCategories = [
  "Rent/Mortgage", "Utilities", "Groceries", "Transport", "Insurance",
  "Entertainment", "Healthcare", "Education", "Savings", "Miscellaneous"
];

const Expense = ({ onExpenseAdded }) => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(expenseCategories);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/v1/expense');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const addExpense = async () => {
    try {
      const response = await axios.post('/api/v1/expense', { amount, category });
      setExpenses([...expenses, response.data]);
      setAmount('');
      setCategory('');
      onExpenseAdded(); // Trigger the summary update
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/v1/expense?id=${id}`);
      setExpenses(expenses.filter(expense => expense.id !== id));
      onExpenseAdded(); // Trigger the summary update
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  const handleCategorySearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredCategories(
      expenseCategories.filter(category => category.toLowerCase().includes(query))
    );
    setCategory(e.target.value);
  };

  return (
    <div>
      <h2>Expenses</h2>
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
        value={category}
        onChange={handleCategorySearch}
        placeholder="Search or select category"
        list="expense-categories"
      />
      <datalist id="expense-categories">
        {filteredCategories.map((category, index) => (
          <option key={index} value={category} />
        ))}
      </datalist>
      <button onClick={addExpense}>Add Expense</button>
      <table>
        <thead>
          <tr>
            <th>Amount (Rs.)</th>
            <th>Category</th>
            <th>Date</th>
            <th>Time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const { formattedDate, formattedTime } = formatDateTime(expense.timestamp);
            return (
              <tr key={expense.id}>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                  <button onClick={() => deleteExpense(expense.id)}>
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

export default Expense;
