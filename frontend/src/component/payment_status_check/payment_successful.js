import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const { transactionId, amount } = location.state || {};

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment.</p>
            {transactionId && (
                <div>
                    <h2>Transaction Details:</h2>
                    <p>Transaction ID: {transactionId}</p>
                    <p>Amount: ${amount}</p>
                </div>
            )}
            <button onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
    );
};

export default PaymentSuccess;