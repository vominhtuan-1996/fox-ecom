const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

module.exports = {
  projectRoot,
  watchFolders: [
    projectRoot,
    path.resolve(monorepoRoot, 'src'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx'],
    extraNodeModules: {
      '@fox-ecom': path.resolve(monorepoRoot, 'src'),
    },
  },
};
