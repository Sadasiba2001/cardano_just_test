// src/TransactionKeyForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './transaction.css';

const TransactionForm = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const { keys } = location.state || {}; // Retrieve keys from location state
    const [senderAddr, setSenderAddr] = useState(keys ? keys.paymentAddr : '');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAddr, setRecipientAddr] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/adda/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: senderAddr,
                recipient: recipientAddr,
                amount,
                name: keys ? keys.paymentAddr : '', // Use name or adjust as needed
            }),
        });

        if (response.status === 200) {
            // Navigate to payment status page on success
            navigate('/payment_status_success');
        } else {
            // Navigate to payment failed page on error
            navigate('/payment_status_failed');
        }
    };

    return (
        <div className="transaction-form">
            <h2>Transaction Key Form</h2>
            <form onSubmit={handleSubmit}>
                <h3>Sender Information</h3>
                <input
                    type="text"
                    placeholder="Sender Address"
                    value={senderAddr}
                    onChange={(e) => setSenderAddr(e.target.value)}
                    required
                />

                <h3>Recipient Information</h3>
                <input
                    type="text"
                    placeholder="Recipient Name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddr}
                    onChange={(e) => setRecipientAddr(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <button type="submit">Submit Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;
