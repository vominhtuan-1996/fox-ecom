import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import { colors } from '../../../../common/theme/colors';
import { spacing } from '../../../../common/theme/spacing';
import { typography } from '../../../../common/theme/typography';

interface Props {
  version: string;
  changelog: string[];
  onUpdate: () => void;
  progress?: number;
  isDownloading?: boolean;
  /** Bật nút mô phỏng tiến trình (demo) */
  showSimulator?: boolean;
  autoSimulate?: boolean;
}

/**
 * UpdatePatchDialog — dialog cập nhật hot patch với header gradient và progress button.
 * Tương đương AppUpdatePatchDialog trong Flutter.
 */
export const UpdatePatchDialog: React.FC<Props> = ({
  version,
  changelog,
  onUpdate,
  progress: initialProgress = 0,
  isDownloading: initialDownloading = false,
  showSimulator = false,
  autoSimulate = false,
}) => {
  const [currentProgress, setCurrentProgress] = useState(initialProgress);
  const [isDownloading, setIsDownloading] = useState(initialDownloading);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const widthAnim = useRef(new Animated.Value(initialProgress)).current;

  useEffect(() => {
    if (isDownloading && autoSimulate) startSimulation();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: currentProgress,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [currentProgress]);

  const startSimulation = () => {
    timerRef.current = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 1) {
          clearInterval(timerRef.current!);
          setIsDownloading(false);
          return 1;
        }
        return Math.min(prev + 0.01, 1);
      });
    }, 50);
  };

  const handleUpdate = () => {
    setIsDownloading(true);
    if (autoSimulate) startSimulation();
    onUpdate();
  };

  const pct = Math.round(currentProgress * 100);
  const isDone = currentProgress >= 1;

  return (
    <View style={s.container}>
      {/* Gradient header */}
      <View style={s.header}>
        <Text style={s.headerEmoji}>🚀</Text>
        <Text style={s.headerTitle}>Cập nhật mới</Text>
        <View style={s.versionBadge}>
          <Text style={s.versionText}>v{version}</Text>
        </View>
      </View>

      {/* Changelog */}
      <View style={s.body}>
        <Text style={s.changelogTitle}>Nội dung cập nhật</Text>
        <ScrollView style={s.changelogScroll} showsVerticalScrollIndicator={false}>
          {changelog.map((item, i) => (
            <View key={i} style={s.changelogRow}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.changelogItem}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Progress bar */}
      {isDownloading && (
        <View style={s.progressWrap}>
          <View style={s.progressTrack}>
            <Animated.View style={[s.progressFill, {
              width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]} />
          </View>
          <Text style={s.progressPct}>{isDone ? '✅ Hoàn tất' : `${pct}%`}</Text>
        </View>
      )}

      {/* Footer buttons */}
      <View style={s.footer}>
        {showSimulator && !isDownloading && (
          <TouchableOpacity style={s.simBtn} onPress={startSimulation}>
            <Text style={s.simText}>▶ Mô phỏng</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[s.updateBtn, isDownloading && s.updateBtnDisabled]}
          onPress={handleUpdate}
          disabled={isDownloading}
          activeOpacity={0.8}
        >
          <Text style={s.updateText}>
            {isDone ? '✅ Hoàn tất' : isDownloading ? `Đang tải... ${pct}%` : '⬇️  Cập nhật ngay'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 440,
  },
  header: {
    backgroundColor: '#1565C0',
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerEmoji: { fontSize: 40, marginBottom: spacing.sm },
  headerTitle: { ...typography.h2, color: colors.white, marginBottom: spacing.sm },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  versionText: { ...typography.label, color: colors.white, letterSpacing: 1 },
  body: { padding: spacing['2xl'] },
  changelogTitle: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.md },
  changelogScroll: { maxHeight: 160 },
  changelogRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bullet: { color: colors.secondaryLight, marginRight: spacing.sm, marginTop: 1 },
  changelogItem: { ...typography.bodySm, color: colors.text, flex: 1, lineHeight: 20 },
  progressWrap: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing.md },
  progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: colors.secondaryLight, borderRadius: 4 },
  progressPct: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  simBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginRight: spacing.sm,
  },
  simText: { ...typography.label, color: colors.textSecondary },
  updateBtn: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 10,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: 12,
  },
  updateBtnDisabled: { opacity: 0.7 },
  updateText: { ...typography.label, color: colors.white },
});
