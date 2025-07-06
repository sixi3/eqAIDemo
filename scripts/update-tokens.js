#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  paths: {
    tokens: path.join(__dirname, '../tokens.json'),
    tailwind: path.join(__dirname, '../tailwind.config.js'),
    css: path.join(__dirname, '../src/styles/tokens.css'),
    cache: path.join(__dirname, '../.tokens-cache.json')
  },
  validation: {
    required: ['colors', 'spacing'],
    optional: ['borderRadius', 'typography', 'shadows']
  },
  performance: {
    enableCaching: true,
    enableAtomicWrites: true
  }
};

// Enhanced logging
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  debug: (msg) => process.env.DEBUG && console.log(`🐛 ${msg}`),
  time: (label) => console.time(`⏱️  ${label}`),
  timeEnd: (label) => console.timeEnd(`⏱️  ${label}`)
};

// Cache for resolved token references
const resolvedCache = new Map();
const validationCache = new Map();

/**
 * Get file hash for change detection
 */
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * Load and manage cache
 */
function loadCache() {
  try {
    if (fs.existsSync(CONFIG.paths.cache)) {
      return JSON.parse(fs.readFileSync(CONFIG.paths.cache, 'utf8'));
    }
  } catch (error) {
    logger.debug(`Cache load failed: ${error.message}`);
  }
  return { hashes: {}, lastRun: null };
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CONFIG.paths.cache, JSON.stringify(cache, null, 2));
  } catch (error) {
    logger.debug(`Cache save failed: ${error.message}`);
  }
}

/**
 * Enhanced token validation with detailed error reporting
 */
function validateTokenValue(value, expectedType, path) {
  const cacheKey = `${value}-${expectedType}-${path}`;
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey);
  }

  const errors = [];
  
  switch (expectedType) {
    case 'color':
      if (!/^#[0-9A-Fa-f]{3,8}$|^rgb|^hsl|^[a-zA-Z]+$|^\{.+\}$/.test(value)) {
        errors.push(`Invalid color format at ${path}: ${value}`);
      }
      break;
    case 'dimension':
    case 'spacing':
      if (!/^\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax)$|^\{.+\}$/.test(value)) {
        errors.push(`Invalid dimension format at ${path}: ${value}`);
      }
      break;
    case 'fontWeight':
      if (!/^\d{3}$|^(normal|bold|bolder|lighter)$|^\{.+\}$/.test(value)) {
        errors.push(`Invalid font weight at ${path}: ${value}`);
      }
      break;
    case 'fontFamily':
      // Font families can be complex, allow more flexibility
      if (typeof value !== 'string' || value.length === 0) {
        errors.push(`Invalid font family at ${path}: ${value}`);
      }
      break;
  }

  validationCache.set(cacheKey, errors);
  return errors;
}

/**
 * Enhanced token structure validation
 */
function validateTokens(tokens) {
  logger.time('Token validation');
  const errors = [];
  
  if (!tokens || typeof tokens !== 'object') {
    return ['tokens.json must contain a valid JSON object'];
  }

  // Check required token categories
  for (const category of CONFIG.validation.required) {
    if (!tokens[category]) {
      errors.push(`Missing required token category: ${category}`);
    }
  }

  // Validate each category
  const validators = {
    colors: validateColors,
    spacing: validateSpacing,
    borderRadius: validateBorderRadius,
    typography: validateTypography,
    shadows: validateShadows
  };

  for (const [category, validator] of Object.entries(validators)) {
    if (tokens[category]) {
      try {
        errors.push(...validator(tokens[category], category));
      } catch (error) {
        errors.push(`Error validating ${category}: ${error.message}`);
      }
    }
  }

  logger.timeEnd('Token validation');
  return errors;
}

function validateColors(colors, basePath) {
  const errors = [];
  for (const [colorGroup, shades] of Object.entries(colors)) {
    if (typeof shades !== 'object') {
      errors.push(`Color group ${colorGroup} must be an object`);
      continue;
    }
    
    for (const [shade, tokenData] of Object.entries(shades)) {
      const value = getRawTokenValue(tokenData);
      const type = getTokenType(tokenData);
      const path = `${basePath}.${colorGroup}.${shade}`;
      
      if (!value) {
        errors.push(`Missing value for ${path}`);
      } else {
        errors.push(...validateTokenValue(value, 'color', path));
      }
      
      if (!type || type !== 'color') {
        errors.push(`Invalid or missing type for ${path} (expected 'color')`);
      }
    }
  }
  return errors;
}

