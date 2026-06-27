import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, FlatList, Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../../../common/theme';
import { AppButton } from '../../components/shared/AppButton';
import { AppInput } from '../../components/shared/AppInput';
import { AppText } from '../../components/shared/AppText';
import { AppCard } from '../../components/shared/AppCard';
import { AppBadge } from '../../components/shared/AppBadge';
import { CarryService, calcEstimate, HUBS } from '../../../modules/carry/CarryService';
import { Hub, ItemSize, CarryUser, CreateOrderInput } from '../../../modules/carry/types';

interface CreateScreenProps {
  onBack?: () => void;
  onCreated?: (orderId: string) => void;
  currentUser?: CarryUser;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

const SIZE_OPTIONS: { key: ItemSize; label: string; sub: string }[] = [
  { key: 'S', label: 'Nhỏ', sub: '< 2 kg' },
  { key: 'M', label: 'Vừa', sub: '2–5 kg' },
  { key: 'L', label: 'Lớn', sub: '> 5 kg' },
];

function formatVnd(n: number): string {
  return n > 0 ? n.toLocaleString('vi-VN') + ' đ' : '—';
}

// ── Hub picker sheet ─────────────────────────────────────────────────────────
const HubSheet: React.FC<{
  visible: boolean;
  title: string;
  selected?: Hub;
  onSelect: (h: Hub) => void;
  onClose: () => void;
}> = ({ visible, title, selected, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={sh.overlay} onPress={onClose} activeOpacity={1} />
    <View style={sh.sheet}>
      <Text style={sh.sheetTitle}>{title}</Text>
      {HUBS.map(hub => (
        <TouchableOpacity
          key={hub.id}
          style={[sh.hubRow, selected?.id === hub.id && sh.hubRowActive]}
          onPress={() => { onSelect(hub); onClose(); }}
        >
          <View style={sh.flex}>
            <Text style={sh.hubName}>{hub.name}</Text>
            <Text style={sh.hubAddr}>{hub.address}</Text>
          </View>
          {selected?.id === hub.id && <Text style={sh.check}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  </Modal>
);

// ── Receiver picker sheet ────────────────────────────────────────────────────
const ReceiverSheet: React.FC<{
  visible: boolean;
  selected?: CarryUser;
  onSelect: (u: CarryUser) => void;
  onClose: () => void;
}> = ({ visible, selected, onSelect, onClose }) => {
  const [q, setQ] = useState('');
  const users = useMemo(() => CarryService.searchUsers(q), [q]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={sh.overlay} onPress={onClose} activeOpacity={1} />
      <View style={[sh.sheet, { maxHeight: '70%' }]}>
        <Text style={sh.sheetTitle}>Chọn người nhận</Text>
        <AppInput
          placeholder="Tìm tên hoặc phòng ban..."
          value={q}
          onChangeText={setQ}
          autoFocus
          containerStyle={{ marginBottom: spacing.sm }}
        />
        <FlatList
          data={users}
          keyExtractor={u => u.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[sh.hubRow, selected?.id === item.id && sh.hubRowActive]}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <View style={sh.flex}>
                <Text style={sh.hubName}>{item.name}</Text>
                <Text style={sh.hubAddr}>{item.dept}</Text>
              </View>
              {selected?.id === item.id && <Text style={sh.check}>✓</Text>}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

// ── Main screen ──────────────────────────────────────────────────────────────
export const CreateScreen: React.FC<CreateScreenProps> = ({
  onBack,
  onCreated,
  currentUser = { id: 'u1', name: 'Nguyễn Văn A', dept: 'Phòng CNTT' },
}) => {
  const [fromHub, setFromHub] = useState<Hub | undefined>(HUBS[0]);
  const [toHub,   setToHub]   = useState<Hub | undefined>();
  const [receiver, setReceiver] = useState<CarryUser | undefined>();
  const [itemDesc, setItemDesc] = useState('');
  const [size, setSize]         = useState<ItemSize>('S');
  const [valueVnd, setValueVnd] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo,   setShowTo]   = useState(false);
  const [showRx,   setShowRx]   = useState(false);

  const estimate = useMemo(
    () => fromHub && toHub ? calcEstimate(fromHub.id, toHub.id, size) : null,
    [fromHub, toHub, size],
  );

  const canSubmit = !!fromHub && !!toHub && fromHub.id !== toHub.id && !!receiver && !!itemDesc.trim();

  function handleCreate() {
    if (!canSubmit || !fromHub || !toHub || !receiver) return;
    setLoading(true);
    const deadline = new Date(Date.now() + 24 * 3600000).toISOString();
    const input: CreateOrderInput = {
      fromHubId: fromHub.id,
      toHubId:   toHub.id,
      receiverId: receiver.id,
      itemDesc: itemDesc.trim(),
      itemSize: size,
      itemValueVnd: parseInt(valueVnd.replace(/\D/g, ''), 10) || 0,
      deadline,
    };
    const order = CarryService.createOrder(input, currentUser);
    setLoading(false);
    onCreated?.(order.id);
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        <View style={s.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.backArrow}>‹</Text>
            </TouchableOpacity>
          )}
          <Text style={s.headerTitle}>Đăng đơn giao hàng</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent} keyboardShouldPersistTaps="handled">

        {/* Tuyến đường */}
        <AppText variant="c1" color="textSecondary" style={s.fieldLabel}>TUYẾN ĐƯỜNG</AppText>
        <View style={s.routeRow}>
          <TouchableOpacity style={[s.hubPicker, fromHub && s.hubPickerFilled]} onPress={() => setShowFrom(true)}>
            <Text style={s.hubPickerLabel} numberOfLines={1}>
              {fromHub ? fromHub.shortName : 'Điểm đi'}
            </Text>
          </TouchableOpacity>
          <Text style={s.routeArrow}>→</Text>
          <TouchableOpacity style={[s.hubPicker, toHub && s.hubPickerFilled]} onPress={() => setShowTo(true)}>
            <Text style={s.hubPickerLabel} numberOfLines={1}>
              {toHub ? toHub.shortName : 'Điểm đến'}
            </Text>
          </TouchableOpacity>
        </View>
        {fromHub && toHub && fromHub.id === toHub.id && (
          <AppText variant="c2" color="error" style={{ marginBottom: spacing.sm }}>Điểm đi và đến phải khác nhau</AppText>
        )}

        {/* Người nhận */}
        <AppText variant="c1" color="textSecondary" style={s.fieldLabel}>NGƯỜI NHẬN</AppText>
        <TouchableOpacity style={[s.hubPicker, s.receiverPicker, receiver && s.hubPickerFilled]} onPress={() => setShowRx(true)}>
          <View>
            <Text style={s.hubPickerLabel}>{receiver ? receiver.name : 'Chọn đồng nghiệp...'}</Text>
            {receiver && <Text style={s.receiverDept}>{receiver.dept}</Text>}
          </View>
        </TouchableOpacity>

        {/* Mô tả */}
        <AppInput
          label="Mô tả hàng hóa"
          placeholder="VD: Tài liệu A4, hộp bánh ngọt, máy tính xách tay..."
          value={itemDesc}
          onChangeText={setItemDesc}
          multiline
          containerStyle={{ marginTop: spacing.md }}
        />

        {/* Kích thước */}
        <AppText variant="c1" color="textSecondary" style={s.fieldLabel}>KÍCH THƯỚC</AppText>
        <View style={s.sizeRow}>
          {SIZE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.sizeOption, size === opt.key && s.sizeOptionActive]}
              onPress={() => setSize(opt.key)}
            >
              <Text style={[s.sizeLabel, size === opt.key && s.sizeLabelActive]}>{opt.label}</Text>
              <Text style={s.sizeSub}>{opt.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Giá trị */}
        <AppInput
          label="Giá trị hàng (đ)"
          placeholder="0 — tối đa 500.000 đ"
          value={valueVnd}
          onChangeText={v => setValueVnd(v.replace(/\D/g, ''))}
          keyboardType="numeric"
          containerStyle={{ marginTop: spacing.md }}
          hint="Giới hạn bồi thường theo nội quy công ty"
        />

        {/* Reward preview */}
        {estimate && (
          <AppCard style={s.rewardCard} elevated>
            <AppText variant="c1" color="textSecondary" style={{ marginBottom: spacing.sm }}>ƯỚC TÍNH</AppText>
            <View style={s.rewardRow}>
              <View style={s.rewardItem}>
                <AppText variant="s2" color="primary">+{estimate.points}</AppText>
                <AppText variant="c2" color="textSecondary">điểm thưởng</AppText>
              </View>
              <View style={s.rewardItem}>
                <AppText variant="s2" color="green">🌿 {estimate.co2Kg} kg</AppText>
                <AppText variant="c2" color="textSecondary">CO₂ tiết kiệm</AppText>
              </View>
              <View style={s.rewardItem}>
                <AppText variant="s2" color="textStrong">{estimate.km} km</AppText>
                <AppText variant="c2" color="textSecondary">quãng đường</AppText>
              </View>
            </View>
          </AppCard>
        )}

        {/* Disclaimer */}
        <AppText variant="c2" color="textTertiary" style={s.disclaimer}>
          Bằng cách đăng đơn, bạn đồng ý với quy định giao nhận nội bộ FPT Telecom. Mọi tranh chấp sẽ được xử lý theo chính sách công ty.
        </AppText>

        <AppButton
          label="Đăng đơn"
          fullWidth
          loading={loading}
          disabled={!canSubmit}
          onPress={handleCreate}
          style={s.submitBtn}
        />

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      <HubSheet visible={showFrom} title="Chọn điểm đi" selected={fromHub} onSelect={setFromHub} onClose={() => setShowFrom(false)} />
      <HubSheet visible={showTo}   title="Chọn điểm đến" selected={toHub} onSelect={setToHub}   onClose={() => setShowTo(false)} />
      <ReceiverSheet visible={showRx} selected={receiver} onSelect={setReceiver} onClose={() => setShowRx(false)} />
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.background },
  header:      { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerRow:   { flexDirection: 'row', alignItems: 'center' },
  backArrow:   { ...typography.h3, color: colors.white, lineHeight: 28, marginRight: spacing.md } as object,
  headerTitle: { ...typography.s1, color: colors.white } as object,

  body:        { flex: 1 },
  bodyContent: { padding: spacing.lg },
  fieldLabel:  { marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },

  routeRow:    { flexDirection: 'row', alignItems: 'center' },
  routeArrow:  { ...typography.h4, color: colors.textTertiary, marginHorizontal: spacing.sm } as object,
  hubPicker:   {
    flex: 1, height: layout.fieldHeight,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.sm, backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg, justifyContent: 'center',
  },
  hubPickerFilled: { borderColor: colors.primary, borderWidth: 2 },
  hubPickerLabel:  { ...typography.p2, color: colors.text } as object,
  receiverPicker:  { height: 'auto' as any, paddingVertical: spacing.md, flex: undefined, alignSelf: 'stretch' },
  receiverDept:    { ...typography.c2, color: colors.textSecondary, marginTop: 2 } as object,

  sizeRow:   { flexDirection: 'row' },
  sizeOption: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.sm, backgroundColor: colors.surface,
  },
  sizeOptionActive: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.surfacePeach },
  sizeLabel:        { ...typography.s2, color: colors.textSecondary } as object,
  sizeLabelActive:  { color: colors.primary },
  sizeSub:          { ...typography.c2, color: colors.textTertiary } as object,

  rewardCard: { marginTop: spacing.xl },
  rewardRow:  { flexDirection: 'row' },
  rewardItem: { flex: 1, alignItems: 'center' },

  disclaimer: { marginTop: spacing.lg, marginBottom: spacing.md, lineHeight: 18 },
  submitBtn:  { marginTop: spacing.sm },
});

const sh = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:     {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg,
    padding: spacing.xl, paddingBottom: spacing['3xl'],
    maxHeight: '60%',
  },
  sheetTitle:  { ...typography.s2, color: colors.text, marginBottom: spacing.lg } as object,
  hubRow:      {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  hubRowActive: { backgroundColor: colors.surfacePeach },
  flex:         { flex: 1 },
  hubName:      { ...typography.p2, color: colors.text } as object,
  hubAddr:      { ...typography.c2, color: colors.textSecondary, marginTop: 2 } as object,
  check:        { ...typography.s2, color: colors.primary } as object,
});
