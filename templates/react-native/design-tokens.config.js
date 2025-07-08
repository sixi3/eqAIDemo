// Design Tokens Sync Configuration for React Native
// This configuration optimizes token generation for React Native projects

export default {
  // Figma configuration
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
    // React Native specific node collections
    nodeQueries: [
      'Mobile/Components',
      'Mobile/Colors',
      'Mobile/Typography',
      'Mobile/Spacing',
      'Mobile/Shadows'
    ]
  },

  // Token processing for mobile
  processing: {
    // Convert rem to dp/pt for mobile
    transformUnits: {
      rem: { multiply: 16, unit: 'dp' },
      px: { multiply: 1, unit: 'dp' }
    },
    
    // Mobile-specific color processing
    colors: {
      // Support for dark mode variants
      generateDarkMode: true,
      // Platform-specific color formats
      formats: ['hex', 'rgba']
    },

    // Typography optimizations for mobile
    typography: {
      // Scale factors for different screen densities
      scaleFactors: {
        small: 0.85,
        medium: 1.0,
        large: 1.15
      },
      // Platform fonts mapping
      fontMapping: {
        ios: {
          sans: 'San Francisco',
          serif: 'New York',
          mono: 'SF Mono'
        },
        android: {
          sans: 'Roboto',
          serif: 'Noto Serif',
          mono: 'Roboto Mono'
        }
      }
    }
  },

  // Output configuration for React Native
  output: {
    // React Native JavaScript/TypeScript
    reactNative: {
      path: 'src/styles/tokens.js',
      format: 'js', // or 'ts' for TypeScript
      includeTypeDefinitions: true,
      exportFormat: 'named' // or 'default'
    },

    // TypeScript definitions
    typescript: {
      path: 'src/types/tokens.d.ts',
      generateInterfaces: true,
      strictTypes: true
    },

    // Platform-specific outputs
    ios: {
      path: 'ios/DesignTokens/Colors.swift',
      generateExtensions: true,
      includeUIKit: true
    },

    android: {
      path: 'android/app/src/main/res/values/colors.xml',
      generateStyles: true,
      includeMaterialDesign: true
    }
  },

  // Watch configuration for development
  watch: {
    enabled: true,
    // React Native Metro bundler integration
    metroIntegration: true,
    // Hot reload support
    hotReload: true
  },

  // Validation rules for mobile
  validation: {
    colors: {
      // Ensure sufficient contrast for mobile screens
      minimumContrast: 4.5,
      // Check for platform-specific color requirements
      platformCompatibility: true
    },
    
    typography: {
      // Mobile-friendly font size ranges
      minimumFontSize: 12,
      maximumFontSize: 72,
      // Check for platform font availability
      validateFontAvailability: true
    },

    spacing: {
      // Touch-friendly minimum sizes
      minimumTouchTarget: 44, // iOS HIG recommendation
      // Ensure values work well on different screen densities
      densityOptimization: true
    }
  },

  // React Native specific features
  reactNative: {
    // NativeWind/Tailwind CSS support
    nativeWind: {
      enabled: true,
      generateUtilities: true,
      configPath: 'tailwind.config.js'
    },

    // Expo integration
    expo: {
      enabled: true,
      generateTheme: true,
      configPath: 'app.config.js'
    },

    // Platform-specific overrides
    platformOverrides: {
      ios: {
        // iOS-specific token adjustments
        shadows: 'native', // Use native iOS shadows
        borderRadius: 'clamp' // Clamp to iOS supported values
      },
      android: {
        // Android-specific token adjustments
        elevation: true, // Convert shadows to elevation
        rippleEffects: true // Generate ripple color variants
      }
    },

    // Performance optimizations
    performance: {
      // Lazy load large token sets
      lazyLoading: true,
      // Bundle size optimization
      treeShaking: true,
      // Runtime optimization
      memoization: true
    }
  }
}; 