import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { TabNavigator } from './TabNavigator';
import { CarryNavigator } from './CarryNavigator';
import { OfflineBanner } from '../components/shared/OfflineBanner';
import { useNetworkState } from '../hooks/useNetworkState';
import { CURRENT_USER_ID } from './currentUser';
// @ts-ignore
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen.jsx';

export const AppNavigator: React.FC = () => {
  const [isInCarry, setIsInCarry]           = useState(false);
  const [isInNotifs, setIsInNotifs]         = useState(false);
  const [deepLinkOrderId, setDeepLinkOrderId] = useState<string | null>(null);
  const isOnline = useNetworkState();

  function openOrder(orderId: string) {
    setIsInNotifs(false);
    setDeepLinkOrderId(orderId);
    setIsInCarry(true);
  }

  return (
    <View style={s.root}>
      <TabNavigator
        currentUserId={CURRENT_USER_ID}
        onGoCarry={() => setIsInCarry(true)}
        onGoNotifications={() => setIsInNotifs(true)}
      />

      <OfflineBanner visible={!isOnline} />

      {/* Carry — fullscreen modal */}
      <Modal
        visible={isInCarry}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => { setIsInCarry(false); setDeepLinkOrderId(null); }}
      >
        <CarryNavigator
          currentUserId={CURRENT_USER_ID}
          onClose={() => { setIsInCarry(false); setDeepLinkOrderId(null); }}
          initialOrderId={deepLinkOrderId ?? undefined}
        />
      </Modal>

      {/* Notifications — slide up modal */}
      <Modal
        visible={isInNotifs}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsInNotifs(false)}
      >
        <NotificationsScreen
          onBack={() => setIsInNotifs(false)}
          onOpenOrder={openOrder}
        />
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#CDEBD2' },
});
