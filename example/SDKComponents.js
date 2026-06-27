import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';

// ─── SDK imports ─────────────────────────────────────────────────────────────
import { LoadingAnimationWidget } from '../src/presentation/components/LoadingAnimation';
import { SvgIcon } from '../src/presentation/components/SvgIcon';
import { MultiSelector } from '../src/presentation/components/multi_select/MultiSelector';
import { Selector } from '../src/presentation/components/multi_select/Selector';
import { Navigator } from '../src/presentation/navigator/Navigator';
import {
  AppDialogEngine,
  AppSnackbarEngine,
  DialogBaseComponent,
  SnackbarBaseComponent,
  ProcessStepperComponent,
  MultiTransferDialog,
  UpdatePatchDialog,
} from '../src/presentation/components/engine_dialog';
import { HomeScreen } from '../src/presentation/screens/home';
import { BoardScreen, CreateScreen, DetailScreen } from '../src/presentation/screens/carry';
import { CarryService } from '../src/modules/carry/CarryService';
import { ShowQrScreen, ScanScreen } from '../src/presentation/screens/qr';
import { QrService } from '../src/modules/qr';
import { MyOrdersScreen, RouteFilterScreen } from '../src/presentation/screens/orders';
import { LeaderboardScreen, RankScreen } from '../src/presentation/screens/rank';
import { ProfileScreen, EditProfileScreen, SettingsScreen } from '../src/presentation/screens/profile';
import { SkeletonList, OfflineBanner, ConfettiView } from '../src/presentation/components/shared';
import {
  AppText, AppButton, AppInput, AppCard, AppBadge,
  AppDivider, AppAvatar, AppSearchBar, AppHeader,
} from '../src/presentation/components/shared';

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.sectionDot} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

// ─── Row để hiển thị nhiều item cạnh nhau ────────────────────────────────────
function Row({ children, gap = 10 }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
      {React.Children.map(children, (child, i) => (
        <View style={{ marginRight: i < React.Children.count(children) - 1 ? gap : 0, marginBottom: gap }}>
          {child}
        </View>
      ))}
    </View>
  );
}

