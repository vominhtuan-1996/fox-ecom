import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Switch,
  StyleSheet, Platform, StatusBar, ScrollView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { AppDivider } from '../../components/shared/AppDivider';
import { AppCard } from '../../components/shared/AppCard';

interface SettingsScreenProps {
  onBack?: () => void;
  appVersion?: string;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

interface ToggleSetting { label: string; sub: string; key: string }

const NOTIF_SETTINGS: ToggleSetting[] = [
  { key: 'newOrder',    label: 'Đơn mới cần người chở', sub: 'Nhận thông báo khi có đơn trên tuyến của bạn' },
  { key: 'myOrder',     label: 'Cập nhật đơn của tôi',  sub: 'Khi đơn được nhận, đang giao, hoàn thành' },
  { key: 'leaderboard', label: 'Bảng xếp hạng',         sub: 'Thứ hạng hàng tuần và thay đổi hạng' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  appVersion = '1.0.0',
}) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    newOrder: true, myOrder: true, leaderboard: false,
  });

  const toggle = (key: string) =>
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <AppText variant="s2">Cài đặt</AppText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

        {/* Notification section */}
        <AppText variant="c1" color="textSecondary" style={s.sectionLabel}>THÔNG BÁO</AppText>
        <AppCard padding={false} elevated>
          {NOTIF_SETTINGS.map((item, i) => (
            <React.Fragment key={item.key}>
              <View style={s.settingRow}>
                <View style={s.settingInfo}>
                  <AppText variant="p2">{item.label}</AppText>
                  <AppText variant="c2" color="textSecondary">{item.sub}</AppText>
                </View>
                <Switch
                  value={toggles[item.key] ?? false}
                  onValueChange={() => toggle(item.key)}
                  trackColor={{ false: colors.iron, true: colors.primaryLight }}
                  thumbColor={toggles[item.key] ? colors.primary : colors.white}
                />
              </View>
              {i < NOTIF_SETTINGS.length - 1 && <AppDivider margin={0} color={colors.borderSubtle} />}
            </React.Fragment>
          ))}
        </AppCard>

        {/* About section */}
        <AppText variant="c1" color="textSecondary" style={s.sectionLabel}>VỀ ỨNG DỤNG</AppText>
        <AppCard padding={false} elevated>
          {[
            { label: 'Phiên bản',      value: appVersion },
            { label: 'Điều khoản',     value: 'Xem ›' },
            { label: 'Chính sách',     value: 'Xem ›' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <View style={s.settingRow}>
                <AppText variant="p2">{item.label}</AppText>
                <AppText variant="p2" color="textSecondary">{item.value}</AppText>
              </View>
              {i < arr.length - 1 && <AppDivider margin={0} color={colors.borderSubtle} />}
            </React.Fragment>
          ))}
        </AppCard>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn}>
          <AppText variant="p2" color="error" align="center">Đăng xuất</AppText>
        </TouchableOpacity>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  back: { ...typography.h3, color: colors.text, lineHeight: 28 } as object,

  body:         { padding: spacing.lg },
  sectionLabel: { marginBottom: spacing.sm, marginTop: spacing.lg, letterSpacing: 0.5 },

  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg,
  },
  settingInfo: { flex: 1, marginRight: spacing.lg },

  logoutBtn: {
    marginTop: spacing['2xl'],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.error + '44',
  },
});
