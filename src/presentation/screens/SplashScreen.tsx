import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { splashModule, type SplashConfig } from '../../modules/splash/SplashModule';

interface SplashScreenProps {
  onComplete?: () => void;
  config?: SplashConfig;
  delay?: number;
  showLoader?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  config,
  delay = 3000,
  showLoader = true,
}) => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const initializeSplash = async () => {
      try {
        setStatus('Verifying token...');
        
        // Initialize with config
        const result = await splashModule.initialize(config || {});

        if (result.success) {
          setStatus('Services initialized');
          
          // Wait for delay before completing
          setTimeout(() => {
            setIsComplete(true);
            onComplete?.();
          }, delay);
        } else {
          setStatus(`Error: ${result.error}`);
        }
      } catch (error) {
        setStatus('Initialization failed');
      }
    };

    initializeSplash();
  }, [config, delay, onComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🦊</Text>
        <Text style={styles.title}>Fox Ecom</Text>
        <Text style={styles.subtitle}>E-Commerce SDK</Text>

        <View style={styles.initContainer}>
          {showLoader && <ActivityIndicator size="large" color="#007AFF" />}
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>v0.1.0</Text>
        </View>
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
    flex: 1,
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
    marginBottom: 50,
  },
  initContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  status: {
    fontSize: 14,
    color: '#fff',
    marginTop: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  version: {
    fontSize: 12,
    color: '#e0e0e0',
  },
});
