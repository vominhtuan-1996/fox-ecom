/**
 * Fox eCommerce SDK - Example App
 * Entry point with FoxComAuthen initialization
 */

const { AppRegistry } = require('react-native');
const React = require('react');

/**
 * Initialize FoxComAuthen
 */
async function initializeApp() {
  console.log('🚀 Initializing Fox eCommerce SDK...');

  try {
    // Import SDK
    const { FoxComAuthen } = require('fox-ecom');
    const App = require('./src/app').App;

    // Create and initialize FoxComAuthen
    const fox = new FoxComAuthen({
      token: 'demo-token-for-testing',
      environment: 'development',
      routing: {
        home: null,
        products: null,
        cart: null,
        profile: null,
        login: null,
      },
      extra: {
        appName: 'Fox eCommerce Example',
        version: '0.1.0',
        platform: 'react-native',
      },
      enableLogging: true,
    });

    // Initialize SDK
    await fox.initialize();
    console.log('✅ SDK initialized successfully!');

    // Render app
    AppRegistry.registerComponent('FoxEcomExample', () => App);
  } catch (error) {
    console.error('❌ Failed to initialize SDK:', error);

    // Fallback - render without SDK
    const App = require('./src/app').App;
    AppRegistry.registerComponent('FoxEcomExample', () => App);
  }
}

initializeApp();
