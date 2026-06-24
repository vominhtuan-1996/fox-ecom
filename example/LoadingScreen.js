import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LoadingAnimationWidget } from '../../src/presentation/components/LoadingAnimation.tsx';

export const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Loading Animation Demo</Text>

        {/* Four Rotating Dots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Four Rotating Dots</Text>
          <View style={styles.animationContainer}>
            {LoadingAnimationWidget.fourRotatingDots({
              color: '#1976d2',
              size: 60,
            })}
          </View>
          <Text style={styles.description}>4 dots shrink to center, rotate 315°, expand</Text>
        </View>

        {/* Progressive Dots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progressive Dots</Text>
          <View style={styles.animationContainer}>
            {LoadingAnimationWidget.progressiveDots({
              color: '#ff6b6b',
              size: 50,
            })}
          </View>
          <Text style={styles.description}>4 dots scale in sequence</Text>
        </View>

        {/* Custom Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Colors</Text>
          <View style={styles.animationContainer}>
            {LoadingAnimationWidget.fourRotatingDots({
              color: '#4CAF50',
              size: 60,
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1f2937',
  },
  section: {
    marginBottom: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#374151',
  },
  animationContainer: {
    marginBottom: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
