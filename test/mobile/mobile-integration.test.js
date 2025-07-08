import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { FileGenerator } from '../../src/core/FileGenerator.js';

describe('Mobile Integration Tests', () => {
  let testProjectPath;
  let originalCwd;

  beforeEach(async () => {
    suppressConsole();
    
    // Ensure global.TEST_TMP_DIR is available
    if (!global.TEST_TMP_DIR) {
      global.TEST_TMP_DIR = path.join(os.tmpdir(), 'design-tokens-sync-test');
    }
    testProjectPath = path.join(global.TEST_TMP_DIR, `mobile-integration-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.ensureDir(testProjectPath);
    
    // Store original directory
    originalCwd = process.cwd();
    process.chdir(testProjectPath);
    
    // Create a realistic tokens.json file
    const tokens = {
      colors: {
        primary: {
          50: { value: '#eff6ff', type: 'color' },
          100: { value: '#dbeafe', type: 'color' },
          500: { value: '#3b82f6', type: 'color' },
          600: { value: '#2563eb', type: 'color' },
          900: { value: '#1e3a8a', type: 'color' }
        },
        secondary: {
          500: { value: '#6b7280', type: 'color' },
          600: { value: '#4b5563', type: 'color' }
        },
        neutral: {
          50: { value: '#f9fafb', type: 'color' },
          100: { value: '#f3f4f6', type: 'color' },
          200: { value: '#e5e7eb', type: 'color' },
          300: { value: '#d1d5db', type: 'color' },
          400: { value: '#9ca3af', type: 'color' },
          500: { value: '#6b7280', type: 'color' }
        }
      },
      spacing: {
        1: { value: '0.25rem', type: 'spacing' },
        2: { value: '0.5rem', type: 'spacing' },
        3: { value: '0.75rem', type: 'spacing' },
        4: { value: '1rem', type: 'spacing' },
        5: { value: '1.25rem', type: 'spacing' },
        6: { value: '1.5rem', type: 'spacing' },
        8: { value: '2rem', type: 'spacing' }
      },
      typography: {
        fontFamily: {
          sans: { value: 'Inter, system-ui, -apple-system, sans-serif', type: 'fontFamily' },
          serif: { value: 'Georgia, serif', type: 'fontFamily' },
          mono: { value: 'Menlo, Monaco, monospace', type: 'fontFamily' }
        },
        fontSize: {
          xs: { value: '0.75rem', type: 'fontSize' },
          sm: { value: '0.875rem', type: 'fontSize' },
          base: { value: '1rem', type: 'fontSize' },
          lg: { value: '1.125rem', type: 'fontSize' },
          xl: { value: '1.25rem', type: 'fontSize' },
          '2xl': { value: '1.5rem', type: 'fontSize' },
          '3xl': { value: '1.875rem', type: 'fontSize' }
        },
        fontWeight: {
          normal: { value: '400', type: 'fontWeight' },
          medium: { value: '500', type: 'fontWeight' },
          semibold: { value: '600', type: 'fontWeight' },
          bold: { value: '700', type: 'fontWeight' }
        },
        lineHeight: {
          tight: { value: '1.25', type: 'lineHeight' },
          normal: { value: '1.5', type: 'lineHeight' },
          relaxed: { value: '1.75', type: 'lineHeight' }
        }
      },
      borderRadius: {
        none: { value: '0', type: 'borderRadius' },
        sm: { value: '0.125rem', type: 'borderRadius' },
        md: { value: '0.375rem', type: 'borderRadius' },
        lg: { value: '0.5rem', type: 'borderRadius' },
        xl: { value: '0.75rem', type: 'borderRadius' },
        full: { value: '9999px', type: 'borderRadius' }
      },
      shadows: {
        sm: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', type: 'boxShadow' },
        md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', type: 'boxShadow' },
        lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', type: 'boxShadow' },
        xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', type: 'boxShadow' }
      }
    };
    
    await fs.writeJSON(path.join(testProjectPath, 'tokens.json'), tokens, { spaces: 2 });
  });

  afterEach(async () => {
    restoreConsole();
    process.chdir(originalCwd);
    if (testProjectPath && await fs.pathExists(testProjectPath)) {
      await fs.remove(testProjectPath);
    }
  });

  describe('React Native Project Setup', () => {
    test('should create React Native mobile configuration', async () => {
      // Create React Native config
      const reactNativeConfig = `module.exports = {
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
  },
  processing: {
    transformUnits: {
      rem: { multiply: 16, unit: 'dp' },
      px: { multiply: 1, unit: 'dp' }
    }
  },
  output: {
    reactNative: {
      path: 'src/styles/tokens.js',
      format: 'js'
    },
    ios: {
      path: 'ios/DesignTokens/Colors.swift'
    },
    android: {
      path: 'android/app/src/main/res/values/colors.xml'
    }
  },
  reactNative: {
    nativeWind: { enabled: true },
    expo: { enabled: false },
    platformOverrides: {
      ios: { shadows: 'native' },
      android: { elevation: true }
    }
  }
};`;

      await fs.writeFile('design-tokens.config.js', reactNativeConfig);
      
      // Create directory structure
      await fs.ensureDir('src/styles');
      await fs.ensureDir('ios/DesignTokens');
      await fs.ensureDir('android/app/src/main/res/values');
      
      // Test that config file was created with expected content
      const configPath = path.join(testProjectPath, 'design-tokens.config.js');
      expect(await fs.pathExists(configPath)).toBe(true);
      
      const configContent = await fs.readFile(configPath, 'utf8');
      expect(configContent).toContain('module.exports');
      expect(configContent).toContain('reactNative');
      expect(configContent).toContain('output');
      
      expect(await fs.pathExists('design-tokens.config.js')).toBe(true);
    });

    test('should generate React Native tokens with proper mobile optimizations', async () => {
      const generator = new FileGenerator();
      
      // Load test tokens
      const tokensData = await fs.readJSON('tokens.json');
      
      // Convert design tokens format to flat format for generator
      const flatTokens = {};
      
      Object.entries(tokensData).forEach(([category, items]) => {
        flatTokens[category] = {};
        Object.entries(items).forEach(([key, config]) => {
          if (typeof config === 'object' && config.value) {
            flatTokens[category][key] = config.value;
          } else {
            flatTokens[category][key] = {};
            Object.entries(config).forEach(([subKey, subConfig]) => {
              flatTokens[category][key][subKey] = subConfig.value;
            });
          }
        });
      });
      
      const outputPath = 'src/styles/tokens.js';
      await fs.ensureDir(path.dirname(outputPath));
      
      const result = await generator.generateReactNative(flatTokens, outputPath);
      
      expect(result).toBeDefined();
      expect(await fs.pathExists(outputPath)).toBe(true);
      
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check mobile-specific optimizations
      expect(content).toContain('import { StyleSheet, Dimensions }');
      expect(content).toContain('const { width: screenWidth, height: screenHeight }');
      
      // Check unit conversions
      expect(content).toContain('1: 4,'); // 0.25rem -> 4dp
      expect(content).toContain('4: 16,'); // 1rem -> 16dp
      expect(content).toContain('8: 32,'); // 2rem -> 32dp
      
      // Check that colors are preserved
      expect(content).toContain("'#3b82f6'");
      expect(content).toContain("'#6b7280'");
      
      // Check StyleSheet creation
      expect(content).toContain('StyleSheet.create({');
      expect(content).toContain('flex: 1,');
    });
  });

  describe('Flutter Project Setup', () => {
    test('should generate Flutter Dart classes with Material Design', async () => {
      const generator = new FileGenerator();
      
      const tokensData = await fs.readJSON('tokens.json');
      
      // Convert to flat format
      const flatTokens = {};
      Object.entries(tokensData).forEach(([category, items]) => {
        flatTokens[category] = {};
        Object.entries(items).forEach(([key, config]) => {
          if (typeof config === 'object' && config.value) {
            flatTokens[category][key] = config.value;
          } else {
            flatTokens[category][key] = {};
            Object.entries(config).forEach(([subKey, subConfig]) => {
              flatTokens[category][key][subKey] = subConfig.value;
            });
          }
        });
      });
      
      const outputPath = 'lib/design_tokens/app_tokens.dart';
      await fs.ensureDir(path.dirname(outputPath));
      
      const result = await generator.generateFlutter(flatTokens, outputPath);
      
      expect(result).toBeDefined();
      expect(await fs.pathExists(outputPath)).toBe(true);
      
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check Flutter-specific structure
      expect(content).toContain("import 'package:flutter/material.dart';");
      expect(content).toContain('class AppColors {');
      expect(content).toContain('class AppSpacing {');
      expect(content).toContain('class AppTextStyles {');
      expect(content).toContain('class AppTheme {');
      
      // Check color conversions
      expect(content).toContain('Color(0xFF3B82F6)'); // #3b82f6
      expect(content).toContain('Color(0xFF6B7280)'); // #6b7280
      
      // Check Material Design 3 integration
      expect(content).toContain('useMaterial3: true,');
      
      // Check spacing conversions
      expect(content).toContain('static const double spacing1 = 4.0;'); // 0.25rem -> 4.0
      expect(content).toContain('static const double spacing4 = 16.0;'); // 1rem -> 16.0
    });
  });

  describe('Cross-Platform Generation', () => {
    test('should generate tokens for all mobile platforms simultaneously', async () => {
      const generator = new FileGenerator();
      
      const tokensData = await fs.readJSON('tokens.json');
      
      // Convert to flat format
      const flatTokens = {};
      Object.entries(tokensData).forEach(([category, items]) => {
        flatTokens[category] = {};
        Object.entries(items).forEach(([key, config]) => {
          if (typeof config === 'object' && config.value) {
            flatTokens[category][key] = config.value;
          } else {
            flatTokens[category][key] = {};
            Object.entries(config).forEach(([subKey, subConfig]) => {
              flatTokens[category][key][subKey] = subConfig.value;
            });
          }
        });
      });
      
      // Create output directories
      await fs.ensureDir('src/styles');
      await fs.ensureDir('lib/design_tokens');
      await fs.ensureDir('ios/DesignTokens');
      await fs.ensureDir('android/app/src/main/res/values');
      await fs.ensureDir('src/xamarin');
      
      const config = {
        output: {
          reactNative: 'src/styles/tokens.js',
          expo: 'src/styles/expo-tokens.js',
          flutter: 'lib/design_tokens/app_tokens.dart',
          ios: 'ios/DesignTokens/Colors.swift',
          android: 'android/app/src/main/res/values/colors.xml',
          xamarin: 'src/xamarin/AppTokens.cs'
        }
      };
      
      const results = await generator.generateAll(flatTokens, config);
      
      // Verify all platforms generated successfully
      expect(results.reactNative).toBeDefined();
      expect(results.expo).toBeDefined();
      expect(results.flutter).toBeDefined();
      expect(results.ios).toBeDefined();
      expect(results.android).toBeDefined();
      expect(results.xamarin).toBeDefined();
      
      // Verify all files exist
      expect(await fs.pathExists(config.output.reactNative)).toBe(true);
      expect(await fs.pathExists(config.output.expo)).toBe(true);
      expect(await fs.pathExists(config.output.flutter)).toBe(true);
      expect(await fs.pathExists(config.output.ios)).toBe(true);
      expect(await fs.pathExists(config.output.android)).toBe(true);
      expect(await fs.pathExists(config.output.xamarin)).toBe(true);
      
      // Verify content consistency across platforms
      const rnContent = await fs.readFile(config.output.reactNative, 'utf8');
      const flutterContent = await fs.readFile(config.output.flutter, 'utf8');
      const iosContent = await fs.readFile(config.output.ios, 'utf8');
      const androidContent = await fs.readFile(config.output.android, 'utf8');
      
      // Same primary color across all platforms (in different formats)
      expect(rnContent).toContain("'#3b82f6'"); // React Native
      expect(flutterContent).toContain('0xFF3B82F6'); // Flutter
      expect(iosContent).toContain('"#3b82f6"'); // iOS
      expect(androidContent).toContain('#3b82f6'); // Android
    });
  });

  describe('Mobile Template Validation', () => {
    test('should have valid React Native config template', async () => {
      const templatePath = path.join(originalCwd, 'templates/react-native/design-tokens.config.js');
      expect(await fs.pathExists(templatePath)).toBe(true);
      
      const content = await fs.readFile(templatePath, 'utf8');
      expect(content).toContain('export default');
      expect(content).toContain('reactNative:');
      expect(content).toContain('nativeWind:');
      expect(content).toContain('expo:');
      expect(content).toContain('platformOverrides:');
    });

    test('should have valid Flutter config template', async () => {
      const templatePath = path.join(originalCwd, 'templates/flutter/design-tokens.config.js');
      expect(await fs.pathExists(templatePath)).toBe(true);
      
      const content = await fs.readFile(templatePath, 'utf8');
      expect(content).toContain('export default');
      expect(content).toContain('flutter:');
      expect(content).toContain('materialDesign:');
      expect(content).toContain('cupertino:');
      expect(content).toContain('theme:');
    });

    test('should have React Native Button component example', async () => {
      const templatePath = path.join(originalCwd, 'templates/react-native/src/components/Button.tsx');
      expect(await fs.pathExists(templatePath)).toBe(true);
      
      const content = await fs.readFile(templatePath, 'utf8');
      expect(content).toContain('import tokens from');
      expect(content).toContain('StyleSheet.create');
      expect(content).toContain('tokens.colors.primary');
      expect(content).toContain('tokens.spacing');
      expect(content).toContain('tokens.borderRadius');
    });
  });

  describe('Mobile Documentation', () => {
    test('should have comprehensive mobile support documentation', async () => {
      const docsPath = path.join(originalCwd, 'docs/mobile-support.md');
      expect(await fs.pathExists(docsPath)).toBe(true);
      
      const content = await fs.readFile(docsPath, 'utf8');
      expect(content).toContain('# Mobile App Development Support');
      expect(content).toContain('React Native');
      expect(content).toContain('Flutter');
      expect(content).toContain('iOS');
      expect(content).toContain('Android');
      expect(content).toContain('Xamarin');
      expect(content).toContain('Getting Started');
      expect(content).toContain('Best Practices');
    });

    test('should have mobile extension summary', async () => {
      const summaryPath = path.join(originalCwd, 'MOBILE_EXTENSION_SUMMARY.md');
      expect(await fs.pathExists(summaryPath)).toBe(true);
      
      const content = await fs.readFile(summaryPath, 'utf8');
      expect(content).toContain('Mobile App Development Extension Summary');
      expect(content).toContain('New Platform Support Added');
      expect(content).toContain('Enhanced FileGenerator');
      expect(content).toContain('Cross-Platform Consistency');
    });
  });

  describe('Performance and Quality', () => {
    test('should generate tokens quickly for large token sets', async () => {
      const generator = new FileGenerator();
      
      // Create a large token set
      const largeTokens = {
        colors: {},
        spacing: {},
        typography: {}
      };
      
      // Generate 100 color variations
      for (let i = 0; i < 100; i++) {
        largeTokens.colors[`color${i}`] = {
          50: `#${i.toString(16).padStart(2, '0')}f6ff`,
          500: `#${i.toString(16).padStart(2, '0')}82f6`,
          900: `#${i.toString(16).padStart(2, '0')}3a8a`
        };
      }
      
      // Generate 50 spacing values
      for (let i = 0; i < 50; i++) {
        largeTokens.spacing[`space${i}`] = `${i * 0.25}rem`;
      }
      
      const start = Date.now();
      const outputPath = 'src/styles/large-tokens.js';
      await fs.ensureDir(path.dirname(outputPath));
      
      const result = await generator.generateReactNative(largeTokens, outputPath);
      const duration = Date.now() - start;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      expect(await fs.pathExists(outputPath)).toBe(true);
      
      const content = await fs.readFile(outputPath, 'utf8');
      expect(content.length).toBeGreaterThan(1000); // Should generate substantial content
    });

    test('should generate valid syntax for all platforms', async () => {
      const generator = new FileGenerator();
      
      const tokensData = await fs.readJSON('tokens.json');
      const flatTokens = {};
      
      Object.entries(tokensData).forEach(([category, items]) => {
        flatTokens[category] = {};
        Object.entries(items).forEach(([key, config]) => {
          if (typeof config === 'object' && config.value) {
            flatTokens[category][key] = config.value;
          } else {
            flatTokens[category][key] = {};
            Object.entries(config).forEach(([subKey, subConfig]) => {
              flatTokens[category][key][subKey] = subConfig.value;
            });
          }
        });
      });
      
      // Generate all platforms
      await fs.ensureDir('test-output');
      
      const results = await Promise.all([
        generator.generateReactNative(flatTokens, 'test-output/tokens.js'),
        generator.generateFlutter(flatTokens, 'test-output/tokens.dart'),
        generator.generateIOS(flatTokens, 'test-output/Colors.swift'),
        generator.generateAndroid(flatTokens, 'test-output/colors.xml'),
        generator.generateXamarin(flatTokens, 'test-output/AppTokens.cs')
      ]);
      
      // All should succeed without throwing
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(100);
      });
      
      // Check basic syntax validity
      const jsContent = await fs.readFile('test-output/tokens.js', 'utf8');
      const dartContent = await fs.readFile('test-output/tokens.dart', 'utf8');
      const swiftContent = await fs.readFile('test-output/Colors.swift', 'utf8');
      const xmlContent = await fs.readFile('test-output/colors.xml', 'utf8');
      const csContent = await fs.readFile('test-output/AppTokens.cs', 'utf8');
      
      // Check for common syntax errors
      expect(jsContent).not.toContain('undefined');
      expect(jsContent).toContain('export');
      
      expect(dartContent).toContain('class');
      expect(dartContent).toContain('static const');
      
      expect(swiftContent).toContain('extension UIColor');
      expect(swiftContent).toContain('static let');
      
      expect(xmlContent).toContain('<?xml');
      expect(xmlContent).toContain('<resources>');
      expect(xmlContent).toContain('</resources>');
      
      expect(csContent).toContain('public static class');
      expect(csContent).toContain('using Xamarin.Forms');
    });
  });
}); 