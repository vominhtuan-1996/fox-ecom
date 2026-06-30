#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

console.log('📦 Building assets...');

const dist = path.join(__dirname, '../dist');
const src = path.join(__dirname, '../src');

// 1. Copy SVG icons
console.log('  ✓ Copying SVG icons...');
cp.execSync(`cp -r ${src}/assets/icons ${dist}/assets/`, { stdio: 'ignore' });

// 2. Copy JSON files (animations, config)
console.log('  ✓ Copying JSON assets...');
const jsonDirs = [
  'assets/animations',
  'assets/config'
];

jsonDirs.forEach(dir => {
  const srcDir = path.join(src, dir);
  const destDir = path.join(dist, dir);
  
  if (fs.existsSync(srcDir)) {
    cp.execSync(`cp -r ${srcDir}/*.json ${destDir}/ 2>/dev/null || true`, { stdio: 'ignore' });
  }
});

// 3. Copy .js and .jsx files that aren't compiled (like NotificationService.js)
console.log('  ✓ Copying JS/JSX files...');
function copyJsFiles(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return;
  
  const files = fs.readdirSync(srcPath);
  files.forEach(file => {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);
    const stat = fs.statSync(srcFile);
    
    if (stat.isDirectory()) {
      if (!fs.existsSync(destFile)) fs.mkdirSync(destFile, { recursive: true });
      copyJsFiles(srcFile, destFile);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && !file.endsWith('.d.ts')) {
      // Copy JS/JSX files that might not be compiled
      try {
        const content = fs.readFileSync(srcFile, 'utf8');
        fs.writeFileSync(destFile, content);
      } catch (e) {
        // ignore
      }
    }
  });
}

copyJsFiles(src, dist);

// 4. Ensure dist/assets exists
console.log('  ✓ Ensuring asset directories...');
['dist/assets', 'dist/assets/icons', 'dist/assets/icons/v2', 'dist/assets/animations', 'dist/assets/config'].forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('✅ Assets built successfully');
