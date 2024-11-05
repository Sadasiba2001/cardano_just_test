import React, { useEffect, useState } from 'react';
import './CardanoStatus.css'; // Import a CSS file for styling
import { useNavigate } from 'react-router-dom';

const CardanoStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Move useNavigate here

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/cardano/tip');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStatus(data.tip);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const parsedStatus = JSON.parse(status); // Parse the JSON string

  const handleKeygenerateClick = () => {
    navigate("/generate-keys"); // Navigate to the /generate-keys route
  };

  return (
    <div className="status-container">
      <h2>Cardano Node Status</h2>
      <ul className="status-list">
        <li><strong>Block:</strong> {parsedStatus.block}</li>
        <li><strong>Epoch:</strong> {parsedStatus.epoch}</li>
        <li><strong>Era:</strong> {parsedStatus.era}</li>
        <li><strong>Hash:</strong> {parsedStatus.hash}</li>
        <li><strong>Slot:</strong> {parsedStatus.slot}</li>
        <li><strong>Slot in Epoch:</strong> {parsedStatus.slotInEpoch}</li>
        <li><strong>Slots to Epoch End:</strong> {parsedStatus.slotsToEpochEnd}</li>
        <li><strong>Sync Progress:</strong> {parsedStatus.syncProgress}</li>
      </ul>
      <button className="connect-button" onClick={handleKeygenerateClick}>
        Generate Key
      </button>
    </div>
  );
};

export default CardanoStatus;
