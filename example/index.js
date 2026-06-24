const { AppRegistry } = require('react-native');

console.log('🚀 Initializing Fox eCommerce Example App...');

const App = require('./App').default;
console.log('✅ App loaded!');

AppRegistry.registerComponent('FoxEcomExample', () => App);
