import fs from 'fs-extra';
import path from 'path';

/**
 * File generation engine
 * Generates CSS, Tailwind, TypeScript, and other output formats from design tokens
 */
export class FileGenerator {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Generate all configured output files
   */
  async generateAll(tokens, config) {
    const results = {};

    // Generate CSS custom properties
    if (config.output.css) {
      results.css = await this.generateCSS(tokens, config.output.css);
    }

    // Generate Tailwind config
    if (config.output.tailwind) {
      results.tailwind = await this.generateTailwindConfig(tokens, config.output.tailwind);
    }

    // Generate TypeScript definitions
    if (config.output.typescript) {
      results.typescript = await this.generateTypeScript(tokens, config.output.typescript);
    }

    // Generate SCSS variables
    if (config.output.scss) {
      results.scss = await this.generateSCSS(tokens, config.output.scss);
    }

    // Mobile platform outputs
    if (config.output.reactNative) {
      results.reactNative = await this.generateReactNative(tokens, config.output.reactNative);
    }

    if (config.output.expo) {
      results.expo = await this.generateExpo(tokens, config.output.expo);
    }

    if (config.output.flutter) {
      results.flutter = await this.generateFlutter(tokens, config.output.flutter);
    }

    if (config.output.ios) {
      results.ios = await this.generateIOS(tokens, config.output.ios);
    }

    if (config.output.android) {
      results.android = await this.generateAndroid(tokens, config.output.android);
    }

    if (config.output.xamarin) {
      results.xamarin = await this.generateXamarin(tokens, config.output.xamarin);
    }

    return results;
  }

  /**
   * Generate CSS custom properties file
   */
  async generateCSS(tokens, outputPath) {
    const css = this.generateCSSCustomProperties(tokens);
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, css);
    