// ─── Chip badge ──────────────────────────────────────────────────────────────
function Chip({ label, color = '#1976d2', onPress }) {
  return (
    <TouchableOpacity
      style={[s.chip, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[s.chipText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Toast inline demo ───────────────────────────────────────────────────────
function ToastDemo() {
  const [toast, setToast] = useState(null);

  const variants = [
    { label: 'Success', color: '#43a047', bg: '#e8f5e9' },
    { label: 'Error', color: '#e53935', bg: '#ffebee' },
    { label: 'Warning', color: '#fb8c00', bg: '#fff3e0' },
    { label: 'Info', color: '#1976d2', bg: '#e3f2fd' },
  ];

  const show = (v) => {
    setToast(v);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <View>
      <Row>
        {variants.map(v => (
          <Chip key={v.label} label={v.label} color={v.color} onPress={() => show(v)} />
        ))}
      </Row>
      {toast && (
        <View style={[s.toastBanner, { backgroundColor: toast.bg, borderLeftColor: toast.color }]}>
          <Text style={[s.toastText, { color: toast.color }]}>
            {toast.label === 'Success' ? '✅' : toast.label === 'Error' ? '❌' : toast.label === 'Warning' ? '⚠️' : 'ℹ️'}
            {'  '}{toast.label} — Đây là toast message từ SDK
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Dialog demos ────────────────────────────────────────────────────────────
function DialogDemo() {
  const [dialog, setDialog] = useState(null);
  const [inputResult, setInputResult] = useState('');

  return (
    <View>
      <Row>
        <Chip label="Alert" color="#e53935" onPress={() => setDialog('alert')} />
        <Chip label="Confirm" color="#fb8c00" onPress={() => setDialog('confirm')} />
        <Chip label="Input" color="#7b1fa2" onPress={() => setDialog('input')} />
        <Chip label="Custom" color="#1976d2" onPress={() => setDialog('custom')} />
      </Row>
      {inputResult !== '' && (
        <Text style={s.resultText}>Input result: "{inputResult}"</Text>
      )}

      {/* Alert */}
      <Modal transparent visible={dialog === 'alert'} animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.dialogBox}>
            <Text style={s.dialogIcon}>⚠️</Text>
            <Text style={s.dialogTitle}>Cảnh báo</Text>
            <Text style={s.dialogMsg}>Hành động này không thể hoàn tác. Bạn có chắc không?</Text>
            <TouchableOpacity style={[s.dialogBtn, { backgroundColor: '#e53935' }]} onPress={() => setDialog(null)}>
              <Text style={s.dialogBtnText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm */}
      <Modal transparent visible={dialog === 'confirm'} animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.dialogBox}>
            <Text style={s.dialogIcon}>❓</Text>
            <Text style={s.dialogTitle}>Xác nhận</Text>
            <Text style={s.dialogMsg}>Bạn có muốn tiếp tục thực hiện thao tác này không?</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[s.dialogBtn, s.dialogBtnOutline, { flex: 1, marginRight: 8 }]} onPress={() => setDialog(null)}>
                <Text style={[s.dialogBtnText, { color: '#6b7280' }]}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.dialogBtn, { flex: 1, backgroundColor: '#fb8c00' }]} onPress={() => setDialog(null)}>
                <Text style={s.dialogBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Input */}
      <Modal transparent visible={dialog === 'input'} animationType="fade">
        <View style={s.modalBackdrop}>
          <View style={s.dialogBox}>
            <Text style={s.dialogIcon}>✏️</Text>
            <Text style={s.dialogTitle}>Nhập thông tin</Text>
            <View style={s.dialogInput}>
              <Text style={{ color: '#9ca3af' }}>Nhập nội dung...</Text>
            </View>
            <TouchableOpacity style={[s.dialogBtn, { backgroundColor: '#7b1fa2' }]} onPress={() => { setInputResult('demo value'); setDialog(null); }}>
              <Text style={s.dialogBtnText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom */}
      <Modal transparent visible={dialog === 'custom'} animationType="slide">
        <View style={s.modalBackdrop}>
          <View style={[s.dialogBox, { padding: 0, overflow: 'hidden' }]}>
            <View style={{ backgroundColor: '#1565c0', padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>🎉</Text>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 8 }}>Ưu đãi đặc biệt!</Text>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 15, color: '#374151', textAlign: 'center' }}>Giảm 20% cho đơn hàng tiếp theo</Text>
              <View style={s.couponBox}><Text style={s.couponText}>FOX20</Text></View>
            </View>
            <View style={{ flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
              <TouchableOpacity style={[s.dialogBtn, s.dialogBtnOutline, { flex: 1, marginRight: 8 }]} onPress={() => setDialog(null)}>
                <Text style={[s.dialogBtnText, { color: '#6b7280' }]}>Bỏ qua</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.dialogBtn, { flex: 1, backgroundColor: '#1976d2' }]} onPress={() => setDialog(null)}>
                <Text style={s.dialogBtnText}>Dùng ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── MultiSelector demo ──────────────────────────────────────────────────────
function MultiSelectDemo() {
  const [selected, setSelected] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const cities = [
    { id: '1', label: 'Hà Nội' },
    { id: '2', label: 'TP. Hồ Chí Minh' },
    { id: '3', label: 'Đà Nẵng' },
    { id: '4', label: 'Hải Phòng' },
    { id: '5', label: 'Cần Thơ' },
  ];
  const tags = ['React Native', 'TypeScript', 'Flutter', 'Swift', 'Kotlin'];

  return (
    <View>
      {/* unLimit — tag chips */}
      <Text style={s.subLabel}>unLimit — chọn nhiều tự do</Text>
      <MultiSelector
        items={tags}
        initialSelectedItems={[]}
        type="unLimit"
        onSelectItem={setSelected}
        itemBuilder={(item, isSelected) => (
          <View style={[s.tagChip, isSelected && s.tagChipSelected]}>
            <Text style={[s.tagText, isSelected && s.tagTextSelected]}>{item}</Text>
          </View>
        )}
        itemContainerBuilder={(builder, items, selectedSet) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from(items).map(item => (
              <View key={item} style={{ marginRight: 8, marginBottom: 8 }}>
                {builder(item, selectedSet.has(item))}
              </View>
            ))}
          </View>
        )}
        style={{ marginTop: 8 }}
      />
      {selected.length > 0 && <Text style={s.resultText}>Đã chọn: {selected.join(', ')}</Text>}

      {/* Selector với search */}
      <Text style={[s.subLabel, { marginTop: 16 }]}>Selector + search bar (limit 2)</Text>
      <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', maxHeight: 280 }}>
        <Selector
          items={cities}
          selectedItems={selectedCity}
          selectLength={2}
          type="limit"
          hasSearchBar
          autoFocus={false}
          hint="Tìm thành phố..."
          onChanged={setSelectedCity}
        />
      </View>
      {selectedCity.length > 0 && (
        <Text style={s.resultText}>Đã chọn: {selectedCity.map(c => c.label).join(', ')}</Text>
      )}
    </View>
  );
}

// ─── DialogBaseComponent demo ────────────────────────────────────────────────
const DIALOG_TYPES = [
  { type: 'info', label: 'Info', color: '#3B82F6' },
  { type: 'error', label: 'Error', color: '#EF4444' },
  { type: 'success', label: 'Success', color: '#22C55E' },
  { type: 'warning', label: 'Warning', color: '#F59E0B' },
];

function DialogBaseComponentDemo() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(null);

  const show = (cfg) => { setConfig(cfg); setVisible(true); };

  return (
    <View>
      <Row>
        {DIALOG_TYPES.map(({ type, label, color }) => (
          <Chip key={type} label={label} color={color} onPress={() => show({
            type,
            title: label,
            message: `Đây là dialog loại ${label}. Nhấn OK để đóng.`,
          })} />
        ))}
      </Row>
      <Row>
        <Chip label="Confirm" color="#8B5CF6" onPress={() => show({
          type: 'warning',
          title: 'Xác nhận',
          message: 'Bạn chắc chắn muốn thực hiện thao tác này?',
          showCancelButton: true,
          confirmText: 'Đồng ý',
          cancelText: 'Hủy',
          onConfirm: () => setVisible(false),
        })} />
        <Chip label="No Dismiss" color="#6B7280" onPress={() => show({
          type: 'error',
          title: 'Lỗi nghiêm trọng',
          message: 'Không thể đóng dialog này bằng cách bấm ra ngoài.',
          barrierDismissible: false,
        })} />
        <Chip label="Custom Icon" color="#F97316" onPress={() => show({
          type: 'info',
          title: 'Tùy chỉnh icon',
          message: 'Dialog với custom icon component.',
          customIcon: <Text style={{ fontSize: 32 }}>🎉</Text>,
        })} />
      </Row>
      <Modal visible={visible} transparent animationType="none" onRequestClose={() => setVisible(false)}>
        {config && (
          <DialogBaseComponent
            config={{ ...config, onConfirm: () => { config.onConfirm?.(); setVisible(false); }, onCancel: () => setVisible(false) }}
            onDismiss={() => setVisible(false)}
          />
        )}
      </Modal>
    </View>
  );
}

// ─── SnackbarBaseComponent demo ───────────────────────────────────────────────
const SNACK_CONFIGS = [
  { label: 'Info top', config: { message: 'Cập nhật thành công!', type: 'info', position: 'top' } },
  { label: 'Error top', config: { message: 'Không thể kết nối máy chủ.', type: 'error', position: 'top', showCloseButton: true } },
  { label: 'Success top', config: { message: 'Đơn hàng đã được xác nhận.', type: 'success', position: 'top', duration: 2000 } },
  { label: 'Warning bottom', config: { message: 'Pin sắp hết, vui lòng sạc.', type: 'warning', position: 'bottom' } },
  { label: 'Action btn', config: { message: 'Đã xóa mục. Hoàn tác?', type: 'info', position: 'top', actionLabel: 'Hoàn tác', duration: 4000 } },
];

function SnackbarBaseComponentDemo() {
  const [items, setItems] = useState([]);
  let _id = 0;

  const show = (cfg) => {
    const id = _id++;
    setItems(prev => [...prev, { id, ...cfg }]);
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), cfg.duration ?? 3000);
  };

  const tops = items.filter(x => x.position === 'top');
  const bottoms = items.filter(x => x.position === 'bottom');

  return (
    <View>
      <Row>
        {SNACK_CONFIGS.map(({ label, config }) => (
          <Chip key={label} label={label} color="#374151" onPress={() => show(config)} />
        ))}
      </Row>
      {/* Preview inline — top */}
      {tops.map(item => (
        <SnackbarBaseComponent
          key={item.id}
          config={item}
          position="top"
          onClose={() => setItems(prev => prev.filter(x => x.id !== item.id))}
        />
      ))}
      {/* Preview inline — bottom */}
      {bottoms.map(item => (
        <SnackbarBaseComponent
          key={item.id}
          config={item}
          position="bottom"
          onClose={() => setItems(prev => prev.filter(x => x.id !== item.id))}
        />
      ))}
    </View>
  );
}

