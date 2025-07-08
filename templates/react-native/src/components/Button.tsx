// Example React Native Button using Design Tokens
// This shows how to use the auto-generated design tokens in React Native components

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import tokens from '../styles/tokens'; // Auto-generated design tokens

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const titleStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? tokens.colors.neutral[50] : tokens.colors.primary[500]}
        />
      ) : (
        <Text style={titleStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button styles using design tokens
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: tokens.borderRadius.md,
    ...tokens.shadows.sm,
  },

  // Size variants using spacing tokens
  small: {
    paddingHorizontal: tokens.spacing[3],
    paddingVertical: tokens.spacing[2],
    minHeight: 32,
  },

  medium: {
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[3],
    minHeight: 40,
  },

  large: {
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[4],
    minHeight: 48,
  },

  // Variant styles using color tokens
  primary: {
    backgroundColor: tokens.colors.primary[500],
    borderColor: tokens.colors.primary[500],
  },

  secondary: {
    backgroundColor: tokens.colors.secondary[500],
    borderColor: tokens.colors.secondary[500],
  },

  outline: {
    backgroundColor: 'transparent',
    borderColor: tokens.colors.primary[500],
  },

  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  disabled: {
    backgroundColor: tokens.colors.neutral[200],
    borderColor: tokens.colors.neutral[300],
  },

  // Text styles using typography tokens
  baseText: {
    fontFamily: tokens.typography.fontFamily.sans,
    fontWeight: tokens.typography.fontWeight.medium,
    textAlign: 'center',
  },

  // Size-specific text styles
  smallText: {
    fontSize: tokens.typography.fontSize.sm,
  },

  mediumText: {
    fontSize: tokens.typography.fontSize.base,
  },

  largeText: {
    fontSize: tokens.typography.fontSize.lg,
  },

  // Variant-specific text colors
  primaryText: {
    color: tokens.colors.neutral[50],
  },

  secondaryText: {
    color: tokens.colors.neutral[50],
  },

  outlineText: {
    color: tokens.colors.primary[500],
  },

  ghostText: {
    color: tokens.colors.primary[500],
  },

  disabledText: {
    color: tokens.colors.neutral[400],
  },
});

export default Button; 