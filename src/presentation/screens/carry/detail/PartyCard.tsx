import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../../common/theme';
import { AppAvatar } from '../../../components/shared/AppAvatar';
import { CarryUser } from '../../../../modules/carry/types';

interface PartyCardProps {
  sender: CarryUser;
  receiver: CarryUser;
  carrier?: CarryUser;
  onContact?: (user: CarryUser) => void;
}

const PartyRow: React.FC<{
  role: string;
  user: CarryUser;
  highlight?: boolean;
  onContact?: () => void;
}> = ({ role, user, highlight, onContact }) => (
  <View style={[p.row, highlight && p.rowHighlight]}>
    <AppAvatar name={user.name} size="sm" />
    <View style={p.info}>
      <Text style={p.role}>{role}</Text>
      <Text style={p.name}>{user.name}</Text>
      <Text style={p.dept}>{user.dept}</Text>
    </View>
    {onContact && (
      <TouchableOpacity style={p.contactBtn} onPress={onContact}>
        <Text style={p.contactIcon}>💬</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const PartyCard: React.FC<PartyCardProps> = ({ sender, receiver, carrier, onContact }) => (
  <View style={p.card}>
    <Text style={p.title}>Các bên tham gia</Text>
    <PartyRow role="Người gửi"  user={sender}   onContact={onContact ? () => onContact(sender) : undefined} />
    <PartyRow role="Người nhận" user={receiver} onContact={onContact ? () => onContact(receiver) : undefined} />
    {carrier && (
      <PartyRow role="Người chở" user={carrier} highlight onContact={onContact ? () => onContact(carrier) : undefined} />
    )}
    {!carrier && (
      <View style={p.emptyCarrier}>
        <Text style={p.emptyCarrierText}>Chưa có người nhận chở</Text>
      </View>
    )}
  </View>
);

const p = StyleSheet.create({
  card:  {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, ...(shadows.card as object),
  },
  title: { ...typography.c1, color: colors.textSecondary, marginBottom: spacing.md, fontWeight: '700' } as object,
  row:   { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  rowHighlight: { backgroundColor: colors.surfacePeach, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, marginHorizontal: -spacing.sm },
  info:  { flex: 1, marginLeft: spacing.md },
  role:  { ...typography.tiny, color: colors.textTertiary, fontWeight: '700' } as object,
  name:  { ...typography.p2, color: colors.text } as object,
  dept:  { ...typography.c2, color: colors.textSecondary } as object,
  contactBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' },
  contactIcon: { fontSize: 16 },
  emptyCarrier: { paddingVertical: spacing.sm, alignItems: 'center' },
  emptyCarrierText: { ...typography.c2, color: colors.textTertiary } as object,
});
