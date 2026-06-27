import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import { AppTransferFileConfig, AppTransferType } from '../models/dialog_config';
import { colors } from '../../../../common/theme/colors';
import { spacing } from '../../../../common/theme/spacing';
import { typography } from '../../../../common/theme/typography';
import { SdkStrings } from '../../../../common/language';

interface Props {
  files: AppTransferFileConfig[];
  type: AppTransferType;
  title?: string;
  onCompleted?: () => void;
  onCanceled?: () => void;
}

/**
 * MultiTransferDialog — dialog truyền tải nhiều tệp tuần tự.
 * Tương đương AppMultiTransferDialog trong Flutter.
 */
export const MultiTransferDialog: React.FC<Props> = ({
  files,
  type,
  title,
  onCompleted,
  onCanceled,
}) => {
  const [progresses, setProgresses] = useState<number[]>(files.map(() => 0));
  const [completed, setCompleted] = useState<boolean[]>(files.map(() => false));
  const [failed, setFailed] = useState<boolean[]>(files.map(() => false));
  const [errors, setErrors] = useState<(string | null)[]>(files.map(() => null));
  const [isCanceled, setIsCanceled] = useState(false);
  const currentRef = useRef(0);

  const heading = title ?? (type === 'download' ? 'Tải xuống tệp tin' : 'Tải lên tệp tin');
  const icon = type === 'download' ? '⬇️' : '⬆️';

  useEffect(() => { runQueue(); }, []);

  const runQueue = async () => {
    for (let i = 0; i < files.length; i++) {
      if (isCanceled) break;
      currentRef.current = i;
      try {
        await files[i].transferAction((progress) => {
          setProgresses(prev => { const next = [...prev]; next[i] = progress; return next; });
        });
        setCompleted(prev => { const next = [...prev]; next[i] = true; return next; });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi';
        setFailed(prev => { const next = [...prev]; next[i] = true; return next; });
        setErrors(prev => { const next = [...prev]; next[i] = msg; return next; });
        break;
      }
    }
    if (!isCanceled) onCompleted?.();
  };

  const handleCancel = () => {
    setIsCanceled(true);
    onCanceled?.();
  };

  const allDone = completed.every(Boolean);
  const hasFailed = failed.some(Boolean);

  return (
    <View style={s.container}>
      <Text style={s.title}>{icon}  {heading}</Text>
      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {files.map((file, i) => (
          <FileRow
            key={i}
            name={file.name}
            sizeInMB={file.sizeInMB}
            progress={progresses[i]}
            isCompleted={completed[i]}
            isFailed={failed[i]}
            error={errors[i]}
            isActive={currentRef.current === i && !completed[i] && !failed[i]}
          />
        ))}
      </ScrollView>

      <View style={s.footer}>
        {allDone && (
          <Text style={s.doneText}>✅ Hoàn tất {files.length} tệp</Text>
        )}
        {hasFailed && (
          <Text style={s.failText}>❌ Gặp lỗi khi truyền tải</Text>
        )}
        {!allDone && !hasFailed && (
          <TouchableOpacity style={s.cancelBtn} onPress={handleCancel}>
            <Text style={s.cancelText}>{SdkStrings.common.cancel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ── File row ─────────────────────────────────────────────────────────────────

interface FileRowProps {
  name: string;
  sizeInMB: number;
  progress: number;
  isCompleted: boolean;
  isFailed: boolean;
  error: string | null;
  isActive: boolean;
}

const FileRow: React.FC<FileRowProps> = ({ name, sizeInMB, progress, isCompleted, isFailed, error, isActive }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const trackColor = isFailed ? colors.error : isCompleted ? '#16A34A' : colors.secondaryLight;

  return (
    <View style={r.row}>
      <View style={r.info}>
        <Text style={r.name} numberOfLines={1}>{name}</Text>
        <Text style={r.size}>{sizeInMB.toFixed(1)} MB</Text>
      </View>
      <View style={r.track}>
        <Animated.View style={[r.fill, {
          width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          backgroundColor: trackColor,
        }]} />
      </View>
      <Text style={[r.pct, { color: trackColor }]}>
        {isFailed ? '❌' : isCompleted ? '✅' : `${Math.round(progress * 100)}%`}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing['2xl'],
    maxWidth: 480,
    width: '100%',
  },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.lg, textAlign: 'center' },
  list: { maxHeight: 280 },
  footer: { marginTop: spacing.lg, alignItems: 'center' },
  doneText: { ...typography.bodyMedium, color: '#16A34A' },
  failText: { ...typography.bodyMedium, color: colors.error },
  cancelBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: spacing['2xl'], paddingVertical: 10 },
  cancelText: { ...typography.label, color: colors.textSecondary },
});

const r = StyleSheet.create({
  row: { marginBottom: spacing.md },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { ...typography.bodySm, color: colors.text, flex: 1 },
  size: { ...typography.caption, color: colors.textTertiary, marginLeft: spacing.sm },
  track: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  pct: { ...typography.caption, marginTop: 2, textAlign: 'right' },
});
