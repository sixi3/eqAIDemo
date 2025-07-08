import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('CLI Integration Tests', () => {
  let testDir;
  let originalCwd;

  beforeEach(async () => {
    suppressConsole();
    
    // Create test directory
    testDir = path.join(os.tmpdir(), `cli-test-${Date.now()}`);
    await fs.ensureDir(testDir);
    
    // Store original directory
    originalCwd = process.cwd();
    process.chdir(testDir);
  });

  afterEach(async () => {
    restoreConsole();
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('CLI Help Commands', () => {
    test('should display help message', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Design Tokens Sync');
      expect(result).toContain('Usage:');
      expect(result).toContain('Commands:');
    });

    test('should display version', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' --version', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('1.0.0');
    });
  });

  describe('Init Command', () => {
    test('should show init help', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' init --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Initialize design tokens');
      expect(result).toContain('Options:');
      expect(result).toContain('--force');
      expect(result).toContain('--template');
    });
  });

  describe('Validate Command', () => {
    test('should show validate help', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' validate --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Validate tokens.json structure');
    });

    test('should fail when no tokens file exists', () => {
      expect(() => {
        execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' validate', { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
      }).toThrow();
    });
  });

  describe('Sync Command', () => {
    test('should show sync help', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' sync --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Sync tokens from tokens.json to CSS/Tailwind');
    });
  });

  describe('Watch Command', () => {
    test('should show watch help', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' watch --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Watch tokens.json for changes');
    });
  });

  describe('Analytics Command', () => {
    test('should show analytics help', () => {
      const result = execSync('node ' + path.join(originalCwd, 'bin/design-tokens-sync.js') + ' analytics --help', { 
        encoding: 'utf8' 
      });
      
      expect(result).toContain('Design system analytics tools');
    });
  });

  describe('Package Structure', () => {
    test('should have all required files', async () => {
      const packageRoot = originalCwd;
      
      // Check main files exist
      expect(await fs.pathExists(path.join(packageRoot, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'bin/design-tokens-sync.js'))).toBe(true);
      
      // Check source directories exist
      expect(await fs.pathExists(path.join(packageRoot, 'src'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'src/cli'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'src/core'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'src/analytics'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'src/utils'))).toBe(true);
      
      // Check templates exist
      expect(await fs.pathExists(path.join(packageRoot, 'templates'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'templates/react'))).toBe(true);
      expect(await fs.pathExists(path.join(packageRoot, 'templates/github-actions'))).toBe(true);
    });

    test('should have executable permissions on CLI', async () => {
      const cliPath = path.join(originalCwd, 'bin/design-tokens-sync.js');
      const stats = await fs.stat(cliPath);
      
      // Check if file is executable (at least by owner)
      expect(stats.mode & parseInt('100', 8)).toBeGreaterThan(0);
    });
  });

  describe('Template Files', () => {
    test('should have valid React template', async () => {
      const reactTokensPath = path.join(originalCwd, 'templates/react/tokens.json');
      expect(await fs.pathExists(reactTokensPath)).toBe(true);
      
      const tokens = await fs.readJSON(reactTokensPath);
      expect(tokens).toBeDefined();
      expect(tokens.core).toBeDefined();
      expect(tokens.core.colors).toBeDefined();
      expect(tokens.core.spacing).toBeDefined();
    });

    test('should have GitHub Actions workflows', async () => {
      const workflowsPath = path.join(originalCwd, 'templates/github-actions');
      expect(await fs.pathExists(workflowsPath)).toBe(true);
      
      const workflows = await fs.readdir(workflowsPath);
      expect(workflows).toContain('design-tokens-sync.yml');
      expect(workflows).toContain('pre-commit-validation.yml');
      expect(workflows).toContain('weekly-analytics.yml');
      expect(workflows).toContain('README.md');
    });
  });

  describe('Configuration Files', () => {
    test('should have valid package.json', async () => {
      const packagePath = path.join(originalCwd, 'package.json');
      const pkg = await fs.readJSON(packagePath);
      
      expect(pkg.name).toBe('design-tokens-sync');
      expect(pkg.version).toBe('1.0.0');
      expect(pkg.bin).toBeDefined();
      expect(pkg.bin['design-tokens-sync']).toBe('bin/design-tokens-sync.js');
      expect(pkg.bin['dts']).toBe('bin/design-tokens-sync.js');
      
      // Check required dependencies
      expect(pkg.dependencies).toBeDefined();
      expect(pkg.dependencies.chalk).toBeDefined();
      expect(pkg.dependencies.commander).toBeDefined();
      expect(pkg.dependencies.inquirer).toBeDefined();
      expect(pkg.dependencies['fs-extra']).toBeDefined();
    });

    test('should have working npm scripts', async () => {
      const packagePath = path.join(originalCwd, 'package.json');
      const pkg = await fs.readJSON(packagePath);
      
      expect(pkg.scripts).toBeDefined();
      expect(pkg.scripts['tokens:sync']).toBe('node bin/design-tokens-sync.js sync');
      expect(pkg.scripts['tokens:watch']).toBe('node bin/design-tokens-sync.js watch');
      expect(pkg.scripts['tokens:analytics']).toBe('node bin/design-tokens-sync.js analytics report');
    });
  });

  describe('Documentation', () => {
    test('should have README file', async () => {
      const readmePath = path.join(originalCwd, 'README.md');
      expect(await fs.pathExists(readmePath)).toBe(true);
      
      const content = await fs.readFile(readmePath, 'utf8');
      expect(content).toContain('design-tokens-sync');
      expect(content).toContain('Installation');
      expect(content).toContain('Usage');
    });

    test('should have GitHub Actions documentation', async () => {
      const docsPath = path.join(originalCwd, 'templates/github-actions/README.md');
      expect(await fs.pathExists(docsPath)).toBe(true);
      
      const content = await fs.readFile(docsPath, 'utf8');
      expect(content).toContain('GitHub Actions Workflows');
      expect(content).toContain('Setup Instructions');
    });
  });
}); 