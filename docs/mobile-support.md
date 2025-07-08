# Mobile App Development Support

The design-tokens-sync package provides comprehensive support for mobile app development across multiple platforms and frameworks.

## 🚀 Supported Mobile Platforms

### **React Native** 
- **JavaScript/TypeScript output** optimized for React Native StyleSheet
- **Platform-specific adjustments** for iOS and Android
- **NativeWind/Tailwind CSS support** for utility-first styling
- **Expo integration** with theme support
- **Metro bundler integration** for hot reloading

### **Flutter**
- **Dart class generation** with Material Design 3 compatibility
- **Theme generation** for light and dark modes
- **Cupertino (iOS) style support** alongside Material Design
- **Widget-specific theming** for buttons, inputs, app bars
- **Hot reload integration** with Flutter development

### **Native iOS**
- **Swift extensions** for UIColor and UIFont
- **UIKit integration** with proper color definitions
- **iOS Human Interface Guidelines** compliance
- **Dark mode support** with adaptive colors

### **Native Android**
- **XML resource generation** for colors, dimensions, styles
- **Material Design compliance** with proper naming conventions
- **Night mode support** with alternative resources
- **Vector drawable support** for icons

### **Xamarin**
- **C# static classes** for cross-platform development
- **Xamarin.Forms integration** with Color and Font classes
- **Platform-specific optimizations** for iOS and Android

## 🛠️ Getting Started with Mobile

### React Native Setup

1. **Install with React Native configuration:**
```bash
npx design-tokens-sync init --platform react-native
```

2. **Configure for your project:**
```javascript
// design-tokens.config.js
export default {
  figma: {
    fileKey: 'your-figma-file-key',
    accessToken: 'your-figma-token'
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
  }
}
```

3. **Generate tokens:**
```bash
npm run tokens:sync
```

4. **Use in your components:**
```typescript
import tokens from './styles/tokens';

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.colors.primary[500],
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing[4],
  }
});
```

### Flutter Setup

1. **Initialize with Flutter template:**
```bash
npx design-tokens-sync init --platform flutter
```

2. **Configure output paths:**
```javascript
// design-tokens.config.js
export default {
  output: {
    flutter: {
      path: 'lib/design_tokens/app_tokens.dart',
      generateTheme: true
    }
  }
}
```

3. **Use in your Flutter app:**
```dart
import 'design_tokens/app_tokens.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: MyHomePage(),
    );
  }
}
```

## 🎨 Mobile-Specific Features

### Responsive Design Tokens
```javascript
// Automatic screen density conversion
processing: {
  transformUnits: {
    rem: { multiply: 16, unit: 'dp' }, // Convert rem to dp for mobile
    px: { multiply: 1, unit: 'dp' }
  }
}
```

### Platform-Specific Overrides
```javascript
// Different tokens for iOS vs Android
reactNative: {
  platformOverrides: {
    ios: {
      shadows: 'native', // Use native iOS shadows
      borderRadius: 'clamp' // Clamp to iOS limits
    },
    android: {
      elevation: true, // Convert shadows to elevation
      rippleEffects: true // Generate ripple colors
    }
  }
}
```

### Dark Mode Support
```javascript
// Automatic dark mode generation
processing: {
  colors: {
    generateDarkMode: true,
    darkModeStrategy: 'invert' // or 'custom'
  }
}
```

## 🔧 Advanced Mobile Configuration

### React Native + Expo
```javascript
export default {
  output: {
    expo: {
      path: 'constants/tokens.js',
      generateTheme: true,
      configPath: 'app.config.js'
    }
  },
  reactNative: {
    expo: {
      enabled: true,
      generateTheme: true
    }
  }
}
```

### Flutter Material Design 3
```javascript
export default {
  flutter: {
    materialDesign: {
      enabled: true,
      version: 3,
      generateColorScheme: true,
      generateTextTheme: true
    }
  }
}
```

