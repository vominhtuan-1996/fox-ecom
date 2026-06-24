import React, { useState } from 'react';
import Toast from '../components/Toast';
import '../styles/Screen.css';

const ToastScreen = ({ onBack }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="screen-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1 className="screen-title">Toast Notification Test</h1>
      <button className="test-button success" onClick={() => showToast('✅ Thành công!', 'success')}>Success Toast</button>
      <button className="test-button error" onClick={() => showToast('❌ Có lỗi xảy ra!', 'error')}>Error Toast</button>
      <p className="description">Tap buttons to test toast variants</p>
      
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default ToastScreen;
