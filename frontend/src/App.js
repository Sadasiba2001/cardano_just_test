// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CardanoStatus from './component/cardano_status/CardanoStatus';
import LandingPage from './component/landing/landing_page';
import KeyGenerator from './component/key_generate/key_generator';
import TransactionForm from './component/transaction/transaction';
import BalanceCheckPage from './component/balance_check/balance_check';
import PaymentSuccess from './component/payment_status_check/payment_successful';
import PaymentFailedPage from './component/payment_status_check/payment_failed';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/status" element={<CardanoStatus />} />
          <Route path="/generate-keys" element={<KeyGenerator />} /> 
          <Route path="/transaction" element={<TransactionForm />} /> 
          <Route path="/balance_check" element={<BalanceCheckPage />} /> 
          <Route path="/payment_status_success" element={<PaymentSuccess />} /> 
          <Route path="/payment_status_failed" element={<PaymentFailedPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
