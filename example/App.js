import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Slide-in from right on mount, direction-aware
function ScreenSlide({ children, direction }) {
  const translateX = useRef(new Animated.Value(direction === 'back' ? -SCREEN_WIDTH : SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ flex: 1 }, { transform: [{ translateX }], opacity }]}>
      {children}
    </Animated.View>
  );
}
import { SvgIcon } from './SvgIcon';
import { LoginScreen } from './LoginScreen';
import { BottomSheetDemo } from './BottomSheetDemo';
import { LoadingDemo } from './LoadingDemo';
import { SDKComponents } from './SDKComponents';
import { DialogEngineHost } from 'fox-ecom';
import { AppNavigator } from '../src/presentation/app/AppNavigator';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 12 }}>❌ Lỗi render</Text>
          <Text style={{ fontSize: 13, color: '#333', textAlign: 'center' }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

console.log('🔥 Hot Reload: App reloaded at', new Date().toLocaleTimeString());

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [direction, setDirection] = useState('forward');

  const navigate = useCallback((screen) => {
    setDirection('forward');
    setCurrentScreen(screen);
  }, []);

  const goBack = useCallback(() => {
    setDirection('back');
    setCurrentScreen('menu');
  }, []);

  const iconMap = {
    home: '🏠',
    alert: '⚠️',
    confirm: '✓',
    dialog: '💬',
    input: '✏️',
    custom: '🎨',
    bell: '🔔',
    layers: '📋',
    cart: '🛒',
    package: '📦',
    heart: '❤️',
    settings: '⚙️',
  };

  const menuItems = [
    { id: 'fox-eco', name: '🦊 Fox Eco App', icon: 'package', screen: 'fox-eco', highlight: true },
    { id: '0', name: 'Login', icon: 'home', screen: 'login' },
    { id: '1', name: 'Home', icon: 'home', screen: 'home' },
    { id: '2', name: 'Dialog - Alert', icon: 'heart', screen: 'dialog-alert' },
    { id: '3', name: 'Dialog - Confirm', icon: 'confirm', screen: 'dialog-confirm' },
    { id: '4', name: 'Dialog - Input', icon: 'input', screen: 'dialog-input' },
    { id: '5', name: 'Dialog - Custom', icon: 'custom', screen: 'dialog-custom' },
    { id: '6', name: 'Toast Notification', icon: 'bell', screen: 'toast' },
    { id: '7', name: 'SDK Features', icon: 'layers', screen: 'features' },
    { id: '8', name: 'Cart Demo', icon: 'cart', screen: 'cart' },
    { id: '9', name: 'Products', icon: 'package', screen: 'products' },
    { id: '10', name: 'Settings', icon: 'settings', screen: 'settings' },
    { id: '11', name: 'Bottom Sheet', icon: 'layers', screen: 'bottom-sheet' },
    { id: '12', name: 'Loading & Layers', icon: 'layers', screen: 'loading' },
    { id: '13', name: 'SDK Components', icon: 'package', screen: 'sdk-components' },
  ];

  const handleDialogAlert = () => {
    Alert.alert(
      '🦊 SDK Dialog Alert',
      'This demonstrates the Fox eCommerce SDK Dialog system!'
    );
  };

  const handleDialogConfirm = () => {
    Alert.alert(
      '❓ Dialog Confirm',
      'Do you want to proceed with this action?\n\n(Using SDK DialogConfirm pattern)',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes, Proceed',
          onPress: () => Alert.alert('Success!', 'You confirmed the action ✅'),
          style: 'default',
        },
      ]
    );
  };

  const handleDialogCustom = () => {
    navigate('dialog-custom');
  };

  const renderMenu = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🦊 Fox eCommerce</Text>
        <Text style={styles.subtitle}>Component Testing Menu</Text>
      </View>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.menuItem, item.highlight && styles.menuItemHighlight]}
            onPress={() => {
              if (item.screen === 'dialog-alert') {
                handleDialogAlert();
              } else if (item.screen === 'dialog-confirm') {
                handleDialogConfirm();
              } else if (item.screen === 'dialog-custom') {
                handleDialogCustom();
              } else {
                navigate(item.screen);
              }
            }}
          >
            <View style={styles.menuItemContent}>
              <Text style={{ fontSize: 20, marginRight: 4 }}>{iconMap[item.icon] ?? '▸'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuText, item.highlight && styles.menuTextHighlight]}>{item.name}</Text>
                {item.highlight && (
                  <Text style={styles.menuSubText}>Toàn bộ UI + logic 10 phases</Text>
                )}
              </View>
            </View>
            <Text style={[styles.arrow, item.highlight && { color: '#fff' }]}>→</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );

  const renderHome = () => (
    <SafeAreaView style={styles.screenContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBack}
      >
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
    </SafeAreaView>
  );

  const renderCustomDialog = () => (
    <SafeAreaView style={styles.screenContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBack}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>🎨 Custom Dialog</Text>

      <View style={styles.customDialogBox}>
        <View style={styles.customDialogHeader}>
          <Text style={styles.customDialogTitle}>🎉 Special Offer!</Text>
        </View>

        <View style={styles.customDialogContent}>
          <Text style={styles.customDialogText}>
            Get 20% off on your next purchase
          </Text>
          <Text style={styles.customDialogSubtext}>
            Use code: ECOM20
          </Text>

          <View style={styles.offerBox}>
            <Text style={styles.offerText}>💳 Apply to Cart</Text>
          </View>
        </View>

        <View style={styles.customDialogFooter}>
          <TouchableOpacity
            style={[styles.customButton, styles.cancelButton]}
            onPress={goBack}
          >
            <Text style={styles.cancelButtonText}>Dismiss</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.customButton, styles.acceptButton]}
            onPress={() => {
              Alert.alert('Success!', 'Offer applied to your cart! 🎉');
              goBack();
            }}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  let content;
  if (currentScreen === 'menu') {
    content = renderMenu();
  } else if (currentScreen === 'dialog-custom') {
    content = renderCustomDialog();
  } else if (currentScreen === 'login') {
    content = (
      <LoginScreen
        onBack={goBack}
        onLoginSuccess={goBack}
      />
    );
  } else if (currentScreen === 'bottom-sheet') {
    content = <BottomSheetDemo onBack={goBack} />;
  } else if (currentScreen === 'loading') {
    content = <LoadingDemo onBack={goBack} />;
  } else if (currentScreen === 'sdk-components') {
    content = <SDKComponents onBack={goBack} />;
  } else if (currentScreen === 'fox-eco') {
    content = (
      <ErrorBoundary>
        <View style={{ flex: 1, backgroundColor: 'tomato' }}>
          <AppNavigator />
        </View>
      </ErrorBoundary>
    );
  } else {
    content = renderHome();
  }

  return (
    <DialogEngineHost>
      <ScreenSlide key={currentScreen} direction={direction}>
        {content}
      </ScreenSlide>
    </DialogEngineHost>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemHighlight: {
    backgroundColor: '#FF8500',
    elevation: 6,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 12,
  },
  menuTextHighlight: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  menuSubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 12,
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#1976d2',
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fafafa',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#1f2937',
    marginVertical: 8,
    fontWeight: '500',
  },
  customDialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  customDialogHeader: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  customDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  customDialogContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  customDialogText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  customDialogSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  offerBox: {
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  offerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
  },
  customDialogFooter: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  customButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  acceptButton: {
    backgroundColor: '#1976d2',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
});
