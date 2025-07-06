#!/usr/bin/env node

import { exec, execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  files: {
    tokens: 'tokens.json',
    tailwind: 'tailwind.config.js',
    css: 'src/styles/tokens.css',
    cache: '.tokens-sync-cache.json'
  },
  git: {
    timeout: 30000, // 30 seconds
    autoCommit: true,
    autoPush: false, // Set to true if you want automatic pushes
    commitMessage: (timestamp) => `🎨 Auto-sync design tokens - ${timestamp}`,
    filesToAdd: ['tokens.json', 'tailwind.config.js', 'src/styles/tokens.css']
  },
  performance: {
    enableChangeDetection: true,
    enableBatching: true
  }
};

// Enhanced logging system
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  debug: (msg) => process.env.DEBUG && console.log(`🐛 ${msg}`),
  time: (label) => console.time(`⏱️  ${label}`),
  timeEnd: (label) => console.timeEnd(`⏱️  ${label}`)
};

/**
 * Execute command with timeout and better error handling
 */
function execWithTimeout(command, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || CONFIG.git.timeout;
    const execOptions = {
      cwd: process.cwd(),
      encoding: 'utf8',
      ...options
    };

    logger.debug(`Executing: ${command}`);
    
    const child = exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        logger.debug(`Command failed: ${command}`);
        logger.debug(`Error: ${error.message}`);
        logger.debug(`Stderr: ${stderr}`);
        reject(new Error(`Command failed: ${error.message}\nStderr: ${stderr}`));
      } else {
        logger.debug(`Command succeeded: ${command}`);
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
    }, timeout);
    
    // Clear timeout when command completes
    child.on('exit', () => clearTimeout(timeoutId));
  });
}

/**
 * Get file hash for change detection
 */
