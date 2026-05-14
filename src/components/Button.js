import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fonts, radius } from '../theme';

export default function Button({
  label,
  onPress,
  style,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}) {
  const variants = {
    primary: {
      gradient: colors.gradientPink,
      textColor: colors.white,
    },
    secondary: {
      gradient: colors.gradientPurple,
      textColor: colors.white,
    },
    outline: {
      gradient: [colors.darkCard, colors.darkCard],
      textColor: colors.primary,
    },
  };

  const sizes = {
    sm: {
      padding: spacing.sm,
      fontSize: fonts.sizes.sm,
      minWidth: 80,
    },
    md: {
      padding: spacing.md,
      fontSize: fonts.sizes.md,
      minWidth: 120,
    },
    lg: {
      padding: spacing.lg,
      fontSize: fonts.sizes.lg,
      minWidth: 160,
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={currentVariant.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          currentSize,
          {
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: currentSize.fontSize,
              color: currentVariant.textColor,
              fontWeight: '600',
            },
          ]}
        >
          {loading ? '...' : label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontWeight: '600',
  },
});
