import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import '../styles/Screen.css';

const DialogCustomScreen = ({ onBack }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="screen-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1 className="screen-title">Custom Dialog Test</h1>
      <button className="test-button" onClick={() => setShowDialog(true)}>Show Custom</button>
      <p className="description">Tap above to test custom dialog</p>
      
      {showDialog && (
        <Dialog
          title="🎨 Custom Dialog"
          message="Đây là custom dialog với thiết kế tùy chỉnh. Bạn có thể tạo bất kỳ layout nào!"
          custom={<div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>🚀 Fox eCommerce SDK</div>}
          buttons={[
            { label: 'Đóng', onClick: () => setShowDialog(false), style: 'primary' }
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default DialogCustomScreen;
