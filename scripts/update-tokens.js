#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const TOKENS_FILE = path.join(__dirname, '../tokens.json');
const TAILWIND_CONFIG = path.join(__dirname, '../tailwind.config.js');
const TOKENS_CSS = path.join(__dirname, '../src/styles/tokens.css');

// Token validation schema
const TOKEN_SCHEMA = {
  colors: { required: true, type: 'object' },
  spacing: { required: true, type: 'object' },
  borderRadius: { required: false, type: 'object' },
  typography: { required: false, type: 'object' },
  shadows: { required: false, type: 'object' }
};

/**
 * Validate tokens structure
 */
function validateTokens(tokens) {
  const errors = [];
  
  if (!tokens || typeof tokens !== 'object') {
    return ['tokens.json must contain a valid JSON object'];
  }

  // Check required token categories
  for (const [category, schema] of Object.entries(TOKEN_SCHEMA)) {
    if (schema.required && !tokens[category]) {
      errors.push(`Missing required token category: ${category}`);
    }
    
    if (tokens[category] && typeof tokens[category] !== schema.type) {
      errors.push(`Token category ${category} must be of type ${schema.type}`);
    }
  }

  // Helper function to get token value (supports both $value and value)
  const getTokenValue = (tokenData) => tokenData.$value || tokenData.value;
  const getTokenType = (tokenData) => tokenData.$type || tokenData.type;

  // Validate color structure
  if (tokens.colors) {
    for (const [colorGroup, shades] of Object.entries(tokens.colors)) {
      if (typeof shades !== 'object') {
        errors.push(`Color group ${colorGroup} must be an object`);
        continue;
      }
      
      for (const [shade, tokenData] of Object.entries(shades)) {
        if (!getTokenValue(tokenData)) {
          errors.push(`Missing value for color ${colorGroup}.${shade}`);
        }
        
        if (!getTokenType(tokenData) || getTokenType(tokenData) !== 'color') {
          errors.push(`Invalid or missing type for color ${colorGroup}.${shade}`);
        }
      }
    }
  }

  // Validate spacing structure
  if (tokens.spacing) {
    for (const [key, tokenData] of Object.entries(tokens.spacing)) {
      if (!getTokenValue(tokenData)) {
        errors.push(`Missing value for spacing.${key}`);
      }
      
      if (!getTokenType(tokenData) || !['dimension', 'spacing'].includes(getTokenType(tokenData))) {
        errors.push(`Invalid type for spacing.${key} (expected 'dimension' or 'spacing')`);
      }
    }
  }

  return errors;
}

/**
 * Get raw token value (supports both $value and value properties)
 */
function getRawTokenValue(tokenData) {
  return tokenData.$value || tokenData.value;
}

/**
 * Resolve token references like {3xl} to actual values
 */
function resolveTokenReferences(tokens, value) {
  if (typeof value !== 'string' || !value.includes('{')) {
    return value;
  }

  // Match token references like {3xl}, {spacing.4}, {colors.primary.500}
  return value.replace(/\{([^}]+)\}/g, (match, reference) => {
    // Handle simple references like {3xl}
    if (!reference.includes('.')) {
      // Try to find in all token categories
      for (const [category, categoryTokens] of Object.entries(tokens)) {
        if (typeof categoryTokens === 'object' && categoryTokens[reference]) {
          const referencedValue = getRawTokenValue(categoryTokens[reference]);
          return resolveTokenReferences(tokens, referencedValue); // Recursive resolution
        }
      }
    } else {
      // Handle dot notation like {borderRadius.3xl}
      const parts = reference.split('.');
      let current = tokens;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && current[part]) {
          current = current[part];
        } else {
          console.warn(`⚠️  Token reference ${reference} not found`);
          return match; // Return original if not found
        }
      }
      
      if (current && typeof current === 'object') {
        const referencedValue = getRawTokenValue(current);
        return resolveTokenReferences(tokens, referencedValue); // Recursive resolution
      }
    }
    
    console.warn(`⚠️  Token reference ${reference} not found`);
    return match; // Return original if not found
  });
}

