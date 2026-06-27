import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, layout } from '../../../common/theme';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { Co2ImpactCard } from './Co2ImpactCard';
import { FeatureGrid } from './FeatureGrid';

interface HomeScreenProps {
  userName?: string;
  onGoCarry?: () => void;
  onGoQrScan?: () => void;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

/**
 * HomeScreen — màn hình chính FoxPro.
 * Header gradient cam + CO₂ card + grid 3 tính năng.
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'Nguyễn Văn A',
  onGoCarry,
  onGoQrScan,
}) => {
  const features = [
    {
      key: 'carry',
      icon: '📦',
      title: 'Giao hàng',
      subtitle: 'Gửi & nhận hàng tiện đường',
      active: true,
      onPress: onGoCarry,
    },
    {
      key: 'kids',
      icon: '👦',
      title: 'Đón con',
      subtitle: 'Nhờ đồng nghiệp đón con hộ',
      active: false,
    },
    {
      key: 'commute',
      icon: '🚗',
      title: 'Đi làm chung',
      subtitle: 'Carpool cùng đồng nghiệp',
      active: false,
    },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Orange header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.md }]}>
        <View style={s.headerContent}>
          <View>
            <Text style={s.greeting}>Xin chào 👋</Text>
            <Text style={s.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={s.qrBtn} onPress={onGoQrScan} activeOpacity={0.8}>
            <Text style={s.qrIcon}>▣</Text>
          </TouchableOpacity>
        </View>

        <View style={s.avatarRow}>
          <AppAvatar name={userName} size="md" style={s.avatar} />
          <View>
            <Text style={s.deptLabel}>FPT Telecom · Phòng CNTT</Text>
            <Text style={s.pointLabel}>⭐ 320 điểm · Hạng Bạc</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={s.body}
        contentContainerStyle={s.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CO₂ card */}
        <Co2ImpactCard
          companyCo2Kg={1240}
          personalCo2Kg={3.7}
          savedKm={52}
        />

        {/* Section label */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Tính năng</Text>
        </View>

        {/* Feature grid */}
        <FeatureGrid features={features} />

        <View style={{ height: layout.tabBarHeight + spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  // Header cam
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: { ...typography.p2, color: 'rgba(255,255,255,0.8)' } as object,
  userName:  { ...typography.h4, color: colors.white } as object,
  qrBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  qrIcon: { fontSize: 20, color: colors.white },

  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar:    { marginRight: spacing.md },
  deptLabel: { ...typography.c1, color: 'rgba(255,255,255,0.7)' } as object,
  pointLabel:{ ...typography.c2, color: colors.white, marginTop: 2 } as object,

  // Body
  body:        { flex: 1, marginTop: -spacing.lg },
  bodyContent: { paddingTop: spacing['2xl'] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    marginBottom: spacing.xs,
  },
  sectionTitle: { ...typography.s2, color: colors.text } as object,
});
