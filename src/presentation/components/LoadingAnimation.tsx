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
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue]);

  const dotMaxSize = size * 0.30;
  const dotMinSize = size * 0.14;
  const maxOffset = size * 0.35;

  // Phase 1: Dots move to center (0-0.18)
  const phase1Scale = animatedValue.interpolate({
    inputRange: [0, 0.18],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  // Phase 2: Dots expand and shrink (0.18-0.36)
  const phase2Scale = animatedValue.interpolate({
    inputRange: [0.18, 0.36],
    outputRange: [0.5, 1.5],
    extrapolate: 'clamp',
  });

  // Phase 3: Rotation (0.36-0.60)
  const rotation = animatedValue.interpolate({
    inputRange: [0.36, 0.60],
    outputRange: [0, Math.PI * 1.75],
    extrapolate: 'clamp',
  });

  // Phase 4: Expand back (0.60-0.78)
  const phase4Scale = animatedValue.interpolate({
    inputRange: [0.60, 0.78],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  // Phase 5: Return to initial position (0.78-1.0)
  const phase5Opacity = animatedValue.interpolate({
    inputRange: [0.78, 1.0],
    outputRange: [1, 1],
    extrapolate: 'clamp',
  });

  const renderDot = (offsetX: number, offsetY: number, phaseScale: Animated.AnimatedInterpolation) => (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          width: dotMinSize,
          height: dotMinSize,
          borderRadius: dotMinSize / 2,
          transform: [
            { translateX: offsetX },
            { translateY: offsetY },
            { scale: phaseScale },
          ],
        },
      ]}
    />
  );

  const getPhase = () => {
    const val = animatedValue.__getValue();
    if (val <= 0.18) return 'phase1';
    if (val <= 0.36) return 'phase2';
    if (val <= 0.60) return 'phase3';
    if (val <= 0.78) return 'phase4';
    return 'phase5';
  };

  const currentPhase = getPhase();
  const scale =
    currentPhase === 'phase1'
      ? phase1Scale
      : currentPhase === 'phase2'
      ? phase2Scale
      : currentPhase === 'phase4'
      ? phase4Scale
      : 1;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.dotsContainer,
          {
            transform: [
              { rotate: rotation },
              { scale },
            ],
          },
        ]}
      >
        {renderDot(-maxOffset, 0, scale)}
        {renderDot(maxOffset, 0, scale)}
        {renderDot(0, -maxOffset, scale)}
        {renderDot(0, maxOffset, scale)}
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
