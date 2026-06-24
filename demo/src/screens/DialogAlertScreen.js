import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import '../styles/Screen.css';

const DialogAlertScreen = ({ onBack }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="screen-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1 className="screen-title">Alert Dialog Test</h1>
      <button className="test-button" onClick={() => setShowDialog(true)}>Show Alert</button>
      <p className="description">Tap above to test alert dialog</p>
      
      {showDialog && (
        <Dialog
          title="ℹ️ Thông báo"
          message="Đây là Alert Dialog - chỉ có nút OK để đóng"
          buttons={[
            { label: 'OK', onClick: () => setShowDialog(false), style: 'primary' }
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default DialogAlertScreen;
