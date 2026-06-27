import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { AppProcessStepConfig, AppProcessStepStatus } from '../models/dialog_config';
import { colors } from '../../../../common/theme/colors';
import { spacing } from '../../../../common/theme/spacing';
import { typography } from '../../../../common/theme/typography';
import { SdkStrings } from '../../../../common/language';

interface Props {
  steps: AppProcessStepConfig[];
  title?: string;
  summaryTitleBuilder?: (results: unknown[]) => string;
  summaryNotesBuilder?: (results: unknown[]) => string[];
  onAllCompleted?: () => void;
}

/**
 * ProcessStepperComponent — stepper tiến trình đa bước động.
 * Tương đương AppProcessStepperComponent trong Flutter.
 */
export const ProcessStepperComponent: React.FC<Props> = ({
  steps,
  title = 'Tiến trình xử lý',
  summaryTitleBuilder,
  summaryNotesBuilder,
  onAllCompleted,
}) => {
  const [statuses, setStatuses] = useState<AppProcessStepStatus[]>(
    steps.map(s => s.initialStatus ?? 'pending'),
  );
  const [results, setResults] = useState<unknown[]>(steps.map(s => s.initialResult ?? null));
  const [subtitles, setSubtitles] = useState<(string | null)[]>(steps.map(() => null));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isRunning = useRef(false);

  useEffect(() => { runNext(); }, []);

  const runNext = async () => {
    if (isRunning.current) return;
    const nextIdx = statuses.findIndex((st, i) => st === 'pending' && statuses.slice(0, i).every(s => s === 'completed'));
    if (nextIdx === -1) {
      if (statuses.every(st => st === 'completed')) onAllCompleted?.();
      return;
    }
    await executeStep(nextIdx);
  };

  const executeStep = async (idx: number) => {
    isRunning.current = true;
    setStatuses(prev => { const next = [...prev]; next[idx] = 'processing'; return next; });
    setErrorMsg(null);

    try {
      const result = await steps[idx].action();
      const subtitle = steps[idx].subtitleBuilder?.(result) ?? null;

      setResults(prev => { const next = [...prev]; next[idx] = result; return next; });
      setSubtitles(prev => { const next = [...prev]; next[idx] = subtitle; return next; });
      setStatuses(prev => {
        const next = [...prev]; next[idx] = 'completed';
        isRunning.current = false;
        return next;
      });
      // Trigger next after state update
      setTimeout(runNext, 0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatuses(prev => { const next = [...prev]; next[idx] = 'failed'; return next; });
      setErrorMsg(msg);
      isRunning.current = false;
    }
  };

  const retry = () => {
    const failedIdx = statuses.findIndex(st => st === 'failed');
    if (failedIdx >= 0) {
      setStatuses(prev => { const next = [...prev]; next[failedIdx] = 'pending'; return next; });
      setTimeout(() => executeStep(failedIdx), 50);
    }
  };

  const allDone = statuses.every(st => st === 'completed');
  const hasFailed = statuses.some(st => st === 'failed');
  const summaryTitle = allDone && summaryTitleBuilder ? summaryTitleBuilder(results) : null;
  const summaryNotes = allDone && summaryNotesBuilder ? summaryNotesBuilder(results) : null;

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {steps.map((step, idx) => (
          <StepRow
            key={idx}
            idx={idx}
            total={steps.length}
            title={step.title}
            status={statuses[idx]}
            subtitle={
              statuses[idx] === 'processing'
                ? step.processingSubtitle
                : subtitles[idx] ?? undefined
            }
          />
        ))}

        {errorMsg && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>❌ {errorMsg}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={retry}>
              <Text style={s.retryText}>{SdkStrings.common.retry}</Text>
            </TouchableOpacity>
          </View>
        )}

        {allDone && (
          <View style={s.summaryBox}>
            <Text style={s.summaryTitle}>{summaryTitle ?? '✅ Hoàn tất!'}</Text>
            {summaryNotes?.map((note, i) => (
              <Text key={i} style={s.summaryNote}>• {note}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ── Step row ─────────────────────────────────────────────────────────────────

interface StepRowProps {
  idx: number;
  total: number;
  title: string;
  status: AppProcessStepStatus;
  subtitle?: string;
}

const StepRow: React.FC<StepRowProps> = ({ idx, total, title, status, subtitle }) => {
  const isLast = idx === total - 1;
  const iconMap: Record<AppProcessStepStatus, string> = {
    pending: '⭕',
    processing: '🔄',
    completed: '✅',
    failed: '❌',
  };
  const textColor: Record<AppProcessStepStatus, string> = {
    pending: colors.textTertiary,
    processing: colors.secondaryLight,
    completed: '#16A34A',
    failed: colors.error,
  };

  return (
    <View style={s.stepRow}>
      {/* Left: icon + connector */}
      <View style={s.stepLeft}>
        {status === 'processing'
          ? <ActivityIndicator size="small" color={colors.secondaryLight} />
          : <Text style={{ fontSize: 18 }}>{iconMap[status]}</Text>}
        {!isLast && <View style={s.connector} />}
      </View>

      {/* Right: title + subtitle */}
      <View style={s.stepContent}>
        <Text style={[s.stepTitle, { color: textColor[status] }]}>{title}</Text>
        {subtitle && <Text style={s.stepSub}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing['2xl'],
    maxHeight: '80%',
  },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.lg, textAlign: 'center' },
  scroll: { maxHeight: 320 },
  stepRow: { flexDirection: 'row', marginBottom: spacing.sm },
  stepLeft: { width: 32, alignItems: 'center' },
  connector: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4, minHeight: 16 },
  stepContent: { flex: 1, paddingLeft: spacing.sm, paddingBottom: spacing.sm },
  stepTitle: { ...typography.bodyMedium },
  stepSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  errorBox: { backgroundColor: '#FFF1F2', borderRadius: 10, padding: spacing.md, marginTop: spacing.md, alignItems: 'center' },
  errorText: { ...typography.bodySm, color: colors.error, textAlign: 'center', marginBottom: spacing.sm },
  retryBtn: { backgroundColor: colors.error, borderRadius: 8, paddingHorizontal: spacing.lg, paddingVertical: 8 },
  retryText: { ...typography.label, color: colors.white },
  summaryBox: { backgroundColor: '#F0FDF4', borderRadius: 10, padding: spacing.md, marginTop: spacing.md },
  summaryTitle: { ...typography.bodyMedium, color: '#16A34A', textAlign: 'center' },
  summaryNote: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
