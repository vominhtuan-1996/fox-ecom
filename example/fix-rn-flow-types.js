#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Fix all RN Flow type component declarations
const rnLibsPath = 'node_modules/react-native/Libraries';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix: const Foo: component(...) = ...
    if (content.includes('component(')) {
      content = content.replace(/const\s+(\w+):\s*component\s*\([^)]*\)\s*=/g, 'const $1 =');
      modified = true;
    }

    // Fix: as $FlowFixMe
    if (content.includes('as $FlowFixMe')) {
      content = content.replace(/\s*as\s+\$FlowFixMe/g, '');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ ${path.relative(__dirname, filePath)}`);
    }
  } catch (e) {
    // Skip errors
  }
}

// Scan all JS files in Libraries
function scanDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!file.includes('__tests__')) {
          scanDir(fullPath);
        }
      } else if (file.endsWith('.js')) {
        fixFile(fullPath);
      }
    });
  } catch (e) {
    // Skip errors
  }
}

console.log('Fixing React Native Flow types...');
scanDir(rnLibsPath);
console.log('✅ Done');