// ─── ProcessStepperComponent demo ────────────────────────────────────────────
const DEMO_STEPS = [
  {
    title: 'Xác thực người dùng',
    processingSubtitle: 'Đang kiểm tra token...',
    action: () => new Promise(r => setTimeout(() => r({ userId: 'U001' }), 900)),
    subtitleBuilder: (r) => `User: ${r.userId}`,
  },
  {
    title: 'Tải dữ liệu sản phẩm',
    processingSubtitle: 'Đang đồng bộ...',
    action: () => new Promise(r => setTimeout(() => r(42), 700)),
    subtitleBuilder: (n) => `${n} sản phẩm`,
  },
  {
    title: 'Cập nhật giỏ hàng',
    processingSubtitle: 'Đang lưu...',
    action: () => new Promise(r => setTimeout(() => r(), 500)),
  },
];

function ProcessStepperDemo() {
  const [key, setKey] = useState(0);
  return (
    <View>
      <ProcessStepperComponent
        key={key}
        steps={DEMO_STEPS}
        title="Đồng bộ dữ liệu"
        summaryTitleBuilder={() => '✅ Đồng bộ thành công!'}
        summaryNotesBuilder={(results) => [`User: ${results[0]?.userId ?? '—'}`, `${results[1] ?? 0} sản phẩm`]}
      />
      <Chip label="Chạy lại" color="#0EA5E9" onPress={() => setKey(k => k + 1)} />
    </View>
  );
}

