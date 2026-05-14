import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function Input({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  style,
  error,
  rightIcon,
  onRightPress,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={style}>
      <View
        style={[
          styles.container,
          {
            borderColor: isFocused ? colors.primary : colors.darkBorder,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.gray}
            style={styles.icon}
          />
        )}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={styles.input}
          placeholderTextColor={colors.gray}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconRight}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconRight}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkCard,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: fonts.sizes.md,
    fontWeight: '500',
  },
  iconRight: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
  error: {
    color: colors.error,
    fontSize: fonts.sizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
