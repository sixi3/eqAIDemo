// Design Tokens Sync Configuration for Flutter
// Optimized for Flutter Material Design and Cupertino widgets

export default {
  // Figma configuration
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
    // Flutter-specific design system nodes
    nodeQueries: [
      'Flutter/Material',
      'Flutter/Cupertino',
      'Flutter/Colors',
      'Flutter/Typography',
      'Flutter/Spacing'
    ]
  },

  // Flutter-specific processing
  processing: {
    // Unit conversion for Flutter logical pixels
    transformUnits: {
      rem: { multiply: 16, unit: 'logical' },
      px: { multiply: 1, unit: 'logical' }
    },

    // Flutter color system
    colors: {
      // Material Design 3 compatibility
      materialDesign3: true,
      // Generate Material color schemes
      generateColorSchemes: true,
      // Support for adaptive colors
      adaptiveColors: true
    },

    // Typography for Flutter Text themes
    typography: {
      // Material Design text scale
      materialTextScale: true,
      // Generate TextTheme
      generateTextTheme: true,
      // Font weight mapping
      fontWeightMapping: {
        thin: 'FontWeight.w100',
        light: 'FontWeight.w300',
        regular: 'FontWeight.w400',
        medium: 'FontWeight.w500',
        semibold: 'FontWeight.w600',
        bold: 'FontWeight.w700',
        black: 'FontWeight.w900'
      }
    }
  },

  // Output configuration
  output: {
    // Main Flutter tokens file
    flutter: {
      path: 'lib/design_tokens/app_tokens.dart',
      generateTheme: true,
      includeExtensions: true
    },

    // Separate files for organization
    colors: {
      path: 'lib/design_tokens/app_colors.dart',
      generateMaterialColorSwatch: true
    },

    typography: {
      path: 'lib/design_tokens/app_text_styles.dart',
      generateTextTheme: true
    },

    spacing: {
      path: 'lib/design_tokens/app_spacing.dart',
      generateEdgeInsets: true
    }
  },

  // Flutter-specific features
  flutter: {
    // Material Design integration
    materialDesign: {
      enabled: true,
      version: 3, // Material Design 3
      generateColorScheme: true,
      generateTextTheme: true
    },

    // Cupertino (iOS) design integration
    cupertino: {
      enabled: true,
      generateCupertinoColors: true,
      generateCupertinoTextTheme: true
    },

    // Theme generation
    theme: {
      // Generate light and dark themes
      generateLightTheme: true,
      generateDarkTheme: true,
      // Adaptive theme support
      adaptiveTheme: true,
      // Custom theme extensions
      generateExtensions: true
    },

    // Widget-specific tokens
    widgets: {
      // Button themes
      buttons: {
        generateElevatedButton: true,
        generateTextButton: true,
        generateOutlinedButton: true
      },
      
      // Input decoration themes
      inputs: {
        generateInputDecoration: true,
        generateTextField: true
      },

      // App bar themes
      appBar: {
        generateAppBarTheme: true,
        generateSliverAppBar: true
      }
    },

    // Platform-specific optimizations
    platforms: {
      // Android Material optimizations
      android: {
        useMaterial3: true,
        generateRippleColors: true,
        generateElevation: true
      },

      // iOS Cupertino optimizations
      ios: {
        useCupertinoColors: true,
        generateBlurEffects: true,
        useSystemFonts: true
      }
    }
  },

  // Validation for Flutter
  validation: {
    colors: {
      // Material Design color requirements
      materialCompliance: true,
      // Accessibility compliance
      contrastRatio: 4.5
    },

    typography: {
      // Flutter text scale compliance
      textScaleCompliance: true,
      // Material typography scale
      materialTypographyScale: true
    }
  },

  // Development features
  development: {
    // Hot reload support
    hotReload: true,
    // Widget inspector integration
    widgetInspector: true,
    // Development overlay
    debugOverlay: true
  }
}; 