function getFileHash(filePath) {
  try {
    if (!existsSync(filePath)) {
      return null;
    }
    const content = readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    logger.debug(`Failed to get hash for ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Load cache for change detection
 */
function loadCache() {
  try {
    if (existsSync(CONFIG.files.cache)) {
      const cache = JSON.parse(readFileSync(CONFIG.files.cache, 'utf8'));
      return cache;
    }
  } catch (error) {
    logger.debug(`Cache load failed: ${error.message}`);
  }
  return {
    hashes: {},
    lastSync: null,
    syncCount: 0
  };
}

/**
 * Save cache
 */
function saveCache(cache) {
  try {
    writeFileSync(CONFIG.files.cache, JSON.stringify(cache, null, 2));
  } catch (error) {
    logger.debug(`Cache save failed: ${error.message}`);
  }
}

/**
 * Check if we're in a git repository
 */
async function isGitRepository() {
  try {
    await execWithTimeout('git rev-parse --git-dir', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check git repository status
 */
async function getGitStatus() {
  try {
    const { stdout } = await execWithTimeout('git status --porcelain');
    return {
      hasChanges: stdout.length > 0,
      changes: stdout.split('\n').filter(line => line.trim()),
      isClean: stdout.length === 0
    };
  } catch (error) {
    throw new Error(`Failed to get git status: ${error.message}`);
  }
}

/**
 * Get current git branch
 */
async function getCurrentBranch() {
  try {
    const { stdout } = await execWithTimeout('git branch --show-current');
    return stdout || 'main';
  } catch (error) {
    logger.debug(`Failed to get current branch: ${error.message}`);
    return 'main';
  }
}

/**
 * Check if file has specific changes we care about
 */
function hasRelevantChanges(cache, filesToCheck) {
  const currentHashes = {};
  let hasChanges = false;
  
  for (const file of filesToCheck) {
    const currentHash = getFileHash(file);
    const previousHash = cache.hashes[file];
    
    currentHashes[file] = currentHash;
    
    if (currentHash && currentHash !== previousHash) {
      hasChanges = true;
      logger.debug(`Change detected in ${file}`);
    }
  }
  
  return { hasChanges, currentHashes };
}

/**
 * Add files to git with validation
 */
async function addFilesToGit(files) {
  const existingFiles = files.filter(file => existsSync(file));
  
  if (existingFiles.length === 0) {
    throw new Error('No files exist to add to git');
  }
  
  if (existingFiles.length !== files.length) {
    const missingFiles = files.filter(file => !existsSync(file));
    logger.warn(`Some files don't exist: ${missingFiles.join(', ')}`);
  }
  
  const fileList = existingFiles.join(' ');
  logger.debug(`Adding files to git: ${fileList}`);
  
  await execWithTimeout(`git add ${fileList}`);
  
  return existingFiles;
}

/**
 * Create git commit with enhanced message
 */
async function createCommit(addedFiles, tokenCounts) {
  const timestamp = new Date().toISOString();
  const branch = await getCurrentBranch();
  
  let commitMessage = CONFIG.git.commitMessage(timestamp);
  
  // Add more details to commit message
  if (tokenCounts) {
    const details = Object.entries(tokenCounts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');
    
    if (details) {
      commitMessage += `\n\nUpdated: ${details}`;
    }
  }
  
  commitMessage += `\nFiles: ${addedFiles.join(', ')}`;
  commitMessage += `\nBranch: ${branch}`;
  
  logger.debug(`Creating commit with message: ${commitMessage}`);
  
  await execWithTimeout(`git commit -m "${commitMessage}"`);
  
  return { commitMessage, branch };
}

/**
 * Push changes to remote (if enabled)
 */
async function pushChanges(branch) {
  if (!CONFIG.git.autoPush) {
    logger.info('Auto-push is disabled, skipping push to remote');
    return false;
  }
  
  try {
    logger.info(`Pushing changes to origin/${branch}...`);
    await execWithTimeout(`git push origin ${branch}`);
    logger.success('Changes pushed to remote');
    return true;
  } catch (error) {
    logger.warn(`Failed to push to remote: ${error.message}`);
    logger.info('You may need to push manually later');
    return false;
  }
}

/**
 * Run tokens update with validation
 */
async function runTokensUpdate() {
  logger.time('Token update');
  
  try {
    // Use the optimized update script
    const { stdout, stderr } = await execWithTimeout('npm run tokens:update');
    
    if (stderr && !stderr.includes('deprecated')) {
      logger.warn(`Token update warnings: ${stderr}`);
    }
    
    logger.debug(`Token update output: ${stdout}`);
    logger.success('Tokens updated successfully');
    
    // Try to extract token counts from output (if the update script provides them)
    const tokenCounts = {};
    const countMatches = stdout.match(/(\d+)\s+(\w+)\s+tokens/g);
    if (countMatches) {
      countMatches.forEach(match => {
        const [, count, type] = match.match(/(\d+)\s+(\w+)\s+tokens/);
        tokenCounts[type] = parseInt(count);
      });
    }
    
    logger.timeEnd('Token update');
    return { success: true, tokenCounts };
    
  } catch (error) {
    logger.timeEnd('Token update');
    throw new Error(`Token update failed: ${error.message}`);
  }
}

/**
 * Main auto-sync function with comprehensive error handling
 */
async function autoSyncTokens(options = {}) {
  const startTime = performance.now();
  logger.info('🔄 Starting auto-sync design tokens...');
  
  try {
    // Check if tokens.json exists
    if (!existsSync(CONFIG.files.tokens)) {
      throw new Error(`${CONFIG.files.tokens} not found in current directory`);
    }
    
    // Load cache and check for changes
    const cache = loadCache();
    
    if (CONFIG.performance.enableChangeDetection && !options.force) {
      const { hasChanges, currentHashes } = hasRelevantChanges(cache, [CONFIG.files.tokens]);
      
      if (!hasChanges) {
        logger.info('No changes detected in tokens.json, skipping sync');
        return { 
          synced: false, 
          reason: 'no-changes',
          duration: performance.now() - startTime
        };
      }
      
      // Update cache with current hashes
      cache.hashes = { ...cache.hashes, ...currentHashes };
    }
    
    // Validate tokens file
    logger.info('📖 Loading and validating tokens.json...');
    try {
      const tokens = JSON.parse(readFileSync(CONFIG.files.tokens, 'utf8'));
      logger.success(`Loaded tokens with ${Object.keys(tokens).length} categories`);
    } catch (parseError) {
      throw new Error(`Invalid JSON in ${CONFIG.files.tokens}: ${parseError.message}`);
    }
    
    // Run token update
    logger.info('🔄 Running token update...');
    const updateResult = await runTokensUpdate();
    
    // Check if we're in a git repository
    if (!(await isGitRepository())) {
      logger.info('Not in a git repository, skipping git operations');
      const duration = performance.now() - startTime;
      logger.success(`Token sync completed in ${duration.toFixed(2)}ms (no git)`);
      
      // Update cache
      cache.lastSync = new Date().toISOString();
      cache.syncCount = (cache.syncCount || 0) + 1;
      saveCache(cache);
      
      return { 
        synced: true, 
        gitOperations: false, 
        tokenCounts: updateResult.tokenCounts,
        duration
      };
    }
    
    // Git operations
    if (CONFIG.git.autoCommit) {
      logger.info('🔍 Checking for git changes...');
      const gitStatus = await getGitStatus();
      
      if (gitStatus.isClean) {
        logger.info('No git changes detected');
      } else {
        logger.info(`Found ${gitStatus.changes.length} changed files`);
        
        // Add files to git
        const addedFiles = await addFilesToGit(CONFIG.git.filesToAdd);
        logger.success(`Added ${addedFiles.length} files to git`);
        
        // Create commit
        const { commitMessage, branch } = await createCommit(addedFiles, updateResult.tokenCounts);
        logger.success(`Created commit on branch: ${branch}`);
        
        // Push changes (if enabled)
        const pushed = await pushChanges(branch);
        
        // Update cache
        cache.lastSync = new Date().toISOString();
        cache.syncCount = (cache.syncCount || 0) + 1;
        cache.lastCommit = commitMessage;
        cache.lastBranch = branch;
        saveCache(cache);
        
        const duration = performance.now() - startTime;
        logger.success(`🎉 Token sync complete! (${duration.toFixed(2)}ms)`);
        
        return {
          synced: true,
          gitOperations: true,
          committed: true,
          pushed,
          tokenCounts: updateResult.tokenCounts,
          commitMessage,
          branch,
          addedFiles,
          duration
        };
      }
    }
    
    // Update cache even if no git operations
    cache.lastSync = new Date().toISOString();
    cache.syncCount = (cache.syncCount || 0) + 1;
    saveCache(cache);
    
    const duration = performance.now() - startTime;
    logger.success(`Token sync completed in ${duration.toFixed(2)}ms`);
    
    return {
      synced: true,
      gitOperations: CONFIG.git.autoCommit,
      committed: false,
      tokenCounts: updateResult.tokenCounts,
      duration
    };
    
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(`Token sync failed after ${duration.toFixed(2)}ms:`);
    logger.error(`  ${error.message}`);
    
    if (options.throwOnError) {
      throw error;
    }
    
    process.exit(1);
  }
}

/**
 * Validate environment and dependencies
 */
async function validateEnvironment() {
  const checks = [
    {
      name: 'tokens.json exists',
      check: () => existsSync(CONFIG.files.tokens),
      required: true
    },
    {
      name: 'npm available',
      check: async () => {
        try {
          await execWithTimeout('npm --version', { timeout: 5000 });
          return true;
        } catch {
          return false;
        }
      },
      required: true
    },
    {
      name: 'git available',
      check: async () => {
        try {
          await execWithTimeout('git --version', { timeout: 5000 });
          return true;
        } catch {
          return false;
        }
      },
      required: false
    },
    {
      name: 'git repository',
      check: () => isGitRepository(),
      required: false
    }
  ];
  
  logger.info('🔍 Validating environment...');
  
  for (const { name, check, required } of checks) {
    try {
      const result = await check();
      if (result) {
        logger.success(`✅ ${name}`);
      } else {
        if (required) {
          throw new Error(`❌ ${name} - REQUIRED`);
        } else {
          logger.warn(`⚠️  ${name} - optional`);
        }
      }
    } catch (error) {
      if (required) {
        throw error;
      } else {
        logger.warn(`⚠️  ${name} - check failed: ${error.message}`);
      }
    }
  }
}

/**
 * Show sync status and statistics
 */
function showSyncStatus() {
  const cache = loadCache();
  
  logger.info('📊 Sync Status:');
  logger.info(`  Last sync: ${cache.lastSync || 'Never'}`);
  logger.info(`  Total syncs: ${cache.syncCount || 0}`);
  
  if (cache.lastCommit) {
    logger.info(`  Last commit: ${cache.lastCommit.split('\n')[0]}`);
  }
  
  if (cache.lastBranch) {
    logger.info(`  Last branch: ${cache.lastBranch}`);
  }
  
  // Show file hashes for debugging
  if (process.env.DEBUG && cache.hashes) {
    logger.debug('File hashes:');
    Object.entries(cache.hashes).forEach(([file, hash]) => {
      logger.debug(`  ${file}: ${hash?.slice(0, 8)}...`);
    });
  }
}

// Enhanced CLI handling
const args = process.argv.slice(2);
const command = args[0];
const options = {
  force: args.includes('--force'),
  verbose: args.includes('--verbose'),
  throwOnError: args.includes('--throw'),
  skipGit: args.includes('--skip-git'),
  dryRun: args.includes('--dry-run')
};

if (options.verbose) {
  process.env.DEBUG = 'true';
}

if (options.skipGit) {
  CONFIG.git.autoCommit = false;
}

// Handle different commands
switch (command) {
  case 'sync':
  case undefined:
    if (options.dryRun) {
      logger.info('🏃‍♂️ Dry run mode - no actual changes will be made');
      await validateEnvironment();
      logger.info('Environment validation passed - ready for sync');
    } else {
      await autoSyncTokens(options);
    }
    break;
    
  case 'status':
    showSyncStatus();
    break;
    
  case 'validate':
    await validateEnvironment();
    logger.success('Environment validation completed');
    break;
    
  case 'clean':
    if (existsSync(CONFIG.files.cache)) {
      const cache = loadCache();
      logger.info(`Removing cache (${cache.syncCount || 0} syncs recorded)`);
      fs.unlinkSync(CONFIG.files.cache);
      logger.success('Cache cleaned');
    } else {
      logger.info('No cache file found');
    }
    break;
    
  default:
    console.log('Usage:');
    console.log('  node scripts/tokens-auto-sync.js [command] [options]');
    console.log('');
    console.log('Commands:');
    console.log('  sync      Auto-sync design tokens (default)');
    console.log('  status    Show sync status and statistics');
    console.log('  validate  Validate environment and dependencies');
    console.log('  clean     Clean cache and temporary files');
    console.log('');
    console.log('Options:');
    console.log('  --force       Force sync even if no changes detected');
    console.log('  --verbose     Enable debug logging');
    console.log('  --throw       Throw errors instead of exiting');
    console.log('  --skip-git    Skip git operations');
    console.log('  --dry-run     Validate environment without making changes');
    console.log('');
    console.log('Configuration:');
    console.log(`  Auto-commit: ${CONFIG.git.autoCommit}`);
    console.log(`  Auto-push: ${CONFIG.git.autoPush}`);
    console.log(`  Timeout: ${CONFIG.git.timeout}ms`);
    process.exit(1);
} 