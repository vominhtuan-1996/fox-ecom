import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, LogBox } from 'react-native';
import { useNavigation, FoxEcomSDK } from 'fox-ecom';

// Suppress RN internal LogBox Flow type errors
LogBox.ignoreLogs([/SyntaxError.*LogBox/, /missing-asset-registry-path/]);

const MENU_ITEMS = [
  { id: 'home', title: 'Home', icon: '🏠', color: '#FF6B6B' },
  { id: 'products', title: 'Products', icon: '📦', color: '#4ECDC4' },
  { id: 'cart', title: 'Cart', icon: '🛒', color: '#45B7D1' },
  { id: 'profile', title: 'Profile', icon: '👤', color: '#96CEB4' },
  { id: 'sdk', title: 'Fox SDK', icon: '🦊', color: '#FFEAA7' },
];

export function App() {
  const { navigate } = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('launcher');
  const [sdkConfig, setSdkConfig] = useState(null);

  const handleLauncherComplete = () => {
    setCurrentScreen('menu');
  };

  const handleMenuPress = (itemId) => {
    if (itemId === 'sdk') {
      // Show FoxEcomSDK with initialization
      setSdkConfig({
        token: 'demo-token-12345',
        environment: 'staging',
        baseUrl: 'https://apis-stag.fpt.vn',
        timeout: 5000,
      });
      setCurrentScreen('sdk');
    } else {
      // Navigate to other SDK screens
      navigate(itemId);
    }
  };

  if (currentScreen === 'launcher') {
    return (
      <FoxEcomSDK
        token="demo-token"
        environment="staging"
        baseUrl="https://apis-stag.fpt.vn"
        delay={2000}
        onComplete={handleLauncherComplete}
      />
    );
  }

  if (currentScreen === 'sdk' && sdkConfig) {
    return (
      <FoxEcomSDK
        {...sdkConfig}
        delay={2000}
        onComplete={() => {
          setCurrentScreen('menu');
          setSdkConfig(null);
        }}
      />
    );
  }

  if (currentScreen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Fox eCommerce</Text>
          <Text style={styles.subtitle}>Example App Menu</Text>
        </View>

        <ScrollView style={styles.gridContainer}>
          <View style={styles.grid}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => handleMenuPress(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#e0e0e0', marginTop: 5 },
  gridContainer: { flex: 1, padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center' },
});

export default App;
