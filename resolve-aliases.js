#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Resolve @/ path aliases to relative paths in compiled dist/
function resolveAliasesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Get the file's directory to calculate relative paths
  const fileDir = path.dirname(filePath);
  const distDir = path.resolve(__dirname, 'dist');

  // Find all @/ requires and imports
  const aliasRegex = /(['"])@\/([^'"]+)\1/g;
  
  content = content.replace(aliasRegex, (match, quote, aliasPath) => {
    // Map @/xxx to dist/xxx
    const targetPath = path.join(distDir, aliasPath + '.js');
    
    // Calculate relative path from current file to target
    let relativePath = path.relative(fileDir, targetPath);
    
    // Normalize to use forward slashes and remove .js extension
    relativePath = relativePath.replace(/\\/g, '/').replace(/\.js$/, '');
    
    // Ensure it starts with ./ or ../
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    console.log(`  ${path.relative(distDir, filePath)}: @/${aliasPath} → ${relativePath}`);
    modified = true;
    return `${quote}${relativePath}${quote}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

// Recursively process all .js files in dist/
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      resolveAliasesInFile(fullPath);
    }
  });
}

console.log('🔧 Resolving @/ aliases in dist/...');
processDirectory(path.join(__dirname, 'dist'));
console.log('✅ Done');
