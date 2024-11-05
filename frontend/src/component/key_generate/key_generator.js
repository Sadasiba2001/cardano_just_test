// src/KeyGenerator.js
import React, { useState } from 'react';
import './key_generator.css';
import { useNavigate } from 'react-router-dom';

const KeyGenerator = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTransactionButton = (e) => {
    navigate("/transaction", { state: { keys } }); // Pass keys to the transaction page
  };

  const handleBalanceCheckButton = (e) => {
    navigate("/balance_check", { state: { keys } }); 
  };

  const handleGenerateKeys = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keys');
      }

      const data = await response.json();
      setKeys(data.keys);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Key Generator</h2>
      <form onSubmit={handleGenerateKeys}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Generate Keys
        </button>
      </form>
      {loading && <p>Generating keys...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {keys && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Keys</h3>
          <pre style={{ textAlign: 'left' }}>
            <strong>Payment Address:</strong>
            <br />
            {keys.paymentAddr}
            <br />
            <strong>Stake Address:</strong>
            <br />
            {keys.stakeAddr}
          </pre>
          <button className="connect-button" onClick={handleTransactionButton}>
            Go to Transaction
          </button>
          <button className="connect-button" onClick={handleBalanceCheckButton}>
            Go to Balance check
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyGenerator;
