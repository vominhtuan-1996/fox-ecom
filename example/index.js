if (typeof window === 'undefined') {
  global.window = global;
}

// Bắt crash toàn cục để debug màn trắng
const ErrorUtils = global.ErrorUtils;
if (ErrorUtils) {
  const prevHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('🔴 GLOBAL ERROR:', error?.message, error?.stack);
    if (prevHandler) prevHandler(error, isFatal);
  });
}

const { AppRegistry } = require('react-native');

let envConfig;
try {
  envConfig = require('../src/common/config/env.config').envConfig;
} catch(e) {
  console.error('🔴 envConfig load failed:', e.message);
}

// PMS API base URL — đổi 'staging' | 'production' để switch env
const ENV = 'staging'; // ponytail: hardcoded, đổi khi cần CI/CD env var

const API_URLS = {
  development: 'https://apis-dev.fpt.vn',
  staging: 'https://apis-stag.fpt.vn',
  production: 'https://apis.fpt.vn',
};

if (envConfig) {
  envConfig.set('apiBaseUrl', API_URLS[ENV]);
  envConfig.set('apiTimeout', 15000);
  envConfig.set('environment', ENV);
}

console.log('🚀 Initializing Fox eCommerce Example App...');

let App;
try {
  App = require('./App').default;
  console.log('✅ App loaded!');
} catch(e) {
  console.error('🔴 App load failed:', e.message, e.stack);
  const { View, Text } = require('react-native');
  App = () => require('react').createElement(View, {style:{flex:1,justifyContent:'center',alignItems:'center',padding:20}},
    require('react').createElement(Text, {style:{color:'red',fontSize:14}}, '❌ ' + e.message)
  );
}

AppRegistry.registerComponent('FoxEcomExample', () => App);
