import React from 'react';
import '../styles/MenuScreen.css';

const MenuScreen = ({ onSelectTest }) => {
  const menuItems = [
    { id: '1', name: '✅ Home', screen: 'home' },
    { id: '2', name: '📱 Dialog - Alert', screen: 'dialog-alert' },
    { id: '3', name: '❓ Dialog - Confirm', screen: 'dialog-confirm' },
    { id: '4', name: '📝 Dialog - Input', screen: 'dialog-input' },
    { id: '5', name: '🎨 Dialog - Custom', screen: 'dialog-custom' },
    { id: '6', name: '🔔 Toast Notification', screen: 'toast' },
  ];

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">🦊 Fox eCommerce</h1>
        <p className="menu-subtitle">Component Testing Menu</p>
      </div>

      <div className="menu-list">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="menu-item"
            onClick={() => onSelectTest(item.screen)}
          >
            <span className="menu-text">{item.name}</span>
            <span className="menu-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuScreen;
