import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../common/theme';
import { AppButton } from '../../components/shared/AppButton';
import { AppText } from '../../components/shared/AppText';
import { QrMatrix } from './QrMatrix';
import { QrService } from '../../../modules/qr/QrService';

type QrType = 'pickup' | 'dropoff';

interface ShowQrScreenProps {
  orderId: string;
  type: QrType;
  onBack?: () => void;
}

const CONTEXT: Record<QrType, { title: string; desc: string; emoji: string }> = {
  pickup:  { title: 'Mã giao hàng',   desc: 'Đưa mã này cho người chở quét trước khi nhận hàng', emoji: '📦' },
  dropoff: { title: 'Mã nhận hàng',   desc: 'Đưa mã này cho người nhận quét để xác nhận bàn giao', emoji: '✅' },
};

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export const ShowQrScreen: React.FC<ShowQrScreenProps> = ({ orderId, type, onBack }) => {
  const [code, setCode] = useState(() => QrService.generateCode(orderId, type));
  const [remaining, setRemaining] = useState(() => QrService.getRemainingSeconds(orderId, type));

  const refresh = useCallback(() => {
    const newCode = QrService.generateCode(orderId, type);
    setCode(newCode);
    setRemaining(QrService.getRemainingSeconds(orderId, type));
  }, [orderId, type]);

  // Countdown + auto-refresh
  useEffect(() => {
    const tick = setInterval(() => {
      const r = QrService.getRemainingSeconds(orderId, type);
      setRemaining(r);
      if (r === 0) refresh();
    }, 1000);
    return () => clearInterval(tick);
  }, [orderId, type, refresh]);

  const ctx = CONTEXT[type];
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isExpiringSoon = remaining <= 60;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={s.backBtn}>
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
        )}
        <AppText variant="s2">{ctx.title}</AppText>
        <View style={s.flex} />
      </View>

      <View style={s.body}>
        {/* Context */}
        <Text style={s.emoji}>{ctx.emoji}</Text>
        <AppText variant="p2" color="textSecondary" align="center" style={s.desc}>
          {ctx.desc}
        </AppText>

        {/* QR card */}
        <View style={s.qrCard}>
          <QrMatrix code={code} size={200} />
        </View>

        {/* 6-digit code */}
        <View style={s.codeRow}>
          {code.split('').map((digit, i) => (
            <View key={i} style={s.digitBox}>
              <Text style={s.digit}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Timer */}
        <View style={s.timerRow}>
          <Text style={[s.timer, isExpiringSoon && s.timerWarn]}>
            {`${mins}:${String(secs).padStart(2, '0')}`}
          </Text>
          <AppText variant="c2" color="textTertiary"> · Mã dùng một lần</AppText>
        </View>

        {isExpiringSoon && (
          <AppButton
            label="Làm mới mã"
            variant="outline"
            size="sm"
            onPress={refresh}
            style={s.refreshBtn}
          />
        )}

        <AppText variant="c2" color="textTertiary" align="center" style={s.hint}>
          Mã tự động làm mới sau 5 phút
        </AppText>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  backBtn:   { marginRight: spacing.md },
  backArrow: { ...typography.h3, color: colors.text, lineHeight: 28 } as object,
  flex:      { flex: 1 },

  body: {
    flex: 1, alignItems: 'center',
    paddingTop: spacing['2xl'],
    paddingHorizontal: spacing['2xl'],
  },

  emoji: { fontSize: 40, marginBottom: spacing.md },
  desc:  { marginBottom: spacing['2xl'] },

  qrCard: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...(shadows.card as object),
    marginBottom: spacing.xl,
  },

  codeRow: { flexDirection: 'row', marginBottom: spacing.lg },
  digitBox: {
    width: 40, height: 52,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 3,
  },
  digit: { ...typography.h4, color: colors.text, letterSpacing: 2 } as object,

  timerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  timer:    { ...typography.s2, color: colors.text } as object,
  timerWarn:{ color: colors.error },

  refreshBtn: { marginBottom: spacing.lg },
  hint:       { marginTop: spacing.sm },
});
