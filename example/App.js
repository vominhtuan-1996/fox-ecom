import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const MenuScreen = ({ onSelectTest }) => {
  const menuItems = [
    { id: '1', name: '✅ Home', screen: 'home' },
    { id: '2', name: '📱 Dialog - Alert', screen: 'dialog-alert' },
    { id: '3', name: '❓ Dialog - Confirm', screen: 'dialog-confirm' },
    { id: '4', name: '📝 Dialog - Input', screen: 'dialog-input' },
    { id: '5', name: '🎨 Dialog - Custom', screen: 'dialog-custom' },
    { id: '6', name: '🔔 Toast Notification', screen: 'toast' },
    { id: '7', name: '📋 SDK Features', screen: 'features' },
    { id: '8', name: '🎯 Cart Demo', screen: 'cart' },
    { id: '9', name: '🛍️ Products', screen: 'products' },
    { id: '10', name: '⚙️ Settings', screen: 'settings' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => onSelectTest(item.screen)}>
      <Text style={styles.menuText}>{item.name}</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🦊 Fox eCommerce</Text>
        <Text style={styles.subtitle}>Component Testing Menu</Text>
      </View>
      <FlatList data={menuItems} renderItem={renderItem} keyExtractor={item => item.id} style={styles.list} />
    </SafeAreaView>
  );
};

const HomeScreen = ({ onBack }) => (
  <View style={styles.screenContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.screenTitle}>🦊 Fox eCommerce SDK</Text>
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>✅ React Native App</Text>
      <Text style={styles.infoText}>✅ Clean Architecture</Text>
      <Text style={styles.infoText}>✅ Dialog Engine</Text>
      <Text style={styles.infoText}>✅ Theme System</Text>
      <Text style={styles.infoText}>✅ Production Ready</Text>
    </View>
  </View>
);

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('menu');

  return (
    <View style={styles.app}>
      {currentScreen === 'home' ? <HomeScreen onBack={() => setCurrentScreen('menu')} /> : <MenuScreen onSelectTest={setCurrentScreen} />}
    </View>
  );
};

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#fafafa' },
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { paddingVertical: 20, paddingHorizontal: 16, backgroundColor: '#1976d2', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#e3f2fd', marginTop: 4 },
  list: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  menuItem: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 16, marginVertical: 6, borderRadius: 8, justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  menuText: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
  arrow: { fontSize: 18, color: '#1976d2' },
  screenContainer: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#e3f2fd' },
  backText: { fontSize: 16, fontWeight: '600', color: '#1976d2' },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 20 },
  infoBox: { backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 8, marginTop: 16 },
  infoText: { fontSize: 16, color: '#1f2937', marginVertical: 8, fontWeight: '500' },
});

export default App;
