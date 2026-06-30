const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  projectRoot: __dirname,
  // Use SDK package from node_modules only
};

module.exports = mergeConfig(defaultConfig, config);
