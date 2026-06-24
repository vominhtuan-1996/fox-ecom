import React from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'success' }) => (
  <div className={`toast ${type}`}>{message}</div>
);

export default Toast;
