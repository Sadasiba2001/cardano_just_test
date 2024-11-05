// src/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing_page.css'; // Import the CSS file for styling

const LandingPage = () => {
    const navigate = useNavigate(); // Get the navigate function from useNavigate

    const handleConnectClick = () => {
        // Logic to connect to Cardano-CLI can be added here
        alert("Connecting to Cardano-CLI...");
        navigate("/status"); // Navigate to the /status route
    };

    return (
        <div className="landing-page">
            <header className="landing-header">
                <h1>Welcome to Cardano CLI Connector</h1>
                <p className="warning">
                    Warning: Before clicking the "Connect to Cardano-CLI" button, ensure that Cardano-CLI is running on your system.
                </p>
                <button className="connect-button" onClick={handleConnectClick}>
                    Connect to Cardano-CLI
                </button>
            </header>
        </div>
    );
};

export default LandingPage;