function validateSpacing(spacing, basePath) {
  const errors = [];
  for (const [key, tokenData] of Object.entries(spacing)) {
    const value = getRawTokenValue(tokenData);
    const type = getTokenType(tokenData);
    const path = `${basePath}.${key}`;
    
    if (!value) {
      errors.push(`Missing value for ${path}`);
    } else {
      errors.push(...validateTokenValue(value, 'dimension', path));
    }
    
    if (!type || !['dimension', 'spacing'].includes(type)) {
      errors.push(`Invalid type for ${path} (expected 'dimension' or 'spacing')`);
    }
  }
  return errors;
}

function validateBorderRadius(borderRadius, basePath) {
  const errors = [];
  for (const [key, tokenData] of Object.entries(borderRadius)) {
    const value = getRawTokenValue(tokenData);
    const path = `${basePath}.${key}`;
    
    if (!value) {
      errors.push(`Missing value for ${path}`);
    } else {
      errors.push(...validateTokenValue(value, 'dimension', path));
    }
  }
  return errors;
}

function validateTypography(typography, basePath) {
  const errors = [];
  for (const [category, values] of Object.entries(typography)) {
    if (typeof values !== 'object') continue;
    
    for (const [key, tokenData] of Object.entries(values)) {
      const value = getRawTokenValue(tokenData);
      const type = getTokenType(tokenData);
      const path = `${basePath}.${category}.${key}`;
      
      if (!value) {
        errors.push(`Missing value for ${path}`);
      } else {
        switch (category) {
          case 'fontWeight':
            errors.push(...validateTokenValue(value, 'fontWeight', path));
            break;
          case 'fontFamily':
            errors.push(...validateTokenValue(value, 'fontFamily', path));
            break;
          case 'fontSize':
            errors.push(...validateTokenValue(value, 'dimension', path));
            break;
        }
      }
    }
  }
  return errors;
}

function validateShadows(shadows, basePath) {
  const errors = [];
  for (const [key, tokenData] of Object.entries(shadows)) {
    const value = getRawTokenValue(tokenData);
    const path = `${basePath}.${key}`;
    
    if (!value) {
      errors.push(`Missing value for ${path}`);
    }
    // Shadow validation is complex, we'll allow any string for now
  }
  return errors;
}

/**
 * Get raw token value with better type support
 */
function getRawTokenValue(tokenData) {
  return tokenData?.$value ?? tokenData?.value;
}

function getTokenType(tokenData) {
  return tokenData?.$type ?? tokenData?.type;
}

/**
 * Enhanced token reference resolution with caching
 */
function resolveTokenReferences(tokens, value, depth = 0) {
  if (typeof value !== 'string' || !value.includes('{') || depth > 10) {
    return value;
  }

  const cacheKey = `${value}-${depth}`;
  if (CONFIG.performance.enableCaching && resolvedCache.has(cacheKey)) {
    return resolvedCache.get(cacheKey);
  }

  const resolved = value.replace(/\{([^}]+)\}/g, (match, reference) => {
    try {
      if (!reference.includes('.')) {
        // Simple reference like {3xl}
        for (const [category, categoryTokens] of Object.entries(tokens)) {
          if (typeof categoryTokens === 'object' && categoryTokens[reference]) {
            const referencedValue = getRawTokenValue(categoryTokens[reference]);
            return resolveTokenReferences(tokens, referencedValue, depth + 1);
          }
        }
      } else {
        // Dot notation like {borderRadius.3xl}
        const parts = reference.split('.');
        let current = tokens;
        
        for (const part of parts) {
          if (current && typeof current === 'object' && current[part]) {
            current = current[part];
          } else {
            logger.warn(`Token reference ${reference} not found`);
            return match;
          }
        }
        
        if (current && typeof current === 'object') {
          const referencedValue = getRawTokenValue(current);
          return resolveTokenReferences(tokens, referencedValue, depth + 1);
        }
      }
    } catch (error) {
      logger.warn(`Error resolving token reference ${reference}: ${error.message}`);
    }
    
    return match;
  });

  if (CONFIG.performance.enableCaching) {
    resolvedCache.set(cacheKey, resolved);
  }
  return resolved;
}

