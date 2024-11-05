import React from 'react';
import { useNavigate} from 'react-router-dom'; // For navigation
import './PaymentFailedPage.css'; // External CSS file for styling

const PaymentFailedPage = () => {

    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate("/");
    };
    // const handleTryAgainClick = () => {
    //     navigate("/transaction");
    // };
  return (
    <div className="payment-failed-container">
      <div className="payment-failed-box">
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i> {/* Font Awesome icon */}
        </div>
        <h1>Payment Failed</h1>
        <p>We encountered an issue while processing your payment. Please try again later.</p>
        <p>If the problem persists, please contact support at <strong>support@yourcompany.com</strong>.</p>
        <div className="buttons-container">
          {/* <button className="btn try-again-btn" onClick={handleTryAgainClick}>Try Again</button> */}
          <button className="btn contact-btn" onClick={handleHomeClick}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
