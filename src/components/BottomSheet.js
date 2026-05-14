import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function BottomSheet({
  visible,
  title,
  items,
  onClose,
  onSelect,
}) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onClose}
        activeOpacity={0.8}
      />

      <LinearGradient
        colors={[colors.darkSurface, colors.darkCard]}
        style={styles.sheet}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Title */}
        {title && <Text style={styles.title}>{title}</Text>}

        {/* Items */}
        <View style={styles.items}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                index !== items.length - 1 && styles.itemBorder,
              ]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              {item.icon && (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={item.color || colors.primary}
                  style={styles.itemIcon}
                />
              )}
              <View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkBorder,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.lg,
  },
  items: {
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBorder,
  },
  itemIcon: {
    marginRight: spacing.md,
  },
  itemLabel: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.white,
  },
  itemDescription: {
    fontSize: fonts.sizes.xs,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.darkBorder,
  },
  cancelText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.gray,
  },
});
