import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts } from '../theme';

export default function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  centerContent,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={colors.white}
            />
          </TouchableOpacity>
        )}

        {centerContent ? (
          <View style={styles.center}>{centerContent}</View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}

        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  rightButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
});
