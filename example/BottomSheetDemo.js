import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;
const DISMISS_THRESHOLD = SHEET_HEIGHT * 0.3;

function BottomSheet({ visible, onClose, children }) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 180, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SHEET_HEIGHT, duration: 250, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > DISMISS_THRESHOLD) {
          dismiss();
        } else {
          Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 180, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={dismiss}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={dismiss} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

export function BottomSheetDemo({ onBack }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const options = [
    { id: '1', icon: '📦', label: 'Tạo đơn hàng mới', desc: 'Khởi tạo quy trình đặt hàng' },
    { id: '2', icon: '🔔', label: 'Thông báo', desc: 'Xem tất cả thông báo hệ thống' },
    { id: '3', icon: '📋', label: 'Báo cáo', desc: 'Xem báo cáo doanh số tháng này' },
    { id: '4', icon: '⚙️', label: 'Cài đặt', desc: 'Tùy chỉnh ứng dụng' },
    { id: '5', icon: '❓', label: 'Hỗ trợ', desc: 'Liên hệ bộ phận hỗ trợ kỹ thuật' },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bottom Sheet</Text>
      <Text style={styles.subtitle}>Kéo xuống để đóng, tap backdrop để đóng</Text>

      {selected && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>Đã chọn:</Text>
          <Text style={styles.selectedValue}>{selected.icon} {selected.label}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.openBtn} onPress={() => setOpen(true)}>
        <Text style={styles.openBtnText}>Mở Bottom Sheet</Text>
      </TouchableOpacity>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Chọn thao tác</Text>
          <Text style={styles.sheetSubtitle}>{options.length} tùy chọn có sẵn</Text>
        </View>
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => { setSelected(item); setOpen(false); }}
          >
            <Text style={styles.optionIcon}>{item.icon}</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{item.label}</Text>
              <Text style={styles.optionDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6', paddingHorizontal: 20 },
  backBtn: {
    marginTop: 8, marginBottom: 24, alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
  },
  backText: { color: '#1976d2', fontWeight: '600', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
  selectedBox: {
    backgroundColor: '#e8f5e9', borderRadius: 10, padding: 16, marginBottom: 24,
    borderLeftWidth: 4, borderLeftColor: '#43a047',
  },
  selectedLabel: { fontSize: 12, color: '#388e3c', fontWeight: '600', marginBottom: 4 },
  selectedValue: { fontSize: 16, color: '#1b5e20', fontWeight: '500' },
  openBtn: {
    backgroundColor: '#1976d2', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  // sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#d1d5db',
    alignSelf: 'center', marginVertical: 12,
  },
  sheetHeader: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  sheetSubtitle: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#f9fafb',
  },
  optionIcon: { fontSize: 22, marginRight: 14 },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  optionDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  optionArrow: { fontSize: 22, color: '#d1d5db', fontWeight: '300' },
});
