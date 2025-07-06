#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const TOKENS_FILE = 'tokens.json';
const TAILWIND_CONFIG = 'tailwind.config.js';

console.log('🔄 Auto-syncing design tokens...');

try {
  // Check if tokens.json exists
  if (!existsSync(TOKENS_FILE)) {
    console.error('❌ tokens.json not found');
    process.exit(1);
  }

  // Read current tokens
  const tokens = JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
  console.log('📖 Loaded tokens.json');

  // Update Tailwind config and CSS
  execSync('npm run tokens:update', { stdio: 'inherit' });
  console.log('✅ Updated Tailwind config and CSS');

  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    // Check for changes
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (gitStatus.trim()) {
      console.log('📝 Found changes, committing...');
      
      // Add changed files
      execSync('git add tokens.json tailwind.config.js src/styles/tokens.css', { stdio: 'inherit' });
      
      // Commit changes
      const commitMessage = `🎨 Auto-sync design tokens - ${new Date().toISOString()}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      console.log('✅ Changes committed locally');
      
      // Push to origin (optional - uncomment if you want auto-push)
      // execSync('git push origin HEAD', { stdio: 'inherit' });
      // console.log('🚀 Changes pushed to remote');
      
    } else {
      console.log('ℹ️  No changes detected');
    }
    
  } catch (error) {
    console.log('ℹ️  Not in a git repository, skipping git operations');
  }

  console.log('🎉 Token sync complete!');
  
} catch (error) {
  console.error('❌ Error during token sync:', error.message);
  process.exit(1);
} 