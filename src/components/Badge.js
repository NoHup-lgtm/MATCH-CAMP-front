import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function Badge({
  label,
  icon,
  variant = 'primary',
  size = 'md',
}) {
  const variants = {
    primary: { bg: colors.primary, text: colors.white },
    secondary: { bg: colors.secondary, text: colors.white },
    success: { bg: colors.success, text: colors.dark },
    warning: { bg: colors.accent, text: colors.dark },
  };

  const sizes = {
    sm: { padding: spacing.xs, fontSize: fonts.sizes.xs },
    md: { padding: spacing.sm, fontSize: fonts.sizes.sm },
    lg: { padding: spacing.md, fontSize: fonts.sizes.md },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.bg,
          paddingHorizontal: sizeStyle.padding,
          paddingVertical: sizeStyle.padding / 2,
        },
      ]}
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
            fontSize: sizeStyle.fontSize,
            color: variantStyle.text,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontWeight: '600',
  },
});