// ─── MultiTransferDialog demo ─────────────────────────────────────────────────
const DEMO_FILES = [
  { name: 'catalog_2024.pdf', sizeInMB: 3.2, transferAction: (onProgress) => new Promise(r => { let p = 0; const t = setInterval(() => { p = Math.min(p + 0.05, 1); onProgress(p); if (p >= 1) { clearInterval(t); r(); } }, 80); }) },
  { name: 'product_images.zip', sizeInMB: 12.7, transferAction: (onProgress) => new Promise(r => { let p = 0; const t = setInterval(() => { p = Math.min(p + 0.03, 1); onProgress(p); if (p >= 1) { clearInterval(t); r(); } }, 80); }) },
  { name: 'price_list.xlsx', sizeInMB: 0.8, transferAction: (onProgress) => new Promise(r => { let p = 0; const t = setInterval(() => { p = Math.min(p + 0.1, 1); onProgress(p); if (p >= 1) { clearInterval(t); r(); } }, 60); }) },
];

function MultiTransferDemo() {
  const [type, setType] = useState('download');
  const [key, setKey] = useState(0);

  const restart = (t) => { setType(t); setKey(k => k + 1); };

  return (
    <View>
      <Row>
        <Chip label="⬇ Download" color="#0EA5E9" onPress={() => restart('download')} />
        <Chip label="⬆ Upload" color="#8B5CF6" onPress={() => restart('upload')} />
      </Row>
      <MultiTransferDialog key={key} files={DEMO_FILES} type={type} />
    </View>
  );
}

// ─── UpdatePatchDialog demo ───────────────────────────────────────────────────
function UpdatePatchDemo() {
  const [key, setKey] = useState(0);
  return (
    <View>
      <UpdatePatchDialog
        key={key}
        version="2.5.0"
        changelog={[
          'Cải thiện tốc độ tải trang sản phẩm',
          'Sửa lỗi giỏ hàng không cập nhật số lượng',
          'Thêm bộ lọc theo thương hiệu',
          'Tối ưu hóa bộ nhớ trên iOS',
        ]}
        onUpdate={() => {}}
        showSimulator
        autoSimulate={false}
      />
      <Chip label="Reset" color="#6B7280" onPress={() => setKey(k => k + 1)} />
    </View>
  );
}

