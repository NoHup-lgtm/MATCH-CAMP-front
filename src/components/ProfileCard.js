import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fonts, radius } from '../theme';

export default function ProfileCard({
  name,
  age,
  location,
  image,
  onLike,
  onPass,
  verified = false,
}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}

        {!image && (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color={colors.primary}
            />
          </View>
        )}

        <LinearGradient
          colors={['transparent', colors.dark]}
          style={styles.overlay}
        >
          <View style={styles.info}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {name} {age && <Text style={styles.age}>{age}</Text>}
              </Text>
              {verified && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={colors.success}
                  style={styles.verified}
                />
              )}
            </View>

            {location && (
              <View style={styles.location}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color={colors.gray}
                />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.pass]}
          onPress={onPass}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={colors.error}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.like]}
          onPress={onLike}
        >
          <MaterialCommunityIcons
            name="heart"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.super]}>
          <MaterialCommunityIcons
            name="star"
            size={24}
            color={colors.accent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    height: 500,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkCard,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.white,
    marginRight: spacing.sm,
  },
  age: {
    fontSize: fonts.sizes.lg,
    color: colors.gray,
  },
  verified: {
    marginLeft: spacing.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  locationText: {
    color: colors.gray,
    fontSize: fonts.sizes.sm,
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  pass: {
    backgroundColor: colors.darkCard,
  },
  like: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  super: {
    backgroundColor: colors.darkCard,
  },
});
