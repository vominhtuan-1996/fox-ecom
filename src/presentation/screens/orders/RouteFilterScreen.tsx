import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Platform, StatusBar, Switch,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '../../../common/theme';
import { AppButton } from '../../components/shared/AppButton';
import { AppText } from '../../components/shared/AppText';
import { AppDivider } from '../../components/shared/AppDivider';
import { HUBS } from '../../../modules/carry/CarryService';
import { Hub } from '../../../modules/carry/types';

export interface RouteFilter {
  fromHub?: Hub;
  toHub?: Hub;
  myRouteOnly: boolean;
}

interface RouteFilterScreenProps {
  initial?: RouteFilter;
  onApply: (filter: RouteFilter) => void;
  onClose?: () => void;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

const HubRow: React.FC<{
  hub: Hub;
  selected: boolean;
  onPress: () => void;
}> = ({ hub, selected, onPress }) => (
  <TouchableOpacity style={[r.hubRow, selected && r.hubRowSelected]} onPress={onPress}>
    <View style={r.hubInfo}>
      <Text style={[r.hubName, selected && r.hubNameSelected]}>{hub.name}</Text>
      <Text style={r.hubCity}>{hub.city}</Text>
    </View>
    <View style={[r.radio, selected && r.radioSelected]}>
      {selected && <View style={r.radioDot} />}
    </View>
  </TouchableOpacity>
);

export const RouteFilterScreen: React.FC<RouteFilterScreenProps> = ({
  initial,
  onApply,
  onClose,
}) => {
  const [fromHub,      setFromHub]      = useState<Hub | undefined>(initial?.fromHub);
  const [toHub,        setToHub]        = useState<Hub | undefined>(initial?.toHub);
  const [myRouteOnly,  setMyRouteOnly]  = useState(initial?.myRouteOnly ?? false);
  const [section,      setSection]      = useState<'from' | 'to'>('from');

  function handleReset() {
    setFromHub(undefined);
    setToHub(undefined);
    setMyRouteOnly(false);
  }

  function handleSwap() {
    const tmp = fromHub;
    setFromHub(toHub);
    setToHub(tmp);
  }

  const hasFilter = !!fromHub || !!toHub || myRouteOnly;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.closeBtn}>✕</Text>
        </TouchableOpacity>
        <AppText variant="s2" style={s.headerTitle}>Lọc tuyến đường</AppText>
        <TouchableOpacity onPress={handleReset}>
          <AppText variant="p2" color={hasFilter ? 'primary' : 'textTertiary'}>Xoá</AppText>
        </TouchableOpacity>
      </View>

      {/* Route picker display */}
      <View style={s.routePicker}>
        <TouchableOpacity
          style={[s.routeBox, section === 'from' && s.routeBoxActive]}
          onPress={() => setSection('from')}
        >
          <Text style={s.routeBoxLabel}>TỪ</Text>
          <Text style={[s.routeBoxValue, !fromHub && s.routeBoxPlaceholder]} numberOfLines={1}>
            {fromHub?.shortName ?? 'Tất cả'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
          <Text style={s.swapIcon}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.routeBox, section === 'to' && s.routeBoxActive]}
          onPress={() => setSection('to')}
        >
          <Text style={s.routeBoxLabel}>ĐẾN</Text>
          <Text style={[s.routeBoxValue, !toHub && s.routeBoxPlaceholder]} numberOfLines={1}>
            {toHub?.shortName ?? 'Tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toggle — Tuyến của tôi */}
      <View style={s.toggleRow}>
        <View>
          <AppText variant="p2">Tuyến đường của tôi</AppText>
          <AppText variant="c2" color="textSecondary">Chỉ hiện đơn trên tuyến thường đi</AppText>
        </View>
        <Switch
          value={myRouteOnly}
          onValueChange={setMyRouteOnly}
          trackColor={{ false: colors.iron, true: colors.primaryLight }}
          thumbColor={myRouteOnly ? colors.primary : colors.white}
        />
      </View>

      <AppDivider margin={0} />

      {/* Hub list */}
      <ScrollView style={s.hubList} showsVerticalScrollIndicator={false}>
        <AppText variant="c1" color="textSecondary" style={s.sectionLabel}>
          {section === 'from' ? 'CHỌN ĐIỂM ĐI' : 'CHỌN ĐIỂM ĐẾN'}
        </AppText>

        {/* Clear option */}
        <HubRow
          hub={{ id: '', name: 'Tất cả điểm', shortName: 'Tất cả', address: '', city: 'HCM' }}
          selected={section === 'from' ? !fromHub : !toHub}
          onPress={() => section === 'from' ? setFromHub(undefined) : setToHub(undefined)}
        />

        {HUBS.map(hub => (
          <HubRow
            key={hub.id}
            hub={hub}
            selected={section === 'from' ? fromHub?.id === hub.id : toHub?.id === hub.id}
            onPress={() => {
              if (section === 'from') setFromHub(hub);
              else setToHub(hub);
            }}
          />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <AppButton
          label={`Lọc đơn${hasFilter ? ' ·  đang lọc' : ''}`}
          fullWidth
          onPress={() => onApply({ fromHub, toHub, myRouteOnly })}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  closeBtn:    { ...typography.s2, color: colors.textSecondary, marginRight: spacing.md } as object,
  headerTitle: { flex: 1 },

  routePicker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  routeBox: {
    flex: 1, paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.background,
  },
  routeBoxActive:      { borderColor: colors.primary, backgroundColor: colors.surfacePeach },
  routeBoxLabel:       { ...typography.tiny, color: colors.textTertiary, fontWeight: '700', marginBottom: 2 } as object,
  routeBoxValue:       { ...typography.p2, color: colors.text } as object,
  routeBoxPlaceholder: { color: colors.textTertiary },

  swapBtn: {
    width: 36, height: 36, marginHorizontal: spacing.sm,
    borderRadius: 18, backgroundColor: colors.fill,
    alignItems: 'center', justifyContent: 'center',
  },
  swapIcon: { ...typography.s2, color: colors.textSecondary } as object,

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
  },

  hubList:     { flex: 1 },
  sectionLabel: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm, letterSpacing: 0.5 },

  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg + (Platform.OS === 'ios' ? 20 : 0),
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.borderSubtle,
  },
});

const r = StyleSheet.create({
  hubRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  hubRowSelected: { backgroundColor: colors.surfacePeach },
  hubInfo:   { flex: 1 },
  hubName:   { ...typography.p2, color: colors.text } as object,
  hubNameSelected: { color: colors.primary, fontWeight: '700' },
  hubCity:   { ...typography.c2, color: colors.textSecondary } as object,
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
});
