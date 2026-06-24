import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const IconButton = ({ icon, label, size = 18 }) => (
  <Text style={[styles.icon, { fontSize: size }]}>
    {icon} {label}
  </Text>
);

const styles = StyleSheet.create({
  icon: {
    fontWeight: '500',
    color: '#1976d2',
  },
});
