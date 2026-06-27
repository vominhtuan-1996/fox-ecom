import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface FourRotatingDotsProps {
  color?: string;
  size?: number;
}

const FourRotatingDots: React.FC<FourRotatingDotsProps> = ({
  color = '#1976d2',
  size = 50,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  // 4 independent scale values, each staggered 90° in phase
  const scales = useRef([0, 1, 2, 3].map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // Continuous 360° rotation — 1200ms/cycle
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    // Each dot pulses: big → small → big, staggered by 300ms
    const CYCLE = 1200;
    const pulseDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.7, duration: CYCLE * 0.3, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.5, duration: CYCLE * 0.3, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1.0, duration: CYCLE * 0.4 - delay % CYCLE, useNativeDriver: true }),
        ])
      );

    const pulses = scales.map((anim, i) => pulseDot(anim, i * 300));
    pulses.forEach(p => p.start());

    return () => {
      rotation.stopAnimation();
      scales.forEach(s => s.stopAnimation());
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dotSize = size * 0.22;
  const orbit = size * 0.36;

  // Dot positions: top, right, bottom, left
  const positions = [
    { x: 0,      y: -orbit },
    { x: orbit,  y: 0      },
    { x: 0,      y: orbit  },
    { x: -orbit, y: 0      },
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.dotsContainer, { transform: [{ rotate: spin }] }]}>
        {positions.map((pos, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                transform: [
                  { translateX: pos.x },
                  { translateY: pos.y },
                  { scale: scales[i] },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const ProgressiveDots: React.FC<FourRotatingDotsProps> = ({
  color = '#1976d2',
  size = 50,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue]);

  const dotSize = size * 0.20;

  const getDotOpacity = (index: number) => {
    return animatedValue.interpolate({
      inputRange: [index * 0.25, (index + 1) * 0.25],
      outputRange: [0.3, 1],
      extrapolate: 'clamp',
    });
  };

  const getDotScale = (index: number) => {
    return animatedValue.interpolate({
      inputRange: [index * 0.25, (index + 1) * 0.25],
      outputRange: [0.8, 1.2],
      extrapolate: 'clamp',
    });
  };

  return (
    <View style={[styles.container, { width: size * 2, height: dotSize * 1.5 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        {[0, 1, 2, 3].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                opacity: getDotOpacity(index),
                transform: [{ scale: getDotScale(index) }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export const LoadingAnimationWidget = {
  fourRotatingDots: (props: FourRotatingDotsProps = {}) => (
    <FourRotatingDots {...props} />
  ),
  progressiveDots: (props: FourRotatingDotsProps = {}) => (
    <ProgressiveDots {...props} />
  ),
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
  },
});
