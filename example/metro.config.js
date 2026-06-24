const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '..');

// Create module map for resolution
const moduleMap = {};
moduleMap['fox-ecom'] = path.resolve(sdkRoot, 'src/index.ts');
moduleMap['@'] = path.resolve(sdkRoot, 'src');

module.exports = {
  projectRoot,
  watchFolders: [sdkRoot],
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
    extraNodeModules: {
      'fox-ecom': path.resolve(sdkRoot, 'src'),
      '@': path.resolve(sdkRoot, 'src'),
    },
    blacklistRE: /node_modules[/\\]react-native[/\\]Libraries[/\\]Animated[/\\](__tests__|Example)/,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
