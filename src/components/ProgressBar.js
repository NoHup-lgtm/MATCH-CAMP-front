import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, fonts } from '../theme';

export default function ProgressBar({ progress = 0, animated = true }) {
  const animatedWidth = React.useRef(
    animated ? new Animated.Value(0) : undefined
  ).current;

  React.useEffect(() => {
    if (animated && animatedWidth) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated, animatedWidth]);

  const widthValue = animated && animatedWidth ? animatedWidth : progress;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: typeof widthValue === 'number' 
                ? `${widthValue * 100}%`
                : widthValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
            },
          ]}
        />
      </View>
      <Text style={styles.percentText}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backgroundBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.darkBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  percentText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 35,
    textAlign: 'right',
  },
});
