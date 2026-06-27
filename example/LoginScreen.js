import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LoginScreen as SDKLoginScreen } from '../src/presentation/screens/login';

// Wrapper dùng SDK LoginScreen thật với API
export const LoginScreen = ({ onBack }) => {
  return (
    <SDKLoginScreen
      onBack={onBack}
      onLoginSuccess={(token) => {
        Alert.alert('✅ Đăng nhập thành công', `Token: ${token.substring(0, 30)}...`, [
          { text: 'OK', onPress: onBack },
        ]);
      }}
    />
  );
};
