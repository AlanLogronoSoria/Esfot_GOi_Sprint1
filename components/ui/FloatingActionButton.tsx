import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LightTheme as T, Shadows } from '@/constants/design-system';

interface FloatingActionButtonProps {
  icon?: string;
  onPress: () => void;
  bottom?: number;
  right?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FloatingActionButton({
  icon = '+',
  onPress,
  bottom = 90,
  right = 20,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const onPressIn = () => {
    scale.value = withSpring(0.9);
    rotation.value = withTiming(90, { duration: 200 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withTiming(0, { duration: 200 });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <AnimatedTouchable
      style={[styles.fab, { bottom, right }, animatedStyle]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
    >
      <Text style={styles.icon}>{icon}</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
    ...Shadows.lg,
  },
  icon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
