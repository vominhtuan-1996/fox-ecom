const { getDefaultConfig } = require('metro-config');
const path = require('path');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.projectRoot = projectRoot;
config.watchFolders = [projectRoot, sdkRoot];

// Resolve from both example and SDK
config.resolver.extraNodeModules = {
  'fox-ecom': path.resolve(sdkRoot, 'src'),
};

config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx'];
config.transformer.babelTransformerPath = require.resolve(
  'metro-react-native-babel-transformer',
);

module.exports = config;
