import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { TabNavigator } from './TabNavigator';
import { CarryNavigator } from './CarryNavigator';
import { OfflineBanner } from '../components/shared/OfflineBanner';
import { useNetworkState } from '../hooks/useNetworkState';
import { NotificationService } from '../../modules/notification/NotificationService';
import { CURRENT_USER_ID } from './currentUser';

export const AppNavigator: React.FC = () => {
  const [isInCarry, setIsInCarry] = useState(false);
  const [deepLinkOrderId, setDeepLinkOrderId] = useState<string | null>(null);
  const isOnline = useNetworkState();

  useEffect(() => {
    const initial = NotificationService.getInitialNotification();
    if (initial?.orderId) {
      setIsInCarry(true);
      setDeepLinkOrderId(initial.orderId);
    }
    const unsub = NotificationService.addListener((payload) => {
      if (payload.orderId) {
        setIsInCarry(true);
        setDeepLinkOrderId(payload.orderId);
      }
    });
    return unsub;
  }, []);

  return (
    <View style={s.root}>
      {/* Tab layer — luôn hiển thị */}
      <TabNavigator
        currentUserId={CURRENT_USER_ID}
        onGoCarry={() => setIsInCarry(true)}
      />

      {/* Offline banner */}
      <OfflineBanner visible={!isOnline} />

      {/* Carry — dùng Modal để overlay fullscreen không cần absoluteFill */}
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
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFB' },
});