/**
 * Atomic file write operation
 */
async function atomicWriteFile(filePath, content) {
  if (!CONFIG.performance.enableAtomicWrites) {
    fs.writeFileSync(filePath, content);
    return;
  }

  const tempPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tempPath, content);
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

/**
 * Write file only if content has changed
 */
async function writeFileIfChanged(filePath, newContent) {
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    // File doesn't exist, proceed with write
  }
  
  if (existingContent !== newContent) {
    await atomicWriteFile(filePath, newContent);
    return true;
  }
  return false;
}

/**
 * Modular token processors
 */
const tokenProcessors = {
  colors: (tokens) => {
    const getTokenValue = (tokenData) => {
      const rawValue = getRawTokenValue(tokenData);
      return resolveTokenReferences(tokens, rawValue);
    };

    let css = '\n  /* Colors from tokens.json */';
    for (const [colorGroup, shades] of Object.entries(tokens.colors || {})) {
      for (const [shade, tokenData] of Object.entries(shades)) {
        const varName = `--color-${colorGroup}-${shade}`;
        css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
      }
    }
    return css;
  },

  spacing: (tokens) => {
    const getTokenValue = (tokenData) => {
      const rawValue = getRawTokenValue(tokenData);
      return resolveTokenReferences(tokens, rawValue);
    };

    let css = '\n\n  /* Spacing from tokens.json */';
    for (const [key, tokenData] of Object.entries(tokens.spacing || {})) {
      const varName = `--spacing-${key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
    return css;
  },

  borderRadius: (tokens) => {
    const getTokenValue = (tokenData) => {
      const rawValue = getRawTokenValue(tokenData);
      return resolveTokenReferences(tokens, rawValue);
    };

    let css = '\n\n  /* Border radius from tokens.json */';
    for (const [key, tokenData] of Object.entries(tokens.borderRadius || {})) {
      const varName = `--border-radius-${key === 'default' ? 'DEFAULT' : key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
    return css;
  },

  typography: (tokens) => {
    const getTokenValue = (tokenData) => {
      const rawValue = getRawTokenValue(tokenData);
      return resolveTokenReferences(tokens, rawValue);
    };

    let css = '\n\n  /* Typography from tokens.json */';
    for (const [category, values] of Object.entries(tokens.typography || {})) {
      for (const [key, tokenData] of Object.entries(values)) {
        const varName = `--typography-${category}-${key}`;
        css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
      }
    }
    return css;
  },

  shadows: (tokens) => {
    const getTokenValue = (tokenData) => {
      const rawValue = getRawTokenValue(tokenData);
      return resolveTokenReferences(tokens, rawValue);
    };

    let css = '\n\n  /* Shadows from tokens.json */';
    for (const [key, tokenData] of Object.entries(tokens.shadows || {})) {
      const varName = `--shadow-${key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
    return css;
  }
};

/**
 * Generate CSS custom properties with modular approach
 */
function generateTokensCSS(tokens) {
  logger.time('CSS generation');
  
  const header = `/* Auto-generated CSS Custom Properties from tokens.json */
/* This file is updated automatically by scripts/update-tokens.js */
/* Last updated: ${new Date().toISOString()} */

:root {`;

  const sections = Object.entries(tokenProcessors)
    .filter(([key]) => tokens[key] && Object.keys(tokens[key]).length > 0)
    .map(([key, processor]) => {
      try {
        return processor(tokens);
      } catch (error) {
        logger.warn(`Error processing ${key} tokens: ${error.message}`);
        return '';
      }
    })
    .filter(Boolean);

  const footer = '\n}\n';
  
  logger.timeEnd('CSS generation');
  return header + sections.join('') + footer;
}

/**
 * Enhanced Tailwind config generation
 */
function generateTailwindConfig(tokens) {
  logger.time('Tailwind config generation');
  
  const getTokenValue = (tokenData) => {
    const rawValue = getRawTokenValue(tokenData);
    return resolveTokenReferences(tokens, rawValue);
  };

  const config = {
    colors: {},
    spacing: {},
    borderRadius: {},
    fontFamily: {},
    fontSize: {},
    boxShadow: {}
  };

  // Transform tokens with error handling
  try {
    // Colors
    if (tokens.colors) {
      for (const [colorGroup, shades] of Object.entries(tokens.colors)) {
        config.colors[colorGroup] = {};
        for (const [shade, tokenData] of Object.entries(shades)) {
          config.colors[colorGroup][shade] = getTokenValue(tokenData);
        }
      }
    }

    // Spacing
    if (tokens.spacing) {
      for (const [key, tokenData] of Object.entries(tokens.spacing)) {
        config.spacing[key] = getTokenValue(tokenData);
      }
    }

    // Border radius
    if (tokens.borderRadius) {
      for (const [key, tokenData] of Object.entries(tokens.borderRadius)) {
        config.borderRadius[key] = getTokenValue(tokenData);
      }
    }

    // Typography
    if (tokens.typography) {
      if (tokens.typography.fontFamily) {
        for (const [key, tokenData] of Object.entries(tokens.typography.fontFamily)) {
          const fontValue = getTokenValue(tokenData);
          // Handle comma-separated font families
          config.fontFamily[key] = fontValue.split(',').map(font => font.trim().replace(/['"]/g, ''));
        }
      }
      
      if (tokens.typography.fontSize) {
        for (const [key, tokenData] of Object.entries(tokens.typography.fontSize)) {
          config.fontSize[key] = getTokenValue(tokenData);
        }
      }
    }

    // Shadows
    if (tokens.shadows) {
      for (const [key, tokenData] of Object.entries(tokens.shadows)) {
        config.boxShadow[key] = getTokenValue(tokenData);
      }
    }
  } catch (error) {
    logger.error(`Error transforming tokens for Tailwind: ${error.message}`);
    throw error;
  }

  // Generate config string with proper formatting
  const configString = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(config.colors, null, 6)},
      spacing: ${JSON.stringify(config.spacing, null, 6)},
      borderRadius: ${JSON.stringify(config.borderRadius, null, 6)},
      fontFamily: ${JSON.stringify(config.fontFamily, null, 6)},
      fontSize: ${JSON.stringify(config.fontSize, null, 6)},
      boxShadow: ${JSON.stringify(config.boxShadow, null, 6)},
    },
  },
  plugins: [],
}`;

  logger.timeEnd('Tailwind config generation');
  return configString;
}

/**
 * Main update function with enhanced error handling and performance
 */
async function updateTokens(options = {}) {
  const startTime = performance.now();
  logger.info('Starting design tokens update...');

  try {
    // Check if tokens.json exists
    if (!fs.existsSync(CONFIG.paths.tokens)) {
      throw new Error('tokens.json not found. Please ensure the file exists in the project root.');
    }

    // Load cache and check if update is needed
    const cache = loadCache();
    const currentHash = getFileHash(CONFIG.paths.tokens);
    
    if (!options.force && cache.hashes?.tokens === currentHash) {
      logger.info('No changes detected in tokens.json, skipping update');
      return { updated: false, reason: 'no-changes' };
    }

    // Read and parse tokens
    logger.info('Reading tokens.json...');
    const tokensContent = fs.readFileSync(CONFIG.paths.tokens, 'utf8');
    let tokens;
    
    try {
      tokens = JSON.parse(tokensContent);
    } catch (parseError) {
      throw new Error(`Invalid JSON in tokens.json: ${parseError.message}`);
    }

    // Validate tokens structure
    logger.info('Validating token structure...');
    const validationErrors = validateTokens(tokens);
    if (validationErrors.length > 0) {
      throw new Error(`Token validation failed:\n${validationErrors.map(err => `  - ${err}`).join('\n')}`);
    }

    // Generate files in parallel
    logger.info('Generating output files...');
    const [tokensCSS, tailwindConfig] = await Promise.all([
      Promise.resolve(generateTokensCSS(tokens)),
      Promise.resolve(generateTailwindConfig(tokens))
    ]);

    // Write files only if changed
    const writeResults = await Promise.all([
      writeFileIfChanged(CONFIG.paths.css, tokensCSS),
      writeFileIfChanged(CONFIG.paths.tailwind, tailwindConfig)
    ]);

    const [cssChanged, tailwindChanged] = writeResults;
    const changedFiles = [];
    
    if (cssChanged) changedFiles.push(path.relative(process.cwd(), CONFIG.paths.css));
    if (tailwindChanged) changedFiles.push(path.relative(process.cwd(), CONFIG.paths.tailwind));

    // Update cache
    cache.hashes = {
      ...cache.hashes,
      tokens: currentHash,
      css: cssChanged ? getFileHash(CONFIG.paths.css) : cache.hashes?.css,
      tailwind: tailwindChanged ? getFileHash(CONFIG.paths.tailwind) : cache.hashes?.tailwind
    };
    cache.lastRun = new Date().toISOString();
    saveCache(cache);

    // Performance and summary
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    if (changedFiles.length > 0) {
      logger.success(`Design tokens updated successfully! (${duration}ms)`);
      logger.info('📄 Updated files:');
      changedFiles.forEach(file => logger.info(`  - ${file}`));
    } else {
      logger.info(`No file changes needed (${duration}ms)`);
    }
    
    // Token summary
    const counts = {
      colors: tokens.colors ? Object.values(tokens.colors).reduce((sum, shades) => sum + Object.keys(shades).length, 0) : 0,
      spacing: tokens.spacing ? Object.keys(tokens.spacing).length : 0,
      borderRadius: tokens.borderRadius ? Object.keys(tokens.borderRadius).length : 0,
      typography: tokens.typography ? Object.values(tokens.typography).reduce((sum, cat) => sum + Object.keys(cat).length, 0) : 0
    };
    
    logger.info('📊 Token summary:');
    Object.entries(counts).forEach(([type, count]) => {
      if (count > 0) logger.info(`  - ${count} ${type} tokens`);
    });
    
    if (process.env.NODE_ENV === 'development') {
      logger.info('🔥 Development mode detected - restart your dev server to see changes');
    }

    return { 
      updated: changedFiles.length > 0, 
      changedFiles, 
      duration: parseFloat(duration),
      tokenCounts: counts
    };

  } catch (error) {
    logger.error('Error updating design tokens:');
    logger.error(`   ${error.message}`);
    
    if (options.throwOnError) {
      throw error;
    }
    process.exit(1);
  }
}

/**
 * Enhanced validation with performance tracking
 */
async function validateOnly(options = {}) {
  const startTime = performance.now();
  logger.info('Validating design tokens...');

  try {
    if (!fs.existsSync(CONFIG.paths.tokens)) {
      throw new Error('tokens.json not found');
    }

    const tokensContent = fs.readFileSync(CONFIG.paths.tokens, 'utf8');
    const tokens = JSON.parse(tokensContent);
    
    const errors = validateTokens(tokens);
    const duration = (performance.now() - startTime).toFixed(2);
    
    if (errors.length === 0) {
      logger.success(`All tokens are valid! (${duration}ms)`);
      return { valid: true, errors: [], duration: parseFloat(duration) };
    } else {
      logger.error('Token validation failed:');
      errors.forEach(error => logger.error(`   - ${error}`));
      return { valid: false, errors, duration: parseFloat(duration) };
    }
    
  } catch (error) {
    logger.error('Validation error:', error.message);
    return { valid: false, errors: [error.message], duration: 0 };
  }
}

// Enhanced CLI with more options
const args = process.argv.slice(2);
const command = args[0];
const options = {
  force: args.includes('--force'),
  verbose: args.includes('--verbose'),
  throwOnError: args.includes('--throw'),
};

if (options.verbose) {
  process.env.DEBUG = 'true';
}

switch (command) {
  case 'update':
  case undefined:
    updateTokens(options);
    break;
    
  case 'validate':
    const result = await validateOnly(options);
    process.exit(result.valid ? 0 : 1);
    break;
    
  case 'clean':
    // Clean cache
    if (fs.existsSync(CONFIG.paths.cache)) {
      fs.unlinkSync(CONFIG.paths.cache);
      logger.success('Cache cleaned');
    }
    resolvedCache.clear();
    validationCache.clear();
    break;
    
  default:
    console.log('Usage:');
    console.log('  node scripts/update-tokens.js [command] [options]');
    console.log('');
    console.log('Commands:');
    console.log('  update    Update CSS and Tailwind config from tokens.json (default)');
    console.log('  validate  Validate tokens.json structure only');
    console.log('  clean     Clean caches and temporary files');
    console.log('');
    console.log('Options:');
    console.log('  --force     Force update even if no changes detected');
    console.log('  --verbose   Enable debug logging');
    console.log('  --throw     Throw errors instead of exiting');
    process.exit(1);
} 