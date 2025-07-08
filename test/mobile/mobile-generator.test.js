import { FileGenerator } from '../../src/core/FileGenerator.js';
import fs from 'fs-extra';
import path from 'path';

describe('Mobile Platform Generators', () => {
  let generator;
  let testTokens;
  let testDir;

  beforeEach(async () => {
    suppressConsole();
    
    generator = new FileGenerator();
    
    // Create test directory
    testDir = path.join(global.TEST_TMP_DIR, `mobile-test-${Date.now()}`);
    await fs.ensureDir(testDir);

    // Sample tokens for testing
    testTokens = {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        secondary: {
          500: '#6b7280'
        },
        neutral: {
          50: '#f9fafb',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af'
        }
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem'
      },
      typography: {
        fontFamily: {
          sans: 'Inter, system-ui, sans-serif',
          serif: 'Georgia, serif',
          mono: 'Menlo, monospace'
        },
        fontSize: {
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    };
  });

  afterEach(async () => {
    restoreConsole();
    await fs.remove(testDir);
  });

  describe('React Native Generator', () => {
    test('should generate React Native tokens with proper structure', async () => {
      const outputPath = path.join(testDir, 'tokens.js');
      const result = await generator.generateReactNative(testTokens, outputPath);

      expect(result).toBeDefined();
      expect(result.path).toBe(outputPath);
      expect(result.content).toBeDefined();

      // Check file was created
      expect(await fs.pathExists(outputPath)).toBe(true);
      
      // Read and verify content
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check imports
      expect(content).toContain("import { StyleSheet, Dimensions } from 'react-native'");
      
      // Check colors export
      expect(content).toContain('export const colors = {');
      expect(content).toContain("primary: {");
      expect(content).toContain("50: '#eff6ff'");
      expect(content).toContain("500: '#3b82f6'");
      
      // Check spacing conversion to numbers
      expect(content).toContain('export const spacing = {');
      expect(content).toContain('1: 4,'); // 0.25rem * 16 = 4
      expect(content).toContain('4: 16,'); // 1rem * 16 = 16
      
      // Check typography
      expect(content).toContain('export const typography = {');
      expect(content).toContain('fontFamily: {');
      expect(content).toContain("sans: 'Inter, system-ui, sans-serif'");
      
      // Check StyleSheet creation
      expect(content).toContain('export const styles = StyleSheet.create({');
      expect(content).toContain('container: {');
      expect(content).toContain('flex: 1,');
      
      // Check default export
      expect(content).toContain('export default {');
      expect(content).toContain('colors,');
      expect(content).toContain('styles,');
    });

    test('should handle missing token categories gracefully', async () => {
      const minimalTokens = {
        colors: {
          primary: { 500: '#3b82f6' }
        }
      };
      
      const outputPath = path.join(testDir, 'minimal-tokens.js');
      const result = await generator.generateReactNative(minimalTokens, outputPath);
      
      const content = await fs.readFile(outputPath, 'utf8');
      
      expect(content).toContain('export const colors = {');
      expect(content).not.toContain('export const spacing = {');
      expect(content).not.toContain('export const typography = {');
    });

    test('should convert units correctly for React Native', () => {
      // Test rem conversion
      expect(generator.convertToRNValue('1rem')).toBe(16);
      expect(generator.convertToRNValue('2.5rem')).toBe(40);
      
      // Test px conversion
      expect(generator.convertToRNValue('24px')).toBe(24);
      expect(generator.convertToRNValue('12px')).toBe(12);
      
      // Test percentage (should remain string)
      expect(generator.convertToRNValue('50%')).toBe("'50%'");
      
      // Test numbers
      expect(generator.convertToRNValue(16)).toBe(16);
      expect(generator.convertToRNValue('16')).toBe(16);
    });

    test('should convert CSS shadows to React Native shadow objects', () => {
      const shadow = generator.convertToRNShadow('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      
      expect(shadow).toEqual({
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
      });
    });
  });

  describe('Expo Generator', () => {
    test('should generate Expo-compatible tokens', async () => {
      const outputPath = path.join(testDir, 'expo-tokens.js');
      const result = await generator.generateExpo(testTokens, outputPath);

      expect(result).toBeDefined();
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check Expo-specific features
      expect(content).toContain('// Compatible with Expo Router and NativeWind');
      expect(content).toContain('export const theme = {');
      expect(content).toContain('light: {');
      expect(content).toContain('dark: {');
      
      // Check NativeWind compatibility
      expect(content).toContain('export const nativeWindColors = {');
      expect(content).toContain("'primary-50': '#eff6ff'");
      expect(content).toContain("'primary-500': '#3b82f6'");
      
      // Check theme helper function
      expect(content).toContain('export const getThemeColors = (colorScheme = \'light\') => {');
    });
  });

  describe('Flutter Generator', () => {
    test('should generate Flutter Dart classes', async () => {
      const outputPath = path.join(testDir, 'app_tokens.dart');
      const result = await generator.generateFlutter(testTokens, outputPath);

      expect(result).toBeDefined();
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check imports
      expect(content).toContain("import 'package:flutter/material.dart';");
      
      // Check color class
      expect(content).toContain('class AppColors {');
      expect(content).toContain('static const Color primary50 = Color(0xFFEFF6FF);');
      expect(content).toContain('static const Color primary500 = Color(0xFF3B82F6);');
      
      // Check spacing class
      expect(content).toContain('class AppSpacing {');
      expect(content).toContain('static const double spacing1 = 4.0;'); // 0.25rem * 16
      
      // Check text styles
      expect(content).toContain('class AppTextStyles {');
      expect(content).toContain("static const String defaultFontFamily = 'Inter, system-ui, sans-serif';");
      
      // Check theme data
      expect(content).toContain('class AppTheme {');
      expect(content).toContain('static ThemeData get lightTheme {');
      expect(content).toContain('useMaterial3: true,');
    });

    test('should convert hex colors to Flutter Color format', () => {
      expect(generator.hexToFlutterColor('#ff0000')).toBe('Color(0xFFFF0000)');
      expect(generator.hexToFlutterColor('#3b82f6')).toBe('Color(0xFF3B82F6)');
      expect(generator.hexToFlutterColor('invalid')).toBe('Colors.black');
    });

    test('should convert CSS values to Flutter values', () => {
      expect(generator.convertToFlutterValue('1rem')).toBe('16.0');
      expect(generator.convertToFlutterValue('24px')).toBe('24.0');
      expect(generator.convertToFlutterValue(16)).toBe('16.0');
      expect(generator.convertToFlutterValue('invalid')).toBe('0.0');
    });
  });

  describe('iOS Swift Generator', () => {
    test('should generate iOS Swift extensions', async () => {
      const outputPath = path.join(testDir, 'Colors.swift');
      const result = await generator.generateIOS(testTokens, outputPath);

      expect(result).toBeDefined();
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check Swift structure
      expect(content).toContain('// Design Tokens - Auto-generated Swift Colors');
      expect(content).toContain('import UIKit');
      expect(content).toContain('extension UIColor {');
      
      // Check color definitions
      expect(content).toContain('static let primary50 = UIColor(hex: "#eff6ff")');
      expect(content).toContain('static let primary500 = UIColor(hex: "#3b82f6")');
      expect(content).toContain('static let secondary500 = UIColor(hex: "#6b7280")');
    });
  });

  describe('Android XML Generator', () => {
    test('should generate Android XML resources', async () => {
      const outputPath = path.join(testDir, 'colors.xml');
      const result = await generator.generateAndroid(testTokens, outputPath);

      expect(result).toBeDefined();
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check XML structure
      expect(content).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(content).toContain('<!-- Design Tokens - Auto-generated Android Colors -->');
      expect(content).toContain('<resources>');
      expect(content).toContain('</resources>');
      
      // Check color definitions
      expect(content).toContain('<color name="primary_50">#eff6ff</color>');
      expect(content).toContain('<color name="primary_500">#3b82f6</color>');
      expect(content).toContain('<color name="secondary_500">#6b7280</color>');
    });
  });

  describe('Xamarin C# Generator', () => {
    test('should generate Xamarin C# classes', async () => {
      const outputPath = path.join(testDir, 'AppTokens.cs');
      const result = await generator.generateXamarin(testTokens, outputPath);

      expect(result).toBeDefined();
      const content = await fs.readFile(outputPath, 'utf8');
      
      // Check C# structure
      expect(content).toContain('// Design Tokens - Auto-generated for Xamarin');
      expect(content).toContain('using Xamarin.Forms;');
      
      // Check color class
      expect(content).toContain('public static class AppColors');
      expect(content).toContain('public static Color Primary50 => Color.FromHex("#eff6ff");');
      expect(content).toContain('public static Color Primary500 => Color.FromHex("#3b82f6");');
      
      // Check spacing class
      expect(content).toContain('public static class AppSpacing');
      expect(content).toContain('public static double Spacing1 => 4.0;'); // 0.25rem * 16
      
      // Check fonts class
      expect(content).toContain('public static class AppFonts');
      expect(content).toContain('public static string SansFontFamily => "Inter, system-ui, sans-serif";');
    });

    test('should convert CSS values to Xamarin values', () => {
      expect(generator.convertToXamarinValue('1rem')).toBe('16.0');
      expect(generator.convertToXamarinValue('24px')).toBe('24.0');
      expect(generator.convertToXamarinValue(16)).toBe('16.0');
      expect(generator.convertToXamarinValue('invalid')).toBe('0.0');
    });
  });

  describe('File Generation Integration', () => {
    test('should generate all mobile platforms simultaneously', async () => {
      const config = {
        output: {
          reactNative: path.join(testDir, 'tokens.js'),
          expo: path.join(testDir, 'expo-tokens.js'),
          flutter: path.join(testDir, 'app_tokens.dart'),
          ios: path.join(testDir, 'Colors.swift'),
          android: path.join(testDir, 'colors.xml'),
          xamarin: path.join(testDir, 'AppTokens.cs')
        }
      };

      const results = await generator.generateAll(testTokens, config);

      // Check all platforms were generated
      expect(results.reactNative).toBeDefined();
      expect(results.expo).toBeDefined();
      expect(results.flutter).toBeDefined();
      expect(results.ios).toBeDefined();
      expect(results.android).toBeDefined();
      expect(results.xamarin).toBeDefined();

      // Check all files exist
      expect(await fs.pathExists(config.output.reactNative)).toBe(true);
      expect(await fs.pathExists(config.output.expo)).toBe(true);
      expect(await fs.pathExists(config.output.flutter)).toBe(true);
      expect(await fs.pathExists(config.output.ios)).toBe(true);
      expect(await fs.pathExists(config.output.android)).toBe(true);
      expect(await fs.pathExists(config.output.xamarin)).toBe(true);
    });

    test('should create output directories if they do not exist', async () => {
      const nestedPath = path.join(testDir, 'nested', 'deep', 'tokens.js');
      const result = await generator.generateReactNative(testTokens, nestedPath);

      expect(result).toBeDefined();
      expect(await fs.pathExists(nestedPath)).toBe(true);
      expect(await fs.pathExists(path.dirname(nestedPath))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid tokens gracefully', async () => {
      const invalidTokens = null;
      const outputPath = path.join(testDir, 'invalid.js');

      await expect(generator.generateReactNative(invalidTokens, outputPath)).resolves.not.toThrow();
    });

    test('should handle empty tokens object', async () => {
      const emptyTokens = {};
      const outputPath = path.join(testDir, 'empty.js');
      
      const result = await generator.generateReactNative(emptyTokens, outputPath);
      expect(result).toBeDefined();
      
      const content = await fs.readFile(outputPath, 'utf8');
      expect(content).toContain('// Design Tokens - Auto-generated for React Native');
    });
  });
}); 