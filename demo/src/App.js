import React, { useState } from 'react';
import './App.css';
import MenuScreen from './screens/MenuScreen';
import HomeScreen from './screens/HomeScreen';
import DialogAlertScreen from './screens/DialogAlertScreen';
import DialogConfirmScreen from './screens/DialogConfirmScreen';
import DialogInputScreen from './screens/DialogInputScreen';
import DialogCustomScreen from './screens/DialogCustomScreen';
import ToastScreen from './screens/ToastScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onBack={() => setCurrentScreen('menu')} />;
      case 'dialog-alert':
        return <DialogAlertScreen onBack={() => setCurrentScreen('menu')} />;
      case 'dialog-confirm':
        return <DialogConfirmScreen onBack={() => setCurrentScreen('menu')} />;
      case 'dialog-input':
        return <DialogInputScreen onBack={() => setCurrentScreen('menu')} />;
      case 'dialog-custom':
        return <DialogCustomScreen onBack={() => setCurrentScreen('menu')} />;
      case 'toast':
        return <ToastScreen onBack={() => setCurrentScreen('menu')} />;
      case 'menu':
      default:
        return <MenuScreen onSelectTest={setCurrentScreen} />;
    }
  };

  return <div className="app">{renderScreen()}</div>;
}

export default App;
