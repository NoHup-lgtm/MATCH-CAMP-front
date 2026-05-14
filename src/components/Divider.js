import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme';

export default function Divider({
  style,
  variant = 'horizontal',
  margin = true,
}) {
  if (variant === 'horizontal') {
    return (
      <View
        style={[
          styles.horizontal,
          margin && { marginVertical: spacing.md },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.vertical,
        margin && { marginHorizontal: spacing.md },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.darkBorder,
  },
  vertical: {
    width: 1,
    backgroundColor: colors.darkBorder,
  },
});
