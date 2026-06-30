const path = require('path');
const { getDefaultConfig } = require('metro-config');

const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, '..');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    projectRoot,
    // Don't watch root dir - use fox-ecom from node_modules only
    resolver: {
      platforms: ['ios', 'android'],
      sourceExts: [...sourceExts, 'svg'],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
  };
})();
