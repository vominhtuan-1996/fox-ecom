import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LoadingAnimationWidget } from '../src/presentation/components/LoadingAnimation';

// --- Skeleton placeholder ---
function SkeletonBox({ width, height, borderRadius = 6, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });
  return (
    <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#d1d5db', opacity }, style]} />
  );
}

function SkeletonCard() {
  return (
    <View style={sk.card}>
      <SkeletonBox width={48} height={48} borderRadius={24} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonBox width="70%" height={14} />
        <SkeletonBox width="50%" height={11} />
      </View>
    </View>
  );
}

// --- Loading overlay (full-screen layer) ---
function LoadingOverlay({ visible }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [visible]);
  if (!visible) return null;
  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[overlay.backdrop, { opacity }]}>
        {LoadingAnimationWidget.fourRotatingDots({ color: '#1976d2', size: 56 })}
      </Animated.View>
    </Modal>
  );
}

// --- Inline section loader ---
function SectionLoader({ label }) {
  return (
    <View style={il.row}>
      <ActivityIndicator size="small" color="#1976d2" />
      <Text style={il.label}>{label}</Text>
    </View>
  );
}

// --- Demo screen ---
export function LoadingDemo({ onBack }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Auto-hide skeleton sau 2.5s
  useEffect(() => {
    const t = setTimeout(() => setSkeletonVisible(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // Progress bar animation
  const startProgress = () => {
    setProgress(0);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, { toValue: 1, duration: 2500, useNativeDriver: false }).start(() => {
      setProgress(100);
    });
  };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  progressAnim.addListener(({ value }) => setProgress(Math.round(value * 100)));

  const showOverlay = () => {
    setOverlayVisible(true);
    setTimeout(() => setOverlayVisible(false), 2500);
  };

  return (
    <SafeAreaView style={s.screen}>
      <TouchableOpacity style={s.backBtn} onPress={onBack}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.title}>Loading & Layers</Text>

        {/* SDK Animations */}
        <Text style={s.sectionTitle}>SDK Animations</Text>
        <View style={s.row}>
          <View style={s.animBox}>
            {LoadingAnimationWidget.fourRotatingDots({ color: '#1976d2', size: 52 })}
            <Text style={s.animLabel}>Four Dots</Text>
          </View>
          <View style={s.animBox}>
            {LoadingAnimationWidget.progressiveDots({ color: '#e53935', size: 52 })}
            <Text style={s.animLabel}>Progressive</Text>
          </View>
          <View style={s.animBox}>
            <ActivityIndicator size="large" color="#43a047" />
            <Text style={s.animLabel}>Native</Text>
          </View>
        </View>

        {/* Loading Overlay */}
        <Text style={s.sectionTitle}>Loading Overlay (Layer)</Text>
        <Text style={s.desc}>Full-screen layer chặn interaction trong lúc xử lý</Text>
        <TouchableOpacity style={s.btn} onPress={showOverlay}>
          <Text style={s.btnText}>Kích hoạt Overlay (2.5s)</Text>
        </TouchableOpacity>


        {/* Progress Bar */}
        <Text style={s.sectionTitle}>Progress Bar</Text>
        <View style={s.progressTrack}>
          <Animated.View style={[s.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={s.progressLabel}>{progress}%</Text>
        <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={startProgress}>
          <Text style={[s.btnText, s.btnTextOutline]}>Chạy Progress</Text>
        </TouchableOpacity>

        {/* Skeleton */}
        <Text style={s.sectionTitle}>Skeleton Loader</Text>
        <Text style={s.desc}>Shimmer placeholder trong lúc chờ dữ liệu</Text>
        <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={() => setSkeletonVisible(true)}>
          <Text style={[s.btnText, s.btnTextOutline]}>Reset Skeleton (2.5s)</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 12 }}>
          {skeletonVisible ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : (
            [
              { icon: '📦', name: 'Đơn hàng #1042', sub: 'Đang vận chuyển' },
              { icon: '🔔', name: 'Thông báo hệ thống', sub: '2 phút trước' },
              { icon: '⚙️', name: 'Cài đặt tài khoản', sub: 'Cập nhật hôm nay' },
            ].map((item, i) => (
              <View key={i} style={sk.card}>
                <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={sk.name}>{item.name}</Text>
                  <Text style={sk.sub}>{item.sub}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Inline loaders */}
        <Text style={s.sectionTitle}>Inline Section Loader</Text>
        <SectionLoader label="Đang đồng bộ dữ liệu..." />
        <SectionLoader label="Đang kiểm tra kết nối..." />

        <View style={{ height: 32 }} />
      </ScrollView>

      <LoadingOverlay visible={overlayVisible} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: {
    margin: 16, alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
  },
  backText: { color: '#1976d2', fontWeight: '600', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 28, marginBottom: 8 },
  desc: { fontSize: 13, color: '#6b7280', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  animBox: { alignItems: 'center' },
  animLabel: { fontSize: 12, color: '#6b7280', marginTop: 10 },
  btn: {
    backgroundColor: '#1976d2', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#1976d2' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextOutline: { color: '#1976d2' },
  progressTrack: {
    height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 6,
  },
  progressFill: {
    height: '100%', backgroundColor: '#1976d2', borderRadius: 4,
  },
  progressLabel: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginBottom: 12 },
});

const overlay = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center',
  },
});

const sk = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  sub: { fontSize: 13, color: '#6b7280', marginTop: 3 },
});

const il = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', marginLeft: 10,
    backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8,
  },
  label: { fontSize: 14, color: '#374151' },
});
