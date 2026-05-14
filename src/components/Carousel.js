import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fonts, radius } from '../theme';

const { width } = Dimensions.get('window');

export default function Carousel({
  items,
  renderItem,
  onChangeIndex,
  currentIndex = 0,
}) {
  const [index, setIndex] = React.useState(currentIndex);

  const handleNext = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
      onChangeIndex?.(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      onChangeIndex?.(index - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        {renderItem(items[index], index)}
      </View>

      {/* Navigation */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !index && styles.buttonDisabled]}
          onPress={handlePrev}
          disabled={!index}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={index ? colors.primary : colors.gray}
          />
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dots}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            index === items.length - 1 && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={index === items.length - 1}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={
              index === items.length - 1 ? colors.gray : colors.primary
            }
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
  carousel: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.darkCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.darkBorder,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
