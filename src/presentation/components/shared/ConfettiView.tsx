import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const COLORS = ['#FF8500','#5933EB','#0BD78C','#16ADFF','#F43F4A','#FFA800','#FFD700'];
const COUNT = 40;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  delay: number;
}

function createParticles(): Particle[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    x:       new Animated.Value(Math.random() * W),
    y:       new Animated.Value(-20),
    rotate:  new Animated.Value(0),
    opacity: new Animated.Value(1),
    color:   COLORS[i % COLORS.length],
    size:    Math.random() * 8 + 4,
    delay:   Math.random() * 600,
  }));
}

interface ConfettiViewProps {
  visible: boolean;
  onDone?: () => void;
}

/**
 * ConfettiView — overlay celebration khi hoàn thành đơn.
 * Render 40 confetti rơi từ trên xuống, tự unmount sau 2.5s.
 */
export const ConfettiView: React.FC<ConfettiViewProps> = ({ visible, onDone }) => {
  const particles = useRef(createParticles()).current;
  const mounted   = useRef(false);

  useEffect(() => {
    if (!visible) return;
    particles.forEach(p => {
      p.x.setValue(Math.random() * W);
      p.y.setValue(-20);
      p.opacity.setValue(1);
      p.rotate.setValue(0);
    });

    const anims = particles.map(p =>
      Animated.parallel([
        Animated.timing(p.y, { toValue: H + 20, duration: 2200 + p.delay, delay: p.delay, useNativeDriver: true }),
        Animated.timing(p.rotate, { toValue: 6, duration: 2200 + p.delay, delay: p.delay, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(p.delay + 1600),
          Animated.timing(p.opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    );

    Animated.parallel(anims).start(() => onDone?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={s.overlay} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            s.particle,
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.size / 4,
              opacity: p.opacity,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate: p.rotate.interpolate({ inputRange: [0, 6], outputRange: ['0deg', '1080deg'] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  overlay:  { ...StyleSheet.absoluteFillObject, zIndex: 9999 },
  particle: { position: 'absolute', top: 0, left: 0 },
});
