import fs from 'fs-extra';
import path from 'path';
import os from 'os';

// Create temporary directory for tests
global.TEST_TMP_DIR = path.join(os.tmpdir(), 'design-tokens-sync-test');

beforeAll(async () => {
  // Ensure test tmp directory exists and is clean
  await fs.remove(global.TEST_TMP_DIR);
  await fs.ensureDir(global.TEST_TMP_DIR);
});

afterAll(async () => {
  // Clean up test tmp directory
  await fs.remove(global.TEST_TMP_DIR);
});

// Mock console methods to reduce noise in tests
global.originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info
};

// Helper to suppress console output in tests
global.suppressConsole = () => {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
};

// Helper to restore console output
global.restoreConsole = () => {
  console.log = global.originalConsole.log;
  console.warn = global.originalConsole.warn;
  console.error = global.originalConsole.error;
  console.info = global.originalConsole.info;
};

// Helper to create test project structure
global.createTestProject = async (projectPath, options = {}) => {
  const {
    framework = 'react',
    hasTokens = true,
    hasConfig = true,
    hasComponents = false
  } = options;
  
  await fs.ensureDir(projectPath);
  
  if (hasTokens) {
    const tokensPath = path.join(projectPath, 'tokens.json');
    const testTokens = {
      colors: {
        primary: {
          50: { value: '#eff6ff', type: 'color' },
          500: { value: '#3b82f6', type: 'color' },
          900: { value: '#1e3a8a', type: 'color' }
        },
        secondary: {
          500: { value: '#6b7280', type: 'color' }
        }
      },
      spacing: {
        xs: { value: '0.5rem', type: 'spacing' },
        sm: { value: '1rem', type: 'spacing' },
        md: { value: '1.5rem', type: 'spacing' }
      },
      typography: {
        heading: {
          fontSize: { value: '2rem', type: 'fontSizes' },
          fontWeight: { value: '700', type: 'fontWeights' }
        }
      }
    };
    await fs.writeJSON(tokensPath, testTokens, { spaces: 2 });
  }
  
  if (hasConfig) {
    const configPath = path.join(projectPath, 'design-tokens.config.js');
    const testConfig = `module.exports = {
  tokens: {
    input: 'tokens.json'
  },
  output: {
    css: 'src/styles/tokens.css',
    typescript: 'src/types/tokens.d.ts'
  },
  git: {
    enabled: false
  },
  analytics: {
    enabled: true
  }
};`;
    await fs.writeFile(configPath, testConfig);
  }
  
  if (hasComponents) {
    const componentDir = path.join(projectPath, 'src/components');
    await fs.ensureDir(componentDir);
    
    const buttonComponent = `import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary' }) => {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  );
};`;
    
    const buttonCSS = `.btn {
  padding: var(--spacing-sm);
  border-radius: 0.375rem;
  font-weight: var(--typography-heading-fontWeight);
}

.btn-primary {
  background-color: var(--colors-primary-500);
  color: white;
}

.btn-secondary {
  background-color: var(--colors-secondary-500);
  color: white;
}`;
    
    await fs.writeFile(path.join(componentDir, 'Button.tsx'), buttonComponent);
    await fs.writeFile(path.join(componentDir, 'Button.css'), buttonCSS);
  }
  
  // Create package.json
  const packageJson = {
    name: 'test-project',
    version: '1.0.0',
    scripts: {
      'tokens:sync': 'design-tokens-sync sync',
      'tokens:validate': 'design-tokens-sync validate'
    }
  };
  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  
  return projectPath;
};

// Helper to clean up created test files
global.cleanupTestProject = async (projectPath) => {
  if (await fs.pathExists(projectPath)) {
    await fs.remove(projectPath);
  }
}; 