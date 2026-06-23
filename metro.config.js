const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    project: {
      ios: {},
      android: {},
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'ts' && ext !== 'tsx'),
      sourceExts: [...sourceExts, 'ts', 'tsx'],
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
  };
})();
