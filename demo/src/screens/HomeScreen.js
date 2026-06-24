import React from 'react';
import '../styles/Screen.css';

const HomeScreen = ({ onBack }) => (
  <div className="screen-container">
    <button className="back-button" onClick={onBack}>← Back</button>
    <h1 className="screen-title">🦊 Fox eCommerce SDK</h1>
    <div className="info-box">
      <p>✅ React Native App</p>
      <p>✅ Clean Architecture</p>
      <p>✅ Dialog Engine</p>
      <p>✅ Theme System</p>
      <p>✅ Production Ready</p>
    </div>
  </div>
);

export default HomeScreen;
