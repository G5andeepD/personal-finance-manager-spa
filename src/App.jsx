import React, { useState, useEffect } from 'react';
import './App.css';
import Income from './components/Income';
import Expense from './components/Expense';
import Summary from './components/Summary';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";

function App() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, cashInHand: 0 });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (Cookies.get('userinfo')) {
      const userInfoCookie = Cookies.get('userinfo');
      sessionStorage.setItem("userInfo", userInfoCookie);
      Cookies.remove('userinfo');
      const userInfo = JSON.parse(atob(userInfoCookie));
      setSignedIn(true);
      setUser(userInfo);
      fetchSummary();
    } else if (sessionStorage.getItem("userInfo")) {
      const userInfo = JSON.parse(atob(sessionStorage.getItem("userInfo")));
      setSignedIn(true);
      setUser(userInfo);
      fetchSummary();
    } else {
      console.log("User is not signed in");
    }
    setIsAuthLoading(false);
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
        <div className="header-content">
          Personal Finance Manager
          {signedIn ? (
            <button onClick={async () => {
              sessionStorage.removeItem("userInfo");
              setSignedIn(false);
              setUser(null);
              window.location.href = `/auth/logout?session_hint=${Cookies.get('session_hint')}`;
            }}>Logout</button>
          ) : (
            <button className="login-button" onClick={() => { window.location.href = "/auth/login" }}>Login</button>
          )}
        </div>
      </header>

      {!isAuthLoading && signedIn ? (
        <>
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
        </>
      ) : (
        <div>Please log in to view your personal finance manager.</div>
      )}
    </div>
  );
}

export default App;
