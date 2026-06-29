const path = require('path');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '..');
const src = (rel) => path.resolve(sdkRoot, 'src', rel);

module.exports = {
  projectRoot,
  watchFolders: [sdkRoot],
  resolver: {
    platforms: ['ios', 'android'],
    sourceExts: ['svg', 'ts', 'tsx', 'js', 'jsx', 'json'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf', 'otf', 'mp4', 'mp3', 'wav', 'pdf'],
    extraNodeModules: {
      // SDK alias @ → src/
      '@':                         src(''),
      '@/di':                      src('di'),
      '@/common':                  src('common'),
      '@/config':                  src('config'),
      '@/data':                    src('data'),
      '@/domain':                  src('domain'),
      '@/modules':                 src('modules'),
      '@/presentation':            src('presentation'),
      '@/assets':                  src('assets'),
      '@/types':                   src('types'),
      '@/sdk':                     src('sdk'),
      // SDK from node_modules (npm package) — comment for dev mode
      // 'fox-ecom':                  src(''),
      'react-native':              path.resolve(projectRoot, 'node_modules/react-native'),
      'react':                     path.resolve(projectRoot, 'node_modules/react'),
      '@react-native-async-storage/async-storage': path.resolve(projectRoot, 'node_modules/@react-native-async-storage/async-storage'),
      'react-native-svg':          path.resolve(projectRoot, 'node_modules/react-native-svg'),
    },
    blacklistRE: new RegExp(
      '(' +
      path.resolve(sdkRoot, 'node_modules/react-native').replace(/\//g, '\\/') + '\\/.*' +
      '|' +
      path.resolve(sdkRoot, 'node_modules/react').replace(/\//g, '\\/') + '\\/.*' +
      '|' +
      'node_modules\\/react-native\\/Libraries\\/Animated\\/(__tests__|Example)' +
      ')'
    ),
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
