import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function Chip({
  label,
  icon,
  onPress,
  onClose,
  selected = false,
  variant = 'default',
  size = 'md',
}) {
  const variants = {
    default: {
      bg: colors.darkCard,
      text: colors.white,
      border: colors.darkBorder,
    },
    primary: {
      bg: colors.primary + '20',
      text: colors.primary,
      border: colors.primary,
    },
    success: {
      bg: colors.success + '20',
      text: colors.success,
      border: colors.success,
    },
  };

  const sizes = {
    sm: {
      padding: spacing.xs,
      fontSize: fonts.sizes.xs,
    },
    md: {
      padding: spacing.sm,
      fontSize: fonts.sizes.sm,
    },
    lg: {
      padding: spacing.md,
      fontSize: fonts.sizes.md,
    },
  };

  const variantStyle = selected ? variants.primary : variants[variant];
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          paddingHorizontal: sizeStyle.padding + 4,
          paddingVertical: sizeStyle.padding,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={sizeStyle.fontSize + 2}
          color={variantStyle.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: variantStyle.text,
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {label}
      </Text>
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          hitSlop={4}
        >
          <MaterialCommunityIcons
            name="close"
            size={sizeStyle.fontSize + 4}
            color={variantStyle.text}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: spacing.xs,
  },
});
