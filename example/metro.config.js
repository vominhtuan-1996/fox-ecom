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
    watchFolders: [rootDir],
    resolver: {
      platforms: ['ios', 'android'],
      sourceExts: [...sourceExts, 'svg'],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      // SDK aliases for development (src/ not dist/)
      extraNodeModules: {
        '@': path.join(rootDir, 'src'),
        '@/di': path.join(rootDir, 'src/di'),
        '@/common': path.join(rootDir, 'src/common'),
        '@/config': path.join(rootDir, 'src/config'),
        '@/data': path.join(rootDir, 'src/data'),
        '@/domain': path.join(rootDir, 'src/domain'),
        '@/modules': path.join(rootDir, 'src/modules'),
        '@/presentation': path.join(rootDir, 'src/presentation'),
        '@/assets': path.join(rootDir, 'src/assets'),
        '@/types': path.join(rootDir, 'src/types'),
      },
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
  };
})();
