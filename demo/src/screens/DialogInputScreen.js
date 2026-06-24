import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import '../styles/Screen.css';

const DialogInputScreen = ({ onBack }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  return (
    <div className="screen-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1 className="screen-title">Input Dialog Test</h1>
      <button className="test-button" onClick={() => { setShowDialog(true); setInputValue(''); }}>Show Input</button>
      <p className="description">Tap above to test input dialog</p>
      {result && <p style={{ marginTop: '16px', color: '#10b981' }}>{result}</p>}
      
      {showDialog && (
        <Dialog
          title="📝 Nhập dữ liệu"
          message="Vui lòng nhập tên của bạn:"
          input={{ value: inputValue, onChange: setInputValue, placeholder: 'Nhập tên...' }}
          buttons={[
            { label: 'Huỷ', onClick: () => { setResult('Bạn đã huỷ ❌'); setShowDialog(false); } },
            { label: 'Gửi', onClick: () => { setResult(`Bạn nhập: ${inputValue || 'không có'} ✅`); setShowDialog(false); }, style: 'primary' }
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default DialogInputScreen;