/**
 * Transform tokens to CSS custom properties
 */
function generateTokensCSS(tokens) {
  // Helper function to get token value (supports both $value and value)
  const getTokenValue = (tokenData) => {
    const rawValue = tokenData.$value || tokenData.value;
    return resolveTokenReferences(tokens, rawValue);
  };

  let css = `/* Auto-generated CSS Custom Properties from tokens.json */
/* This file is updated automatically by scripts/update-tokens.js */
/* Last updated: ${new Date().toISOString()} */

:root {`;

  // Generate color tokens
  if (tokens.colors) {
    css += `\n  /* Colors from tokens.json */`;
    for (const [colorGroup, shades] of Object.entries(tokens.colors)) {
      for (const [shade, tokenData] of Object.entries(shades)) {
        const varName = `--color-${colorGroup}-${shade}`;
        css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
      }
    }
  }

  // Generate spacing tokens
  if (tokens.spacing) {
    css += `\n\n  /* Spacing from tokens.json */`;
    for (const [key, tokenData] of Object.entries(tokens.spacing)) {
      const varName = `--spacing-${key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
  }

  // Generate border radius tokens
  if (tokens.borderRadius) {
    css += `\n\n  /* Border radius from tokens.json */`;
    for (const [key, tokenData] of Object.entries(tokens.borderRadius)) {
      const varName = `--border-radius-${key === 'default' ? 'DEFAULT' : key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
  }

  // Generate typography tokens
  if (tokens.typography) {
    css += `\n\n  /* Typography from tokens.json */`;
    for (const [category, values] of Object.entries(tokens.typography)) {
      for (const [key, tokenData] of Object.entries(values)) {
        const varName = `--typography-${category}-${key}`;
        css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
      }
    }
  }

  // Generate shadow tokens
  if (tokens.shadows) {
    css += `\n\n  /* Shadows from tokens.json */`;
    for (const [key, tokenData] of Object.entries(tokens.shadows)) {
      const varName = `--shadow-${key}`;
      css += `\n  ${varName}: ${getTokenValue(tokenData)};`;
    }
  }

  css += `\n}\n`;
  return css;
}

/**
 * Transform tokens to Tailwind config format
 */
function generateTailwindConfig(tokens) {
  // Helper function to get token value (supports both $value and value)
  const getTokenValue = (tokenData) => {
    const rawValue = tokenData.$value || tokenData.value;
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

  // Transform colors
  if (tokens.colors) {
    for (const [colorGroup, shades] of Object.entries(tokens.colors)) {
      config.colors[colorGroup] = {};
      for (const [shade, tokenData] of Object.entries(shades)) {
        config.colors[colorGroup][shade] = getTokenValue(tokenData);
      }
    }
  }

  // Transform spacing
  if (tokens.spacing) {
    for (const [key, tokenData] of Object.entries(tokens.spacing)) {
      config.spacing[key] = getTokenValue(tokenData);
    }
  }

  // Transform border radius
  if (tokens.borderRadius) {
    for (const [key, tokenData] of Object.entries(tokens.borderRadius)) {
      config.borderRadius[key] = getTokenValue(tokenData);
    }
  }

  // Transform typography
  if (tokens.typography) {
    if (tokens.typography.fontFamily) {
      for (const [key, tokenData] of Object.entries(tokens.typography.fontFamily)) {
        const fontValue = getTokenValue(tokenData);
        config.fontFamily[key] = fontValue.split(',').map(font => font.trim());
      }
    }
    
    if (tokens.typography.fontSize) {
      for (const [key, tokenData] of Object.entries(tokens.typography.fontSize)) {
        config.fontSize[key] = getTokenValue(tokenData);
      }
    }
  }

  // Transform shadows
  if (tokens.shadows) {
    for (const [key, tokenData] of Object.entries(tokens.shadows)) {
      config.boxShadow[key] = getTokenValue(tokenData);
    }
  }

  // Read existing Tailwind config
  let existingConfig = '';
  try {
    existingConfig = fs.readFileSync(TAILWIND_CONFIG, 'utf8');
  } catch (error) {
    console.warn('⚠️  Could not read existing Tailwind config, creating new one');
  }

  // Generate new config content
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

  return configString;
}

/**
 * Main update function
 */
async function updateTokens() {
  console.log('🔄 Starting design tokens update...');

  try {
    // Check if tokens.json exists
    if (!fs.existsSync(TOKENS_FILE)) {
      throw new Error('tokens.json not found. Please ensure the file exists in the project root.');
    }

    // Read and parse tokens
    console.log('📖 Reading tokens.json...');
    const tokensContent = fs.readFileSync(TOKENS_FILE, 'utf8');
    let tokens;
    
    try {
      tokens = JSON.parse(tokensContent);
    } catch (parseError) {
      throw new Error(`Invalid JSON in tokens.json: ${parseError.message}`);
    }

    // Validate tokens structure
    console.log('✅ Validating token structure...');
    const validationErrors = validateTokens(tokens);
    if (validationErrors.length > 0) {
      throw new Error(`Token validation failed:\n${validationErrors.map(err => `  - ${err}`).join('\n')}`);
    }

    // Generate CSS custom properties
    console.log('🎨 Generating CSS custom properties...');
    const tokensCSS = generateTokensCSS(tokens);
    fs.writeFileSync(TOKENS_CSS, tokensCSS);
    console.log(`✅ Updated ${TOKENS_CSS}`);

    // Generate Tailwind config
    console.log('⚙️  Updating Tailwind configuration...');
    const tailwindConfig = generateTailwindConfig(tokens);
    fs.writeFileSync(TAILWIND_CONFIG, tailwindConfig);
    console.log(`✅ Updated ${TAILWIND_CONFIG}`);

    // Success summary
    console.log('\n🎉 Design tokens updated successfully!');
    console.log('📄 Updated files:');
    console.log(`  - ${path.relative(process.cwd(), TOKENS_CSS)}`);
    console.log(`  - ${path.relative(process.cwd(), TAILWIND_CONFIG)}`);
    
    // Count tokens
    const colorCount = tokens.colors ? Object.values(tokens.colors).reduce((sum, shades) => sum + Object.keys(shades).length, 0) : 0;
    const spacingCount = tokens.spacing ? Object.keys(tokens.spacing).length : 0;
    
    console.log('\n📊 Token summary:');
    console.log(`  - ${colorCount} color tokens`);
    console.log(`  - ${spacingCount} spacing tokens`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🔥 Development mode detected - restart your dev server to see changes');
    }

  } catch (error) {
    console.error('❌ Error updating design tokens:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * Validate tokens only (no file writing)
 */
async function validateOnly() {
  console.log('🔍 Validating design tokens...');

  try {
    if (!fs.existsSync(TOKENS_FILE)) {
      throw new Error('tokens.json not found');
    }

    const tokensContent = fs.readFileSync(TOKENS_FILE, 'utf8');
    const tokens = JSON.parse(tokensContent);
    
    const errors = validateTokens(tokens);
    
    if (errors.length === 0) {
      console.log('✅ All tokens are valid!');
      return true;
    } else {
      console.error('❌ Token validation failed:');
      errors.forEach(error => console.error(`   - ${error}`));
      return false;
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    return false;
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'update':
  case undefined:
    updateTokens();
    break;
    
  case 'validate':
    const isValid = await validateOnly();
    process.exit(isValid ? 0 : 1);
    break;
    
  default:
    console.log('Usage:');
    console.log('  node scripts/update-tokens.js [update|validate]');
    console.log('');
    console.log('Commands:');
    console.log('  update    Update CSS and Tailwind config from tokens.json (default)');
    console.log('  validate  Validate tokens.json structure only');
    process.exit(1);
} 