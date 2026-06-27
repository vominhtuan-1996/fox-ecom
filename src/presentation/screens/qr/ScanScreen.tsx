import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Animated,
  StyleSheet, Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';
import { AppButton } from '../../components/shared/AppButton';
import { AppText } from '../../components/shared/AppText';
import { QrService } from '../../../modules/qr/QrService';
import { useHaptic } from '../../hooks/useHaptic';

type QrType = 'pickup' | 'dropoff';
type ScanResult = 'ok' | 'wrong' | 'expired' | 'used' | null;

interface ScanScreenProps {
  orderId: string;
  type: QrType;
  onBack?: () => void;
  onSuccess?: (result: 'ok' | 'wrong' | 'expired' | 'used') => void;
}

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);
const SCAN_SIZE = 240;
const CONTEXT: Record<QrType, string> = {
  pickup:  'Quét mã của người gửi để nhận hàng',
  dropoff: 'Quét mã của người nhận để xác nhận bàn giao',
};
const RESULT_MSG: Record<Exclude<ScanResult, null>, string> = {
  ok:      '✅ Xác nhận thành công!',
  wrong:   '❌ Mã không đúng, thử lại',
  expired: '⏰ Mã đã hết hạn — yêu cầu người kia làm mới',
  used:    '⚠️ Mã đã được dùng rồi',
};

export const ScanScreen: React.FC<ScanScreenProps> = ({ orderId, type, onBack, onSuccess }) => {
  const [mode, setMode]     = useState<'camera' | 'manual'>('camera');
  const [code, setCode]     = useState('');
  const [result, setResult] = useState<ScanResult>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const haptic   = useHaptic();

  // Scanline animation
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: SCAN_SIZE - 4, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0,             duration: 2000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  function handleCodeChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    setResult(null);
    if (digits.length === 6) validate(digits);
  }

  function validate(input: string) {
    setLoading(true);
    // ponytail: setTimeout 0 để UI flush trước khi validate
    setTimeout(() => {
      const r = QrService.validateCode(orderId, type, input);
      setResult(r);
      setLoading(false);
      haptic.trigger(r === 'ok' ? 'success' : 'error');
      if (r === 'ok') setTimeout(() => onSuccess?.(r), 800);
      else onSuccess?.(r);
    }, 0);
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0E1424" />

      {/* Header */}
      <View style={[s.header, { paddingTop: STATUS_H + spacing.sm }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        )}
        <AppText variant="s2" color="white" style={s.title}>Quét mã QR</AppText>
        <View style={s.flex} />
      </View>

      {/* Context */}
      <AppText variant="p2" color="white" align="center" style={s.desc}>
        {CONTEXT[type]}
      </AppText>

      {mode === 'camera' ? (
        <View style={s.cameraArea}>
          {/* Scan frame */}
          <View style={s.frame}>
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />
            {/* Scanline */}
            <Animated.View style={[s.scanLine, { transform: [{ translateY: scanY }] }]} />
            {/* Camera placeholder */}
            <View style={s.cameraPlaceholder}>
              <Text style={s.cameraIcon}>📷</Text>
              <AppText variant="c2" color="white" align="center" style={{ marginTop: spacing.sm }}>
                Camera cần quyền truy cập
              </AppText>
            </View>
          </View>

          <TouchableOpacity style={s.manualBtn} onPress={() => { setMode('manual'); setTimeout(() => inputRef.current?.focus(), 100); }}>
            <Text style={s.manualBtnText}>Nhập mã 6 số</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.manualArea}>
          <AppText variant="p2" color="white" align="center" style={{ marginBottom: spacing.xl }}>
            Nhập mã 6 số từ màn hình người kia
          </AppText>

          {/* 6 ô số */}
          <View style={s.codeRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[s.digitBox, code.length === i && s.digitBoxActive, result === 'ok' && s.digitBoxOk, result && result !== 'ok' && s.digitBoxError]}>
                <Text style={s.digitText}>{code[i] ?? ''}</Text>
              </View>
            ))}
          </View>

          {/* Hidden input */}
          <TextInput
            ref={inputRef}
            style={s.hiddenInput}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            caretHidden
          />

          <TouchableOpacity style={s.codeRowTap} onPress={() => inputRef.current?.focus()} />

          {/* Result */}
          {result && (
            <AppText
              variant="p2"
              color={result === 'ok' ? 'success' : 'error'}
              align="center"
              style={s.resultMsg}
            >
              {RESULT_MSG[result]}
            </AppText>
          )}

          {result && result !== 'ok' && (
            <AppButton label="Thử lại" variant="outline" size="sm"
              onPress={() => { setCode(''); setResult(null); inputRef.current?.focus(); }}
              style={s.retryBtn} labelStyle={{ color: colors.white }}
            />
          )}

          <TouchableOpacity style={s.backToCamera} onPress={() => { setMode('camera'); setCode(''); setResult(null); }}>
            <Text style={s.backToCameraText}>← Quay lại quét QR</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const CORNER = 20;
const BORDER = 3;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E1424' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  back:  { ...typography.h3, color: colors.white, lineHeight: 28, marginRight: spacing.md } as object,
  title: { flex: 1 },
  flex:  { flex: 1 },
  desc:  { paddingHorizontal: spacing['3xl'], marginBottom: spacing['2xl'] },

  // Camera mode
  cameraArea: { flex: 1, alignItems: 'center' },
  frame: {
    width: SCAN_SIZE, height: SCAN_SIZE,
    position: 'relative',
    marginBottom: spacing['2xl'],
  },
  corner: {
    position: 'absolute',
    width: CORNER, height: CORNER,
    borderColor: colors.primary,
  },
  cornerTL: { top: 0, left: 0,  borderTopWidth: BORDER, borderLeftWidth: BORDER },
  cornerTR: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  cornerBL: { bottom: 0, left: 0,  borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  scanLine: {
    position: 'absolute', left: 4, right: 4, height: 2,
    backgroundColor: colors.primary, opacity: 0.8,
  },
  cameraPlaceholder: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.sm,
  },
  cameraIcon: { fontSize: 40 },
  manualBtn:  {
    paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.pill, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  manualBtnText: { ...typography.p2, color: colors.white } as object,

  // Manual mode
  manualArea: { flex: 1, alignItems: 'center', paddingTop: spacing['2xl'], paddingHorizontal: spacing.xl },
  codeRow:    { flexDirection: 'row', marginBottom: spacing.lg },
  codeRowTap: { position: 'absolute', width: 280, height: 60, top: 56 },
  digitBox:   {
    width: 40, height: 52, borderRadius: borderRadius.sm,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 3,
  },
  digitBoxActive: { borderColor: colors.primary },
  digitBoxOk:     { borderColor: colors.success, backgroundColor: 'rgba(11,215,140,0.1)' },
  digitBoxError:  { borderColor: colors.error,   backgroundColor: 'rgba(244,63,74,0.1)' },
  digitText:      { ...typography.h4, color: colors.white } as object,
  hiddenInput:    { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resultMsg:      { marginBottom: spacing.lg },
  retryBtn:       { marginBottom: spacing.lg, borderColor: 'rgba(255,255,255,0.4)' },
  backToCamera:   { marginTop: spacing.md },
  backToCameraText: { ...typography.p2, color: 'rgba(255,255,255,0.5)' } as object,
});
