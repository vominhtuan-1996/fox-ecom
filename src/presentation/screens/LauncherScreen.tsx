import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

interface LauncherScreenProps {
  onComplete?: () => void;
  delay?: number;
}

export const LauncherScreen: React.FC<LauncherScreenProps> = ({
  onComplete,
  delay = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🦊</Text>
        <Text style={styles.title}>Fox Ecom</Text>
        <Text style={styles.subtitle}>E-Commerce SDK</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginTop: 8,
  },
});