// ─── Navigator demo ──────────────────────────────────────────────────────────
function NavigatorDemo() {
  const [show, setShow] = useState(false);

  const screens = {
    home: ({ push }) => (
      <View style={s.navScreen}>
        <Text style={s.navTitle}>Home Screen</Text>
        <Text style={s.navDesc}>Màn hình đầu tiên của Navigator</Text>
        <TouchableOpacity style={s.navBtn} onPress={() => push('detail', { id: 42 })}>
          <Text style={s.navBtnText}>Push → Detail</Text>
        </TouchableOpacity>
      </View>
    ),
    detail: ({ pop, params }) => (
      <View style={s.navScreen}>
        <Text style={s.navTitle}>Detail Screen</Text>
        <Text style={s.navDesc}>Params: id = {params?.id}</Text>
        <TouchableOpacity style={[s.navBtn, { backgroundColor: '#43a047' }]} onPress={() => pop()}>
          <Text style={s.navBtnText}>← Pop back</Text>
        </TouchableOpacity>
      </View>
    ),
  };

  return (
    <View>
      <Chip label="Mở Navigator Demo" color="#1976d2" onPress={() => setShow(true)} />
      <Modal visible={show} animationType="slide" onRequestClose={() => setShow(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Navigator
            initialRoute="home"
            routes={[{ key: 'home' }, { key: 'detail' }]}
            pushTransition="slide"
            popTransition="slide"
            useSafeArea={false}
            theme={{
              headerBackground: '#1565c0',
              headerTitleStyle: { color: '#fff' },
              backLabelColor: '#bbdefb',
              headerRight: (
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{ color: '#bbdefb', fontSize: 15 }}>Đóng</Text>
                </TouchableOpacity>
              ),
            }}
            renderScreen={(key, props) => screens[key]?.(props)}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// ─── Main SDK Components screen ──────────────────────────────────────────────
export function SDKComponents({ onBack }) {
  return (
    <SafeAreaView style={s.screen}>
      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.topTitle}>Fox eCommerce SDK</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Loading Animation ── */}
        <Section title="LoadingAnimationWidget">
          <Row>
            <View style={s.animBox}>
              {LoadingAnimationWidget.fourRotatingDots({ color: '#1976d2', size: 48 })}
              <Text style={s.animLabel}>fourRotatingDots</Text>
            </View>
            <View style={s.animBox}>
              {LoadingAnimationWidget.progressiveDots({ color: '#e53935', size: 48 })}
              <Text style={s.animLabel}>progressiveDots</Text>
            </View>
            <View style={[s.animBox, { backgroundColor: '#1f2937' }]}>
              {LoadingAnimationWidget.fourRotatingDots({ color: '#fff', size: 48 })}
              <Text style={[s.animLabel, { color: '#fff' }]}>dark bg</Text>
            </View>
          </Row>
        </Section>

        {/* ── SvgIcon ── */}
        <Section title="SvgIcon">
          <Row>
            {['home', 'bell', 'settings', 'heart', 'package', 'layers', 'alert', 'confirm'].map(name => (
              <View key={name} style={s.iconBox}>
                <SvgIcon name={name} size={24} color="#1976d2" />
                <Text style={s.iconLabel}>{name}</Text>
              </View>
            ))}
          </Row>
          <Text style={s.propHint}>props: name · size · color</Text>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast">
          <ToastDemo />
          <Text style={s.propHint}>variants: success · error · warning · info</Text>
        </Section>

        {/* ── Dialogs ── */}
        <Section title="Dialogs">
          <DialogDemo />
          <Text style={s.propHint}>Alert · Confirm · Input · Custom</Text>
        </Section>

        {/* ── MultiSelector / Selector ── */}
        <Section title="MultiSelector / Selector">
          <MultiSelectDemo />
          <Text style={s.propHint}>type: replace · limit · unLimit · itemBuilder · itemContainerBuilder</Text>
        </Section>

        {/* ── Navigator ── */}
        <Section title="Navigator">
          <NavigatorDemo />
          <Text style={s.propHint}>pushTransition · popTransition · theme · renderScreen · renderHeader</Text>
        </Section>

        {/* ── DialogBaseComponent ── */}
        <Section title="DialogBaseComponent">
          <DialogBaseComponentDemo />
          <Text style={s.propHint}>type · title · message · contentWidget · confirmText · cancelText · barrierDismissible · customIcon</Text>
        </Section>

        {/* ── SnackbarBaseComponent ── */}
        <Section title="SnackbarBaseComponent">
          <SnackbarBaseComponentDemo />
          <Text style={s.propHint}>message · type · position · duration · actionLabel · showCloseButton · leading · trailing</Text>
        </Section>

        {/* ── ProcessStepperComponent ── */}
        <Section title="ProcessStepperComponent">
          <ProcessStepperDemo />
          <Text style={s.propHint}>steps · title · summaryTitleBuilder · summaryNotesBuilder · onAllCompleted</Text>
        </Section>

        {/* ── MultiTransferDialog ── */}
        <Section title="MultiTransferDialog">
          <MultiTransferDemo />
          <Text style={s.propHint}>files · type: download | upload · title · onCompleted · onCanceled</Text>
        </Section>

        {/* ── UpdatePatchDialog ── */}
        <Section title="UpdatePatchDialog">
          <UpdatePatchDemo />
          <Text style={s.propHint}>version · changelog · onUpdate · progress · showSimulator · autoSimulate</Text>
        </Section>

        {/* ── Dialog Engine ── */}
        <Section title="AppDialogEngine">
          <Row>
            <Chip label="Info" color="#3B82F6" onPress={() => AppDialogEngine.info('Đây là thông báo thông tin từ engine.', { title: 'Thông báo' })} />
            <Chip label="Error" color="#EF4444" onPress={() => AppDialogEngine.error('Đã xảy ra lỗi không mong muốn!', { title: 'Lỗi' })} />
            <Chip label="Success" color="#22C55E" onPress={() => AppDialogEngine.success('Thao tác thực hiện thành công.', { title: 'Thành công' })} />
            <Chip label="Warning" color="#F59E0B" onPress={() => AppDialogEngine.warning('Bạn có chắc muốn tiếp tục?', { title: 'Cảnh báo' })} />
          </Row>
          <Row>
            <Chip label="Confirm" color="#8B5CF6" onPress={() => AppDialogEngine.confirm(
              'Xác nhận xóa mục này không?',
              () => AppSnackbarEngine.success('Đã xóa!'),
              { title: 'Xác nhận' },
            )} />
            <Chip label="Stepper" color="#0EA5E9" onPress={() => AppDialogEngine.showStepper({
              title: 'Xử lý đơn hàng',
              steps: [
                { title: 'Kiểm tra tồn kho', processingSubtitle: 'Đang kiểm tra...', action: () => new Promise(r => setTimeout(() => r(true), 800)) },
                { title: 'Tạo hóa đơn', processingSubtitle: 'Đang tạo...', action: () => new Promise(r => setTimeout(() => r('#HD001'), 600)), subtitleBuilder: id => `Mã: ${id}` },
                { title: 'Gửi xác nhận', processingSubtitle: 'Đang gửi email...', action: () => new Promise(r => setTimeout(() => r(), 500)) },
              ],
            })} />
            <Chip label="Update Patch" color="#EC4899" onPress={() => AppDialogEngine.showUpdatePatch({
              version: '2.1.0',
              changelog: ['Sửa lỗi đăng nhập', 'Tối ưu hiệu năng tải trang', 'Bổ sung tính năng gợi ý sản phẩm'],
              onUpdate: () => {},
              autoSimulate: true,
            })} />
          </Row>
          <Text style={s.propHint}>info · error · success · warning · confirm · showStepper · showMultiDownload · showUpdatePatch</Text>
        </Section>

        {/* ── Snackbar Engine ── */}
        <Section title="AppSnackbarEngine">
          <Row>
            <Chip label="Top Info" color="#3B82F6" onPress={() => AppSnackbarEngine.info('Đây là thông báo top.', { position: 'top' })} />
            <Chip label="Top Error" color="#EF4444" onPress={() => AppSnackbarEngine.error('Lỗi xảy ra!', { position: 'top', showCloseButton: true })} />
            <Chip label="Top Success" color="#22C55E" onPress={() => AppSnackbarEngine.success('Lưu thành công!', { position: 'top', duration: 2000 })} />
          </Row>
          <Row>
            <Chip label="Bottom Info" color="#6366F1" onPress={() => AppSnackbarEngine.info('Thông báo dưới cùng.', { position: 'bottom' })} />
            <Chip label="Action Btn" color="#F59E0B" onPress={() => AppSnackbarEngine.warning('Phiên làm việc sắp hết hạn.', {
              position: 'top',
              actionLabel: 'Gia hạn',
              onAction: () => AppSnackbarEngine.success('Đã gia hạn!'),
              duration: 5000,
            })} />
            <Chip label="Clear Top" color="#6B7280" onPress={() => AppSnackbarEngine.clearTopQueue()} />
          </Row>
          <Text style={s.propHint}>info · error · success · warning · position: top | bottom · actionLabel · clearTopQueue</Text>
        </Section>

        {/* ── Phase 1 — Shared Components ────────────────────────────────── */}
        <Section title="AppText — Typography">
          <AppText variant="h3">Heading H3</AppText>
          <AppText variant="s1" color="primary">Subtitle S1 cam</AppText>
          <AppText variant="p2" color="textSecondary">Paragraph P2 phụ</AppText>
          <AppText variant="label" color="textTertiary">LABEL TINY</AppText>
        </Section>

        <Section title="AppButton — Variants">
          <Row>
            <AppButton label="Primary" size="sm" onPress={() => {}} />
            <AppButton label="Outline" variant="outline" size="sm" onPress={() => {}} />
            <AppButton label="Ghost" variant="ghost" size="sm" onPress={() => {}} />
          </Row>
          <AppButton label="Secondary full width" variant="secondary" fullWidth onPress={() => {}} style={{ marginTop: 8 }} />
          <AppButton label="Danger" variant="danger" fullWidth onPress={() => {}} style={{ marginTop: 8 }} />
          <AppButton label="Loading..." loading fullWidth style={{ marginTop: 8 }} />
        </Section>

        <Section title="AppInput">
          <AppInput placeholder="Nhập văn bản..." label="Họ và tên" />
          <AppInput placeholder="Lỗi validation" label="Email" error="Email không hợp lệ" />
          <AppSearchBar placeholder="Tìm đơn hàng..." />
        </Section>

        <Section title="AppCard · AppBadge · AppAvatar">
          <AppCard style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppAvatar name="Nguyễn Văn A" size="md" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <AppText variant="s2">Nguyễn Văn A</AppText>
                <AppText variant="c2" color="textSecondary">Phòng CNTT · HCM</AppText>
              </View>
              <AppBadge label="Bạc" variant="info" />
            </View>
          </AppCard>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['primary','secondary','success','warning','error','info','neutral'].map(v => (
              <AppBadge key={v} label={v} variant={v} style={{ marginRight: 6, marginBottom: 6 }} />
            ))}
          </View>
        </Section>

        <Section title="AppHeader — Variants">
          <AppHeader title="Màn hình mặc định" onBack={() => {}} />
          <View style={{ height: 8 }} />
          <AppHeader title="Header cam" variant="orange" onBack={() => {}}
            rightAction={<AppText variant="p2" color="white">QR</AppText>} />
        </Section>

        {/* ── Phase 3 — BoardScreen + CreateScreen ───────────────────────── */}
        <Section title="BoardScreen — Bảng đơn">
          <View style={{ height: 560, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <BoardScreen
              onCreateOrder={() => AppSnackbarEngine.info('→ Mở CreateScreen')}
              onOpenOrder={(o) => AppSnackbarEngine.info(`→ Mở chi tiết: ${o.id}`)}
              onQrScan={() => AppSnackbarEngine.info('→ Mở QR scan')}
            />
          </View>
        </Section>

        <Section title="CreateScreen — Tạo đơn">
          <View style={{ height: 680, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <CreateScreen
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onCreated={(id) => AppSnackbarEngine.success(`Đã đăng đơn ${id}!`)}
            />
          </View>
        </Section>

        {/* ── Phase 9 — Polish & Production ──────────────────────────────── */}
        <Section title="SkeletonList — Loading placeholder">
          <View style={{ backgroundColor: '#FAFAFB', padding: 16, borderRadius: 12 }}>
            <SkeletonList count={3} />
          </View>
        </Section>

        <Section title="OfflineBanner">
          <View style={{ height: 60, backgroundColor: '#F0F0F0', borderRadius: 12, overflow: 'hidden' }}>
            <OfflineBanner visible={true} />
          </View>
        </Section>

        <Section title="ConfettiView — Celebration (tap để xem)">
          {(() => {
            const [show, setShow] = React.useState(false);
            return (
              <View>
                <AppButton label="🎉 Bắn confetti" onPress={() => setShow(true)} />
                <ConfettiView visible={show} onDone={() => setShow(false)} />
              </View>
            );
          })()}
        </Section>

        <Section title="BoardScreen với skeleton (800ms) + offline banner">
          <View style={{ height: 560, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <BoardScreen
              onCreateOrder={() => AppSnackbarEngine.info('→ CreateScreen')}
              onOpenOrder={(o) => AppSnackbarEngine.info(`→ ${o.id}`)}
            />
          </View>
        </Section>

        {/* ── Phase 8 — Profile & Settings ───────────────────────────────── */}
        <Section title="ProfileScreen">
          <View style={{ height: 680, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <ProfileScreen
              userId="u1"
              onEdit={() => AppSnackbarEngine.info('→ EditProfileScreen')}
              onSettings={() => AppSnackbarEngine.info('→ SettingsScreen')}
              onHistory={() => AppSnackbarEngine.info('→ MyOrdersScreen')}
            />
          </View>
        </Section>

        <Section title="EditProfileScreen">
          <View style={{ height: 640, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <EditProfileScreen
              userId="u1"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onSaved={() => AppSnackbarEngine.success('Đã lưu hồ sơ!')}
            />
          </View>
        </Section>

        <Section title="SettingsScreen">
          <View style={{ height: 560, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <SettingsScreen
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              appVersion="1.0.0-beta"
            />
          </View>
        </Section>

        {/* ── Phase 7 — Gamification ─────────────────────────────────────── */}
        <Section title="LeaderboardScreen — Xếp hạng CO₂">
          <View style={{ height: 600, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <LeaderboardScreen
              currentUserId="u1"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onOpenRank={() => AppSnackbarEngine.info('→ Mở Podium')}
            />
          </View>
        </Section>

        <Section title="RankScreen — Podium top 3">
          <View style={{ height: 640, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <RankScreen
              currentUserId="u1"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
            />
          </View>
        </Section>

        {/* ── Phase 6 — My Orders + RouteFilter ──────────────────────────── */}
        <Section title="MyOrdersScreen — Lịch sử đơn">
          <View style={{ height: 580, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <MyOrdersScreen
              currentUserId="u1"
              onOpenOrder={(o) => AppSnackbarEngine.info(`→ Chi tiết: ${o.id}`)}
            />
          </View>
        </Section>

        <Section title="RouteFilterScreen — Lọc tuyến">
          <View style={{ height: 600, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <RouteFilterScreen
              onApply={(f) => AppSnackbarEngine.info(`Lọc: ${f.fromHub?.shortName ?? 'Tất cả'} → ${f.toHub?.shortName ?? 'Tất cả'}`)}
              onClose={() => AppSnackbarEngine.info('Đóng filter')}
            />
          </View>
        </Section>

        {/* ── Phase 5 — QR Verification ──────────────────────────────────── */}
        <Section title="ShowQrScreen — Người gửi hiện mã pickup">
          <View style={{ height: 580, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <ShowQrScreen
              orderId="FC-2401"
              type="pickup"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
            />
          </View>
        </Section>

        <Section title="ScanScreen — Người chở quét mã (nhập thủ công)">
          <View style={{ height: 580, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <ScanScreen
              orderId="FC-2401"
              type="pickup"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onSuccess={() => AppSnackbarEngine.success('Bàn giao thành công!')}
            />
          </View>
        </Section>

        {/* ── Phase 4 — DetailScreen ─────────────────────────────────────── */}
        <Section title="DetailScreen — vai trò: Người gửi (CLAIMED)">
          <View style={{ height: 640, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <DetailScreen
              order={{ ...CarryService.getBoard()[0], status: 'CLAIMED', carrier: { id: 'u3', name: 'Lê Minh C', dept: 'Phòng Kỹ thuật' } }}
              currentUserId="u1"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onShowQr={() => AppSnackbarEngine.info('→ Mở ShowQrScreen')}
              onCancel={() => AppSnackbarEngine.error('Đã huỷ đơn')}
              onReport={() => AppSnackbarEngine.warning('→ Mở ReportScreen')}
              onContact={(id) => AppSnackbarEngine.info(`→ Chat với user ${id}`)}
            />
          </View>
        </Section>

        <Section title="DetailScreen — vai trò: Người chở (IN_TRANSIT)">
          <View style={{ height: 640, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <DetailScreen
              order={{ ...CarryService.getBoard()[1], status: 'IN_TRANSIT', carrier: { id: 'u3', name: 'Lê Minh C', dept: 'Phòng Kỹ thuật' } }}
              currentUserId="u3"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
              onScanQr={() => AppSnackbarEngine.info('→ Mở ScanScreen')}
              onReport={() => AppSnackbarEngine.warning('→ Báo sự cố')}
            />
          </View>
        </Section>

        <Section title="DetailScreen — Hoàn thành (CONFIRMED)">
          <View style={{ height: 600, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <DetailScreen
              order={{ ...CarryService.getBoard()[2], status: 'CONFIRMED', carrier: { id: 'u3', name: 'Lê Minh C', dept: 'Phòng Kỹ thuật' }, actualPoints: 38, actualCo2Kg: 1.96 }}
              currentUserId="u1"
              onBack={() => AppSnackbarEngine.info('← Quay lại')}
            />
          </View>
        </Section>

        {/* ── Phase 2 — HomeScreen ────────────────────────────────────────── */}
        <Section title="HomeScreen — Full screen preview">
          <View style={{ height: 600, overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
            <HomeScreen
              userName="Trần Thị B"
              onGoCarry={() => AppSnackbarEngine.info('→ Chuyển sang BoardScreen')}
              onGoQrScan={() => AppSnackbarEngine.info('→ Mở CamScanScreen')}
            />
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#1565c0',
  },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
  backText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  topTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  // Section
  section: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1976d2', marginRight: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1e3a5f', letterSpacing: 0.3 },
  sectionBody: { padding: 16 },
  propHint: { marginTop: 10, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },

  // Loading
  animBox: { alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginRight: 10 },
  animLabel: { fontSize: 11, color: '#6b7280', marginTop: 10 },

  // Icon
  iconBox: { alignItems: 'center', padding: 10, marginRight: 8, marginBottom: 4 },
  iconLabel: { fontSize: 10, color: '#6b7280', marginTop: 4 },

  // Chip
  chip: { borderWidth: 1.5, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 14 },
  chipText: { fontSize: 13, fontWeight: '600' },

  // Toast
  toastBanner: { marginTop: 10, borderLeftWidth: 4, borderRadius: 8, padding: 12 },
  toastText: { fontSize: 14, fontWeight: '500' },

  // Dialog
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialogBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%' },
  dialogIcon: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  dialogTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  dialogMsg: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  dialogBtn: { borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  dialogBtnOutline: { borderWidth: 1, borderColor: '#e5e7eb' },
  dialogBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  dialogInput: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 },
  couponBox: { backgroundColor: '#e3f2fd', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginTop: 12 },
  couponText: { color: '#1565c0', fontWeight: '800', fontSize: 18, letterSpacing: 4 },
  resultText: { marginTop: 8, fontSize: 13, color: '#1976d2', fontWeight: '500' },

  // MultiSelect
  subLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  tagChip: { borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  tagChipSelected: { backgroundColor: '#1976d2', borderColor: '#1976d2' },
  tagText: { fontSize: 13, color: '#374151' },
  tagTextSelected: { color: '#fff', fontWeight: '600' },

  // Navigator
  navScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  navTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  navDesc: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
  navBtn: { backgroundColor: '#1976d2', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32 },
  navBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
