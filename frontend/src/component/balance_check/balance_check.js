import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BalanceCheckPage = () => {
    const location = useLocation();
    const { keys } = location.state; // Retrieve keys from state

    // State to store the balance, loading state, and error message
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleTransactionButton = (e) => {
        navigate("/transaction", { state: { keys } }); // Pass keys to the transaction page
    };

    // Function to check balance from the backend
    const handleCheckBalance = async () => {
        setLoading(true);
        setError(null); // Clear any previous errors
    
        console.log("Payment Key being sent to backend:", keys.paymentAddr); // Log the payment key
    
        try {
            // Send POST request to the backend with payment key
            const response = await fetch('http://localhost:8000/api/check-balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentKey: keys.paymentAddr }), // Sending the payment key
            });
    
            console.log("Response from backend:", response); // Log the response object
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Parse the response and update the balance state
            const data = await response.json();
            console.log("Balance data received:", data);
            setBalance(data.balance); // Update the balance state
        } catch (error) {
            console.error("Error checking balance:", error);
            setError(error.message); // Update error state
        } finally {
            setLoading(false); // Set loading state to false after the request
        }
    };
    

    return (
        <div style={styles.container}>
            <h1>Payment Address</h1>
            <div style={styles.box}>
                <h2>Payment Key:</h2>
                <pre style={styles.keyBox}>{keys.paymentAddr}</pre>
                <button 
                    style={styles.button} 
                    onClick={handleCheckBalance} 
                    disabled={loading}
                >
                    {loading ? 'Checking Balance...' : 'Check Balance'}
                </button>
            </div>

            {/* Display balance if it's available */}
            {balance !== null && (
                <div style={styles.balanceBox}>
                    <h3>Available Balance</h3>
                    <p>{balance} ADA</p>
                    <button 
                        style={styles.button} 
                        onClick={handleTransactionButton} 
                        >
                            Go to Transaction
                    </button>
                </div>
            )}

            {/* Display error message if an error occurred */}
            {error && (
                <div style={styles.errorBox}>
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    box: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        marginTop: '20px',
        backgroundColor: '#f9f9f9',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    keyBox: {
        whiteSpace: 'pre-wrap', // Allows wrapping of long text
        wordBreak: 'break-all', // Breaks long words
        fontFamily: 'monospace',
    },
    button: {
        marginTop: '15px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    balanceBox: {
        border: '1px solid #28a745',
        borderRadius: '5px',
        padding: '10px',
        marginTop: '20px',
        backgroundColor: '#e6f9e6',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    errorBox: {
        border: '1px solid #dc3545',
        borderRadius: '5px',
        padding: '10px',
        marginTop: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
};

export default BalanceCheckPage;
