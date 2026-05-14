import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fonts, radius } from '../theme';

export default function StatsCard({ icon, label, value, color = colors.primary }) {
  return (
    <LinearGradient
      colors={[colors.darkCard, colors.darkSurface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: color + '20' },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.darkBorder,
    marginHorizontal: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: fonts.sizes.xs,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.white,
  },
});
