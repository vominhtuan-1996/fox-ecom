import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import '../styles/Screen.css';

const DialogConfirmScreen = ({ onBack }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState('');

  return (
    <div className="screen-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1 className="screen-title">Confirm Dialog Test</h1>
      <button className="test-button" onClick={() => setShowDialog(true)}>Show Confirm</button>
      <p className="description">Tap above to test confirm dialog</p>
      {result && <p style={{ marginTop: '16px', color: '#10b981' }}>{result}</p>}
      
      {showDialog && (
        <Dialog
          title="❓ Xác nhận"
          message="Bạn có chắc chắn muốn thực hiện hành động này?"
          buttons={[
            { label: 'Huỷ', onClick: () => { setResult('Bạn đã huỷ ❌'); setShowDialog(false); } },
            { label: 'Xác nhận', onClick: () => { setResult('Bạn đã xác nhận ✅'); setShowDialog(false); }, style: 'primary' }
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default DialogConfirmScreen;
