import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '../../../common/theme';
import { AppText } from '../../components/shared/AppText';
import { AppInput } from '../../components/shared/AppInput';
import { AppButton } from '../../components/shared/AppButton';
import { AppAvatar } from '../../components/shared/AppAvatar';
import { RankService } from '../../../modules/rank/RankService';
import { HUBS } from '../../../modules/carry/CarryService';

const AVATAR_COLORS = [
  '#FF8500','#5933EB','#0BD78C','#16ADFF',
  '#F43F4A','#FFA800','#6E4BFF','#3C4459',
];

interface EditProfileScreenProps {
  userId?: string;
  onBack?: () => void;
  onSaved?: () => void;
}


export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  userId = 'u1',
  onBack,
  onSaved,
}) => {
  const user = RankService.getUser(userId);
  const [displayName,  setDisplayName]  = useState(user?.name ?? '');
  const [avatarColor,  setAvatarColor]  = useState(AVATAR_COLORS[0]);
  const [defaultFrom,  setDefaultFrom]  = useState(HUBS[0].id);
  const [defaultTo,    setDefaultTo]    = useState(HUBS[1].id);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSaved?.(); }, 600);
  }

  return (
    <View style={s.root}>

      <View style={[s.header, { paddingTop: spacing.sm }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <AppText variant="s2">Chỉnh sửa hồ sơ</AppText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

        {/* Avatar preview + color picker */}
        <View style={s.avatarSection}>
          <AppAvatar name={displayName || user?.name} size="xl" color={avatarColor} />
          <AppText variant="c2" color="textSecondary" style={s.avatarHint}>Chọn màu avatar</AppText>
          <View style={s.colorRow}>
            {AVATAR_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[s.colorDot, { backgroundColor: c }, avatarColor === c && s.colorDotActive]}
                onPress={() => setAvatarColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Display name */}
        <AppInput
          label="Tên hiển thị"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Nhập tên hiển thị..."
        />

        {/* Default route */}
        <AppText variant="c1" color="textSecondary" style={s.sectionLabel}>TUYẾN THƯỜNG ĐI</AppText>
        <View style={s.routeRow}>
          <View style={s.routePicker}>
            <AppText variant="c2" color="textTertiary">Điểm đi</AppText>
            {HUBS.map(h => (
              <TouchableOpacity
                key={h.id}
                style={[s.hubOpt, defaultFrom === h.id && s.hubOptActive]}
                onPress={() => setDefaultFrom(h.id)}
              >
                <Text style={[s.hubOptText, defaultFrom === h.id && s.hubOptTextActive]}
                  numberOfLines={1}>
                  {h.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.routeArrow}>→</Text>
          <View style={s.routePicker}>
            <AppText variant="c2" color="textTertiary">Điểm đến</AppText>
            {HUBS.map(h => (
              <TouchableOpacity
                key={h.id}
                style={[s.hubOpt, defaultTo === h.id && s.hubOptActive]}
                onPress={() => setDefaultTo(h.id)}
              >
                <Text style={[s.hubOptText, defaultTo === h.id && s.hubOptTextActive]}
                  numberOfLines={1}>
                  {h.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppButton
          label="Lưu thay đổi"
          fullWidth
          loading={saving}
          onPress={handleSave}
          style={s.saveBtn}
        />

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

  body:          { padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarHint:    { marginTop: spacing.md, marginBottom: spacing.sm },
  colorRow:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  colorDot:      { width: 32, height: 32, borderRadius: 16, margin: 4 },
  colorDotActive:{ borderWidth: 3, borderColor: colors.bigStone },

  sectionLabel:  { marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
  routeRow:      { flexDirection: 'row', alignItems: 'flex-start' },
  routeArrow:    { ...typography.h4, color: colors.textTertiary, marginTop: 32, marginHorizontal: spacing.xs } as object,
  routePicker:   { flex: 1 },
  hubOpt:        {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    marginBottom: spacing.xs, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  hubOptActive:  { borderColor: colors.primary, backgroundColor: colors.surfacePeach, borderWidth: 2 },
  hubOptText:    { ...typography.c1, color: colors.textSecondary } as object,
  hubOptTextActive: { color: colors.primary, fontWeight: '700' },
  saveBtn:       { marginTop: spacing['2xl'] },
});