    console.log(`✅ Generated CSS: ${outputPath}`);
    return { path: outputPath, content: css };
  }

  /**
   * Generate CSS custom properties string
   */
  generateCSSCustomProperties(tokens) {
    const cssVars = [];
    
    // Header comment
    cssVars.push('/* Design Tokens - Auto-generated */');
    cssVars.push('/* Do not edit this file manually */');
    cssVars.push('');
    cssVars.push(':root {');

    // Colors
    if (tokens.colors) {
      cssVars.push('  /* Colors */');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            cssVars.push(`  --color-${category}-${shade}: ${value};`);
          });
        }
      });
      cssVars.push('');
    }

    // Spacing
    if (tokens.spacing) {
      cssVars.push('  /* Spacing */');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        cssVars.push(`  --spacing-${key}: ${value};`);
      });
      cssVars.push('');
    }

    // Border Radius
    if (tokens.borderRadius) {
      cssVars.push('  /* Border Radius */');
      Object.entries(tokens.borderRadius).forEach(([key, value]) => {
        cssVars.push(`  --border-radius-${key}: ${value};`);
      });
      cssVars.push('');
    }

    // Typography
    if (tokens.typography) {
      cssVars.push('  /* Typography */');
      Object.entries(tokens.typography).forEach(([category, values]) => {
        if (values && typeof values === 'object') {
          Object.entries(values).forEach(([key, value]) => {
            cssVars.push(`  --typography-${category}-${key}: ${value};`);
          });
        }
      });
      cssVars.push('');
    }

    // Shadows
    if (tokens.shadows) {
      cssVars.push('  /* Shadows */');
      Object.entries(tokens.shadows).forEach(([key, value]) => {
        cssVars.push(`  --shadow-${key}: ${value};`);
      });
      cssVars.push('');
    }

    // Opacity
    if (tokens.opacity) {
      cssVars.push('  /* Opacity */');
      Object.entries(tokens.opacity).forEach(([key, value]) => {
        cssVars.push(`  --opacity-${key}: ${value};`);
      });
      cssVars.push('');
    }

    // Z-Index
    if (tokens.zIndex) {
      cssVars.push('  /* Z-Index */');
      Object.entries(tokens.zIndex).forEach(([key, value]) => {
        cssVars.push(`  --z-index-${key}: ${value};`);
      });
      cssVars.push('');
    }

    // Transitions
    if (tokens.transitions) {
      cssVars.push('  /* Transitions */');
      if (tokens.transitions.duration) {
        Object.entries(tokens.transitions.duration).forEach(([key, value]) => {
          cssVars.push(`  --transition-duration-${key}: ${value};`);
        });
      }
      if (tokens.transitions.easing) {
        Object.entries(tokens.transitions.easing).forEach(([key, value]) => {
          cssVars.push(`  --transition-easing-${key}: ${value};`);
        });
      }
      cssVars.push('');
    }

    // Breakpoints
    if (tokens.breakpoints) {
      cssVars.push('  /* Breakpoints */');
      Object.entries(tokens.breakpoints).forEach(([key, value]) => {
        cssVars.push(`  --breakpoint-${key}: ${value};`);
      });
      cssVars.push('');
    }

    cssVars.push('}');
    cssVars.push('');

    // Add utility classes
    cssVars.push('/* Utility Classes */');
    
    // Text colors
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.keys(shades).forEach(shade => {
            cssVars.push(`.text-${category}-${shade} { color: var(--color-${category}-${shade}); }`);
          });
        }
      });
    }

    return cssVars.join('\n');
  }

  /**
   * Generate Tailwind configuration
   */
  async generateTailwindConfig(tokens, outputPath) {
    const configContent = this.generateTailwindConfigContent(tokens);
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, configContent);
    
    console.log(`✅ Generated Tailwind config: ${outputPath}`);
    return { path: outputPath, content: configContent };
  }

  /**
   * Generate Tailwind configuration content
   */
  generateTailwindConfigContent(tokens) {
    const config = {
      theme: {
        extend: {}
      }
    };

    // Colors
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      config.theme.extend.colors = tokens.colors;
    }

    // Spacing
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      config.theme.extend.spacing = tokens.spacing;
    }

    // Border Radius
    if (tokens.borderRadius && Object.keys(tokens.borderRadius).length > 0) {
      config.theme.extend.borderRadius = tokens.borderRadius;
    }

    // Typography
    if (tokens.typography) {
      if (tokens.typography.fontFamily && Object.keys(tokens.typography.fontFamily).length > 0) {
        config.theme.extend.fontFamily = tokens.typography.fontFamily;
      }
      if (tokens.typography.fontSize && Object.keys(tokens.typography.fontSize).length > 0) {
        config.theme.extend.fontSize = tokens.typography.fontSize;
      }
      if (tokens.typography.fontWeight && Object.keys(tokens.typography.fontWeight).length > 0) {
        config.theme.extend.fontWeight = tokens.typography.fontWeight;
      }
      if (tokens.typography.lineHeight && Object.keys(tokens.typography.lineHeight).length > 0) {
        config.theme.extend.lineHeight = tokens.typography.lineHeight;
      }
      if (tokens.typography.letterSpacing && Object.keys(tokens.typography.letterSpacing).length > 0) {
        config.theme.extend.letterSpacing = tokens.typography.letterSpacing;
      }
    }

    // Shadows
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      config.theme.extend.boxShadow = tokens.shadows;
    }

    // Opacity
    if (tokens.opacity && Object.keys(tokens.opacity).length > 0) {
      config.theme.extend.opacity = tokens.opacity;
    }

    // Z-Index
    if (tokens.zIndex && Object.keys(tokens.zIndex).length > 0) {
      config.theme.extend.zIndex = tokens.zIndex;
    }

    // Transitions
    if (tokens.transitions) {
      if (tokens.transitions.duration && Object.keys(tokens.transitions.duration).length > 0) {
        config.theme.extend.transitionDuration = tokens.transitions.duration;
      }
      if (tokens.transitions.easing && Object.keys(tokens.transitions.easing).length > 0) {
        config.theme.extend.transitionTimingFunction = tokens.transitions.easing;
      }
    }

    // Breakpoints
    if (tokens.breakpoints && Object.keys(tokens.breakpoints).length > 0) {
      config.theme.extend.screens = tokens.breakpoints;
    }

    const configString = `/** @type {import('tailwindcss').Config} */
// Design Tokens - Auto-generated Tailwind Configuration
// Do not edit this file manually

export default ${JSON.stringify(config, null, 2)};
`;

    return configString;
  }

  /**
   * Generate TypeScript definitions
   */
  async generateTypeScript(tokens, outputPath) {
    const typeDefinitions = this.generateTypeDefinitions(tokens);
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, typeDefinitions);
    
    console.log(`✅ Generated TypeScript definitions: ${outputPath}`);
    return { path: outputPath, content: typeDefinitions };
  }

  /**
   * Generate TypeScript type definitions
   */
  generateTypeDefinitions(tokens) {
    const types = [];
    
    types.push('// Design Tokens - Auto-generated TypeScript Definitions');
    types.push('// Do not edit this file manually');
    types.push('');

    // Generate interfaces for each token category
    if (tokens.colors) {
      types.push('export interface Colors {');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          types.push(`  ${category}: {`);
          Object.keys(shades).forEach(shade => {
            types.push(`    "${shade}": string;`);
          });
          types.push('  };');
        }
      });
      types.push('}');
      types.push('');
    }

    if (tokens.spacing) {
      types.push('export interface Spacing {');
      Object.keys(tokens.spacing).forEach(key => {
        types.push(`  "${key}": string;`);
      });
      types.push('}');
      types.push('');
    }

    if (tokens.typography) {
      types.push('export interface Typography {');
      Object.entries(tokens.typography).forEach(([category, values]) => {
        if (values && typeof values === 'object') {
          types.push(`  ${category}: {`);
          Object.keys(values).forEach(key => {
            types.push(`    "${key}": string;`);
          });
          types.push('  };');
        }
      });
      types.push('}');
      types.push('');
    }

    // Main design tokens interface
    types.push('export interface DesignTokens {');
    if (tokens.colors) types.push('  colors: Colors;');
    if (tokens.spacing) types.push('  spacing: Spacing;');
    if (tokens.typography) types.push('  typography: Typography;');
    if (tokens.borderRadius) types.push('  borderRadius: Record<string, string>;');
    if (tokens.shadows) types.push('  shadows: Record<string, string>;');
    if (tokens.opacity) types.push('  opacity: Record<string, string>;');
    if (tokens.zIndex) types.push('  zIndex: Record<string, number>;');
    if (tokens.transitions) {
      types.push('  transitions: {');
      types.push('    duration: Record<string, string>;');
      types.push('    easing: Record<string, string>;');
      types.push('  };');
    }
    if (tokens.breakpoints) types.push('  breakpoints: Record<string, string>;');
    types.push('  source: string;');
    types.push('  lastLoaded: string;');
    types.push('}');
    types.push('');

    // Export token constants
    types.push('// Token value constants');
    types.push('declare const tokens: DesignTokens;');
    types.push('export default tokens;');

    return types.join('\n');
  }

  /**
   * Generate SCSS variables
   */
  async generateSCSS(tokens, outputPath) {
    const scss = this.generateSCSSVariables(tokens);
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, scss);
    
    console.log(`✅ Generated SCSS: ${outputPath}`);
    return { path: outputPath, content: scss };
  }

  /**
   * Generate SCSS variables string
   */
  generateSCSSVariables(tokens) {
    const scss = [];
    
    scss.push('// Design Tokens - Auto-generated SCSS Variables');
    scss.push('// Do not edit this file manually');
    scss.push('');

    // Colors
    if (tokens.colors) {
      scss.push('// Colors');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            scss.push(`$color-${category}-${shade}: ${value};`);
          });
        }
      });
      scss.push('');
    }

    // Spacing
    if (tokens.spacing) {
      scss.push('// Spacing');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        scss.push(`$spacing-${key}: ${value};`);
      });
      scss.push('');
    }

    // Typography
    if (tokens.typography) {
      scss.push('// Typography');
      Object.entries(tokens.typography).forEach(([category, values]) => {
        if (values && typeof values === 'object') {
          Object.entries(values).forEach(([key, value]) => {
            scss.push(`$typography-${category}-${key}: ${value};`);
          });
        }
      });
      scss.push('');
    }

    // Other categories
    ['borderRadius', 'shadows', 'opacity', 'zIndex'].forEach(category => {
      if (tokens[category]) {
        scss.push(`// ${category.charAt(0).toUpperCase() + category.slice(1)}`);
        Object.entries(tokens[category]).forEach(([key, value]) => {
          const variableName = this.kebabCase(category);
          scss.push(`$${variableName}-${key}: ${value};`);
        });
        scss.push('');
      }
    });

    // Transitions
    if (tokens.transitions) {
      scss.push('// Transitions');
      if (tokens.transitions.duration) {
        Object.entries(tokens.transitions.duration).forEach(([key, value]) => {
          scss.push(`$transition-duration-${key}: ${value};`);
        });
      }
      if (tokens.transitions.easing) {
        Object.entries(tokens.transitions.easing).forEach(([key, value]) => {
          scss.push(`$transition-easing-${key}: ${value};`);
        });
      }
      scss.push('');
    }

    // Breakpoints
    if (tokens.breakpoints) {
      scss.push('// Breakpoints');
      Object.entries(tokens.breakpoints).forEach(([key, value]) => {
        scss.push(`$breakpoint-${key}: ${value};`);
      });
      scss.push('');
    }

    return scss.join('\n');
  }

  /**
   * Generate platform-specific formats
   */
  async generateIOS(tokens, outputPath) {
    // iOS color definitions
    const swift = this.generateSwiftColors(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, swift);
    
    console.log(`✅ Generated iOS Swift: ${outputPath}`);
    return { path: outputPath, content: swift };
  }

  async generateAndroid(tokens, outputPath) {
    // Android XML resources
    const xml = this.generateAndroidXML(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, xml);
    
    console.log(`✅ Generated Android XML: ${outputPath}`);
    return { path: outputPath, content: xml };
  }

  /**
   * Generate React Native StyleSheet
   */
  async generateReactNative(tokens, outputPath) {
    const js = this.generateReactNativeJS(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, js);
    
    console.log(`✅ Generated React Native: ${outputPath}`);
    return { path: outputPath, content: js };
  }

  /**
   * Generate Expo-compatible tokens
   */
  async generateExpo(tokens, outputPath) {
    const js = this.generateExpoJS(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, js);
    
    console.log(`✅ Generated Expo tokens: ${outputPath}`);
    return { path: outputPath, content: js };
  }

  /**
   * Generate Flutter Dart file
   */
  async generateFlutter(tokens, outputPath) {
    const dart = this.generateFlutterDart(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, dart);
    
    console.log(`✅ Generated Flutter Dart: ${outputPath}`);
    return { path: outputPath, content: dart };
  }

  /**
   * Generate Xamarin C# file
   */
  async generateXamarin(tokens, outputPath) {
    const csharp = this.generateXamarinCSharp(tokens);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, csharp);
    
    console.log(`✅ Generated Xamarin C#: ${outputPath}`);
    return { path: outputPath, content: csharp };
  }

  /**
   * Utility methods
   */
  kebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  generateSwiftColors(tokens) {
    const swift = [];
    swift.push('// Design Tokens - Auto-generated Swift Colors');
    swift.push('import UIKit');
    swift.push('');
    swift.push('extension UIColor {');
    
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            if (value.startsWith('#')) {
              swift.push(`    static let ${category}${shade.charAt(0).toUpperCase() + shade.slice(1)} = UIColor(hex: "${value}")`);
            }
          });
        }
      });
    }
    
    swift.push('}');
    return swift.join('\n');
  }

  generateAndroidXML(tokens) {
    const xml = [];
    xml.push('<?xml version="1.0" encoding="utf-8"?>');
    xml.push('<!-- Design Tokens - Auto-generated Android Colors -->');
    xml.push('<resources>');
    
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            if (value.startsWith('#')) {
              xml.push(`    <color name="${category}_${shade}">${value}</color>`);
            }
          });
        }
      });
    }
    
    xml.push('</resources>');
    return xml.join('\n');
  }

  /**
   * React Native JavaScript generation
   */
  generateReactNativeJS(tokens) {
    // Handle null or undefined tokens
    if (!tokens || typeof tokens !== 'object') {
      tokens = {};
    }
    
    const js = [];
    js.push('// Design Tokens - Auto-generated for React Native');
    js.push('// Do not edit this file manually');
    js.push('');
    js.push('import { StyleSheet, Dimensions } from \'react-native\';');
    js.push('');

    // Get screen dimensions for responsive values
    js.push('const { width: screenWidth, height: screenHeight } = Dimensions.get(\'window\');');
    js.push('');

    // Colors object
    if (tokens.colors) {
      js.push('export const colors = {');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          js.push(`  ${category}: {`);
          Object.entries(shades).forEach(([shade, value]) => {
            js.push(`    ${shade}: '${value}',`);
          });
          js.push('  },');
        }
      });
      js.push('};');
      js.push('');
    }

    // Spacing (converted to numbers for React Native)
    if (tokens.spacing) {
      js.push('export const spacing = {');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        const numValue = this.convertToRNValue(value);
        js.push(`  ${key}: ${numValue},`);
      });
      js.push('};');
      js.push('');
    }

    // Typography
    if (tokens.typography) {
      js.push('export const typography = {');
      
      if (tokens.typography.fontFamily) {
        js.push('  fontFamily: {');
        Object.entries(tokens.typography.fontFamily).forEach(([key, value]) => {
          js.push(`    ${key}: '${value}',`);
        });
        js.push('  },');
      }

      if (tokens.typography.fontSize) {
        js.push('  fontSize: {');
        Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
          const numValue = this.convertToRNValue(value);
          js.push(`    ${key}: ${numValue},`);
        });
        js.push('  },');
      }

      if (tokens.typography.fontWeight) {
        js.push('  fontWeight: {');
        Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
          js.push(`    ${key}: '${value}',`);
        });
        js.push('  },');
      }

      js.push('};');
      js.push('');
    }

    // Border radius
    if (tokens.borderRadius) {
      js.push('export const borderRadius = {');
      Object.entries(tokens.borderRadius).forEach(([key, value]) => {
        const numValue = this.convertToRNValue(value);
        js.push(`  ${key}: ${numValue},`);
      });
      js.push('};');
      js.push('');
    }

    // Shadows for React Native
    if (tokens.shadows) {
      js.push('export const shadows = {');
      Object.entries(tokens.shadows).forEach(([key, value]) => {
        const rnShadow = this.convertToRNShadow(value);
        js.push(`  ${key}: ${JSON.stringify(rnShadow)},`);
      });
      js.push('};');
      js.push('');
    }

    // Common StyleSheet
    js.push('export const styles = StyleSheet.create({');
    js.push('  container: {');
    js.push('    flex: 1,');
    js.push('  },');
    js.push('  card: {');
    js.push('    backgroundColor: colors.neutral?.[50] || \'#ffffff\',');
    js.push('    borderRadius: borderRadius?.md || 8,');
    js.push('    padding: spacing?.[4] || 16,');
    js.push('    ...shadows?.md || {},');
    js.push('  },');
    js.push('});');
    js.push('');

    // Default export
    js.push('export default {');
    js.push('  colors,');
    if (tokens.spacing) js.push('  spacing,');
    if (tokens.typography) js.push('  typography,');
    if (tokens.borderRadius) js.push('  borderRadius,');
    if (tokens.shadows) js.push('  shadows,');
    js.push('  styles,');
    js.push('};');

    return js.join('\n');
  }

  /**
   * Expo-specific generation with theme support
   */
  generateExpoJS(tokens) {
    const js = [];
    js.push('// Design Tokens - Auto-generated for Expo');
    js.push('// Compatible with Expo Router and NativeWind');
    js.push('');
    js.push('import { StyleSheet } from \'react-native\';');
    js.push('');

    // Expo theme object
    js.push('export const theme = {');
    js.push('  light: {');
    
    if (tokens.colors) {
      js.push('    colors: {');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            js.push(`      ${category}${shade}: '${value}',`);
          });
        }
      });
      js.push('    },');
    }

    js.push('  },');
    js.push('  dark: {');
    js.push('    // Dark theme variants (customize as needed)');
    js.push('    colors: {');
    js.push('      // Add dark mode colors here');
    js.push('    },');
    js.push('  },');
    js.push('};');
    js.push('');

    // NativeWind compatible utilities
    js.push('// NativeWind/Tailwind compatible color utilities');
    js.push('export const nativeWindColors = {');
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          Object.entries(shades).forEach(([shade, value]) => {
            js.push(`  '${category}-${shade}': '${value}',`);
          });
        }
      });
    }
    js.push('};');
    js.push('');

    // Expo Constants integration
    js.push('// Use with Expo Constants for dynamic theming');
    js.push('export const getThemeColors = (colorScheme = \'light\') => {');
    js.push('  return theme[colorScheme]?.colors || theme.light.colors;');
    js.push('};');

    return js.join('\n');
  }

  /**
   * Flutter Dart generation
   */
  generateFlutterDart(tokens) {
    const dart = [];
    dart.push('// Design Tokens - Auto-generated for Flutter');
    dart.push('// Do not edit this file manually');
    dart.push('');
    dart.push('import \'package:flutter/material.dart\';');
    dart.push('');

    // Color class
    if (tokens.colors) {
      dart.push('class AppColors {');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          dart.push(`  // ${category.charAt(0).toUpperCase() + category.slice(1)} colors`);
          Object.entries(shades).forEach(([shade, value]) => {
            if (value.startsWith('#')) {
              const dartColor = this.hexToFlutterColor(value);
              dart.push(`  static const Color ${category}${shade.charAt(0).toUpperCase() + shade.slice(1)} = ${dartColor};`);
            }
          });
          dart.push('');
        }
      });
      dart.push('}');
      dart.push('');
    }

    // Spacing class
    if (tokens.spacing) {
      dart.push('class AppSpacing {');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        const flutterValue = this.convertToFlutterValue(value);
        dart.push(`  static const double spacing${key.charAt(0).toUpperCase() + key.slice(1)} = ${flutterValue};`);
      });
      dart.push('}');
      dart.push('');
    }

    // Typography
    if (tokens.typography) {
      dart.push('class AppTextStyles {');
      const defaultFont = tokens.typography.fontFamily?.sans || 'Roboto';
      dart.push(`  static const String defaultFontFamily = '${defaultFont}';`);
      dart.push('');
      
      if (tokens.typography.fontSize) {
        Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
          const flutterValue = this.convertToFlutterValue(value);
          dart.push(`  static const TextStyle ${key} = TextStyle(`);
          dart.push(`    fontSize: ${flutterValue},`);
          dart.push(`    fontFamily: defaultFontFamily,`);
          dart.push('  );');
          dart.push('');
        });
      }
      dart.push('}');
      dart.push('');
    }

    // Theme data
    dart.push('class AppTheme {');
    dart.push('  static ThemeData get lightTheme {');
    dart.push('    return ThemeData(');
    dart.push('      useMaterial3: true,');
    if (tokens.colors?.primary) {
      dart.push(`      primarySwatch: MaterialColor(0xFF${tokens.colors.primary['500']?.substring(1) || '000000'}, {`);
      Object.entries(tokens.colors.primary).forEach(([shade, value]) => {
        dart.push(`        ${shade}: AppColors.primary${shade.charAt(0).toUpperCase() + shade.slice(1)},`);
      });
      dart.push('      }),');
    }
    dart.push('      fontFamily: AppTextStyles.defaultFontFamily,');
    dart.push('    );');
    dart.push('  }');
    dart.push('}');

    return dart.join('\n');
  }

  /**
   * Xamarin C# generation
   */
  generateXamarinCSharp(tokens) {
    const cs = [];
    cs.push('// Design Tokens - Auto-generated for Xamarin');
    cs.push('// Do not edit this file manually');
    cs.push('');
    cs.push('using Xamarin.Forms;');
    cs.push('');

    // Colors static class
    if (tokens.colors) {
      cs.push('public static class AppColors');
      cs.push('{');
      Object.entries(tokens.colors).forEach(([category, shades]) => {
        if (shades && typeof shades === 'object') {
          cs.push(`    // ${category.charAt(0).toUpperCase() + category.slice(1)} colors`);
          Object.entries(shades).forEach(([shade, value]) => {
            if (value.startsWith('#')) {
              const propName = `${category.charAt(0).toUpperCase() + category.slice(1)}${shade.charAt(0).toUpperCase() + shade.slice(1)}`;
              cs.push(`    public static Color ${propName} => Color.FromHex("${value}");`);
            }
          });
          cs.push('');
        }
      });
      cs.push('}');
      cs.push('');
    }

    // Spacing
    if (tokens.spacing) {
      cs.push('public static class AppSpacing');
      cs.push('{');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        const xamValue = this.convertToXamarinValue(value);
        const propName = `Spacing${key.charAt(0).toUpperCase() + key.slice(1)}`;
        cs.push(`    public static double ${propName} => ${xamValue};`);
      });
      cs.push('}');
      cs.push('');
    }

    // Typography
    if (tokens.typography) {
      cs.push('public static class AppFonts');
      cs.push('{');
      if (tokens.typography.fontFamily) {
        Object.entries(tokens.typography.fontFamily).forEach(([key, value]) => {
          const propName = `${key.charAt(0).toUpperCase() + key.slice(1)}FontFamily`;
          cs.push(`    public static string ${propName} => "${value}";`);
        });
      }
      cs.push('');
      if (tokens.typography.fontSize) {
        Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
          const xamValue = this.convertToXamarinValue(value);
          const propName = `FontSize${key.charAt(0).toUpperCase() + key.slice(1)}`;
          cs.push(`    public static double ${propName} => ${xamValue};`);
        });
      }
      cs.push('}');
    }

    return cs.join('\n');
  }

  /**
   * Utility methods for mobile platforms
   */
  convertToRNValue(cssValue) {
    if (typeof cssValue === 'number') return cssValue;
    if (typeof cssValue !== 'string') return 0;
    
    // Handle rem values (convert to dp/pt for mobile)
    if (cssValue.endsWith('rem')) {
      return parseFloat(cssValue) * 16; // 1rem = 16dp
    }
    
    // Handle px values
    if (cssValue.endsWith('px')) {
      return parseFloat(cssValue);
    }
    
    // Handle percentage
    if (cssValue.endsWith('%')) {
      return `'${cssValue}'`;
    }
    
    // Default numeric value
    const num = parseFloat(cssValue);
    return isNaN(num) ? 0 : num;
  }

  convertToRNShadow(cssValue) {
    // Convert CSS box-shadow to React Native shadow properties
    // Example: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" -> RN shadow object
    const defaultShadow = {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Android
    };

    if (!cssValue || typeof cssValue !== 'string') return defaultShadow;

    // Basic parsing for common shadow formats
    const parts = cssValue.split(' ');
    if (parts.length >= 4) {
      return {
        shadowColor: '#000000',
        shadowOffset: { 
          width: parseFloat(parts[0]) || 0, 
          height: parseFloat(parts[1]) || 2 
        },
        shadowOpacity: 0.1,
        shadowRadius: parseFloat(parts[2]) || 4,
        elevation: Math.abs(parseFloat(parts[1]) || 2),
      };
    }

    return defaultShadow;
  }

  hexToFlutterColor(hex) {
    if (!hex.startsWith('#')) return 'Colors.black';
    const hexValue = hex.substring(1);
    return `Color(0xFF${hexValue.toUpperCase()})`;
  }

  convertToFlutterValue(cssValue) {
    if (typeof cssValue === 'number') return cssValue.toFixed(1);
    if (typeof cssValue !== 'string') return '0.0';
    
    if (cssValue.endsWith('rem')) {
      return (parseFloat(cssValue) * 16).toFixed(1);
    }
    
    if (cssValue.endsWith('px')) {
      return parseFloat(cssValue).toFixed(1);
    }
    
    const num = parseFloat(cssValue);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  }

  convertToXamarinValue(cssValue) {
    if (typeof cssValue === 'number') return cssValue.toFixed(1);
    if (typeof cssValue !== 'string') return '0.0';
    
    if (cssValue.endsWith('rem')) {
      return (parseFloat(cssValue) * 16).toFixed(1);
    }
    
    if (cssValue.endsWith('px')) {
      return parseFloat(cssValue).toFixed(1);
    }
    
    const num = parseFloat(cssValue);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  }
} 