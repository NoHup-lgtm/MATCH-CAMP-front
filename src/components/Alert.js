import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function Alert({
  type = 'info',
  title,
  message,
  icon,
  style,
}) {
  const typeConfig = {
    info: {
      bg: colors.secondary + '20',
      border: colors.secondary,
      icon: icon || 'information',
      color: colors.secondary,
    },
    success: {
      bg: colors.success + '20',
      border: colors.success,
      icon: icon || 'check-circle',
      color: colors.success,
    },
    warning: {
      bg: colors.accent + '20',
      border: colors.accent,
      icon: icon || 'alert',
      color: colors.accent,
    },
    error: {
      bg: colors.error + '20',
      border: colors.error,
      icon: icon || 'alert-circle',
      color: colors.error,
    },
  };

  const config = typeConfig[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={config.icon}
        size={20}
        color={config.color}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fonts.sizes.xs,
    color: colors.gray,
    lineHeight: 18,
  },
});
