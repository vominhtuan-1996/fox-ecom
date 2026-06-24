import React from 'react';
import '../styles/Dialog.css';

const Dialog = ({ title, message, custom, input, buttons, onClose }) => {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="dialog-title">{title}</h2>}
        {message && <p className="dialog-message">{message}</p>}
        
        {input && (
          <input
            type="text"
            className="dialog-input"
            value={input.value}
            onChange={(e) => input.onChange(e.target.value)}
            placeholder={input.placeholder}
            autoFocus
          />
        )}
        
        {custom && <div className="dialog-custom">{custom}</div>}
        
        {buttons && (
          <div className="dialog-buttons">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                className={`dialog-button ${btn.style || 'default'}`}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
