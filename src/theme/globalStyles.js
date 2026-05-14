// Global styles and constants for the app

import { colors, spacing, fonts, radius } from './index';

export const globalStyles = {
  // Containers
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // Shadows
  shadowSoft: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },

  // Text styles
  headline1: {
    fontSize: fonts.sizes.hero,
    fontWeight: '900',
    letterSpacing: -1,
    color: colors.white,
  },
  headline2: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.white,
  },
  headline3: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.white,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: colors.gray,
  },
  body: {
    fontSize: fonts.sizes.md,
    fontWeight: '500',
    color: colors.white,
    lineHeight: 24,
  },
  caption: {
    fontSize: fonts.sizes.sm,
    fontWeight: '400',
    color: colors.gray,
  },

  // Padding styles
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingMedium: {
    padding: spacing.md,
  },
  paddingLarge: {
    padding: spacing.lg,
  },

  // Margin styles
  marginSmall: {
    margin: spacing.sm,
  },
  marginMedium: {
    margin: spacing.md,
  },
  marginLarge: {
    margin: spacing.lg,
  },

  // Border radius styles
  roundSmall: {
    borderRadius: radius.sm,
  },
  roundMedium: {
    borderRadius: radius.md,
  },
  roundLarge: {
    borderRadius: radius.lg,
  },
  roundFull: {
    borderRadius: radius.full,
  },
};

// Export all
export const themeConfig = {
  colors,
  spacing,
  fonts,
  radius,
  globalStyles,
};