### Native Platform Integration
```javascript
export default {
  output: {
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
  }
}
```

## 📱 Mobile Development Workflow

### 1. Design in Figma
- Use mobile-specific artboards (375x812 for iOS, 360x640 for Android)
- Follow platform design guidelines (iOS HIG, Material Design)
- Name components with mobile prefixes: `Mobile/Button`, `Mobile/Card`

### 2. Token Generation
```bash
# Watch for changes during development
npm run tokens:watch

# Generate for specific platform
npm run tokens:sync -- --platform react-native
```

### 3. Hot Reload Integration
The package integrates with:
- **React Native Metro bundler** for automatic reloading
- **Flutter hot reload** for instant updates
- **Expo development** with live token updates

### 4. Platform Testing
```bash
# Test tokens across platforms
npm run tokens:validate -- --mobile

# Check accessibility compliance
npm run tokens:a11y -- --platform mobile
```

## 🎯 Best Practices for Mobile

### Touch Targets
```javascript
validation: {
  spacing: {
    minimumTouchTarget: 44, // iOS HIG recommendation
    densityOptimization: true
  }
}
```

### Typography Scaling
```javascript
processing: {
  typography: {
    scaleFactors: {
      small: 0.85,  // Small phones
      medium: 1.0,  // Standard
      large: 1.15   // Large phones/tablets
    }
  }
}
```

### Performance Optimization
```javascript
reactNative: {
  performance: {
    lazyLoading: true,
    treeShaking: true,
    memoization: true
  }
}
```

## 🔍 Debugging Mobile Tokens

### React Native Debugger
```javascript
// Add to your app for debugging
import tokens from './styles/tokens';

if (__DEV__) {
  console.log('Design Tokens:', tokens);
}
```

### Flutter Inspector Integration
```dart
// Add debug overlay in development
if (kDebugMode) {
  return DebugTokenOverlay(
    tokens: AppTokens.all,
    child: MyWidget(),
  );
}
```

## 📦 Example Output Files

### React Native Tokens
```javascript
// Generated: src/styles/tokens.js
export const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    900: '#1e3a8a'
  }
};

export const spacing = {
  1: 4,
  2: 8,
  4: 16
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing[4],
    ...shadows.md
  }
});
```

### Flutter Colors
```dart
// Generated: lib/design_tokens/app_colors.dart
class AppColors {
  static const Color primary50 = Color(0xFFF0F9FF);
  static const Color primary500 = Color(0xFF3B82F6);
  static const Color primary900 = Color(0xFF1E3A8A);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      primarySwatch: MaterialColor(0xFF3B82F6, {
        50: AppColors.primary50,
        500: AppColors.primary500,
        900: AppColors.primary900,
      }),
    );
  }
}
```

### iOS Swift
```swift
// Generated: ios/DesignTokens/Colors.swift
extension UIColor {
    static let primary50 = UIColor(hex: "#f0f9ff")
    static let primary500 = UIColor(hex: "#3b82f6")
    static let primary900 = UIColor(hex: "#1e3a8a")
}
```

### Android XML
```xml
<!-- Generated: android/app/src/main/res/values/colors.xml -->
<resources>
    <color name="primary_50">#f0f9ff</color>
    <color name="primary_500">#3b82f6</color>
    <color name="primary_900">#1e3a8a</color>
</resources>
```

## 🚀 Next Steps

1. **Choose your mobile platform** (React Native, Flutter, or Native)
2. **Run the initialization** with the mobile template
3. **Configure your Figma integration** with mobile-specific nodes
4. **Set up your development workflow** with hot reloading
5. **Validate your tokens** across different screen sizes and platforms

For platform-specific guides, see:
- [React Native Guide](./react-native-guide.md)
- [Flutter Guide](./flutter-guide.md)
- [Native iOS Guide](./ios-guide.md)
- [Native Android Guide](./android-guide.md) 