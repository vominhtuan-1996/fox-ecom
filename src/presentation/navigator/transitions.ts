import { Animated, Dimensions } from 'react-native';
import { TransitionType } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function buildTransition(
  type: TransitionType,
  anim: Animated.Value,
  direction: 'push' | 'pop',
): object {
  switch (type) {
    case 'slide': {
      const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [direction === 'push' ? SCREEN_WIDTH : -SCREEN_WIDTH, 0],
      });
      return { transform: [{ translateX }] };
    }
    case 'fade':
      return { opacity: anim };
    case 'scale': {
      const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
      const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.7, 1] });
      return { transform: [{ scale }], opacity };
    }
    case 'none':
    default:
      return {};
  }
}

export function runTransition(
  anim: Animated.Value,
  duration: number,
  onDone?: () => void,
): void {
  anim.setValue(0);
  Animated.spring(anim, {
    toValue: 1,
    damping: 22,
    stiffness: 200,
    useNativeDriver: true,
  }).start(onDone);
}
