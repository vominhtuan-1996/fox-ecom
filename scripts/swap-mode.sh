#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SDK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLE_DIR="$SDK_ROOT/example"
SDK_PACKAGE="$SDK_ROOT/package.json"
METRO_CONFIG="$EXAMPLE_DIR/metro.config.js"
EXAMPLE_PACKAGE="$EXAMPLE_DIR/package.json"

echo -e "${BLUE}=== SDK Mode Switcher ===${NC}\n"

# Check current mode
check_mode() {
  if grep -q '"main": "src/index.ts"' "$SDK_PACKAGE" 2>/dev/null || grep -q '"_comment"' "$SDK_PACKAGE" 2>/dev/null; then
    echo "dev"
  else
    echo "prod"
  fi
}

current_mode=$(check_mode)
echo -e "${YELLOW}Current mode: ${GREEN}$current_mode${NC}\n"

# Dev mode setup
setup_dev_mode() {
  echo -e "${BLUE}Switching to DEV mode...${NC}\n"

  # Update SDK package.json - remove main field
  echo "1. Updating SDK package.json..."
  sed -i '' '/"main"/d' "$SDK_PACKAGE"
  sed -i '' '/"types"/d' "$SDK_PACKAGE"

  # Add comment
  sed -i '' '/"description"/a\
  \ \ "_comment": "Dev mode - main field disabled, Metro uses watchFolders",
' "$SDK_PACKAGE"

  # Update metro.config.js for dev
  echo "2. Updating metro.config.js..."
  cat > "$METRO_CONFIG" << 'EOF'
const path = require('path');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '..');

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
EOF

  # Remove fox-ecom from example package.json dependencies
  echo "3. Updating example/package.json..."
  cd "$EXAMPLE_DIR"
  npm uninstall fox-ecom 2>/dev/null || true

  echo -e "\n${GREEN}✅ DEV mode ready!${NC}"
  echo -e "${YELLOW}Next steps:${NC}"
  echo "  1. npm run start -- --reset-cache  (in example/)"
  echo "  2. npm run ios                     (in example/)"
}

# Prod mode setup
setup_prod_mode() {
  echo -e "${BLUE}Switching to PROD mode...${NC}\n"

  # Build SDK first
  echo "1. Building SDK..."
  cd "$SDK_ROOT"
  npm run build 2>&1 | grep -E "tgz|dist|error" || true

  # Update SDK package.json - add main field
  echo "2. Updating SDK package.json..."
  sed -i '' '/"_comment"/d' "$SDK_PACKAGE"

  # Add main and types after description
  sed -i '' '/"description"/a\
  \ \ "main": "dist/index.js",\
  \ \ "types": "dist/index.d.ts",
' "$SDK_PACKAGE"

  # Update metro.config.js for prod
  echo "3. Updating metro.config.js..."
  cat > "$METRO_CONFIG" << 'EOF'
const path = require('path');

const projectRoot = __dirname;

module.exports = {
  projectRoot,
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
    extraNodeModules: {
      '@': path.resolve(projectRoot, 'node_modules/fox-ecom/dist'),
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
EOF

  # Install fox-ecom tgz
  echo "4. Installing fox-ecom from tgz..."
  cd "$EXAMPLE_DIR"
  if [ -f "$SDK_ROOT/fox-ecom-0.1.0.tgz" ]; then
    npm install "$SDK_ROOT/fox-ecom-0.1.0.tgz" --force 2>&1 | tail -3
  else
    echo -e "${RED}❌ Error: fox-ecom-0.1.0.tgz not found${NC}"
    echo "   Run 'npm run build' in SDK root first"
    exit 1
  fi

  echo -e "\n${GREEN}✅ PROD mode ready!${NC}"
  echo -e "${YELLOW}Next steps:${NC}"
  echo "  1. npm run start -- --reset-cache  (in example/)"
  echo "  2. npm run ios                     (in example/)"
}

# Main logic
if [ "$1" == "dev" ]; then
  if [ "$current_mode" == "dev" ]; then
    echo -e "${YELLOW}Already in DEV mode${NC}"
  else
    setup_dev_mode
  fi
elif [ "$1" == "prod" ]; then
  if [ "$current_mode" == "prod" ]; then
    echo -e "${YELLOW}Already in PROD mode${NC}"
  else
    setup_prod_mode
  fi
elif [ "$1" == "check" ] || [ -z "$1" ]; then
  echo -e "${YELLOW}Usage:${NC}"
  echo "  ./scripts/swap-mode.sh dev   # Switch to development mode"
  echo "  ./scripts/swap-mode.sh prod  # Switch to production mode"
  echo "  ./scripts/swap-mode.sh check # Show current mode"
  echo ""
  echo -e "${YELLOW}Mode details:${NC}"
  echo "  DEV:  Uses SDK source directly (src/) - Hot reload works"
  echo "  PROD: Uses compiled SDK from tgz - Tests production flow"
else
  echo -e "${RED}❌ Unknown mode: $1${NC}"
  echo "   Use: dev, prod, or check"
  exit 1
fi
