import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../common/theme';

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai'];

/**
 * AddressSheet — bottom sheet nhập địa chỉ tự do.
 * @param {object} props
 * @param {boolean} props.visible
 * @param {string} props.title - "Lấy hàng" hoặc "Giao hàng"
 * @param {object} props.initial - địa chỉ ban đầu (optional)
 * @param {function} props.onConfirm - callback(Address)
 * @param {function} props.onClose
 */
export function AddressSheet({ visible, title = 'Địa chỉ', initial = {}, onConfirm, onClose }) {
  const [city,   setCity]   = useState(initial.city   ?? '');
  const [ward,   setWard]   = useState(initial.ward   ?? '');
  const [street, setStreet] = useState(initial.street ?? '');
  const [house,  setHouse]  = useState(initial.house  ?? '');
  const [phone,  setPhone]  = useState(initial.phone  ?? '');
  const [name,   setName]   = useState(initial.name   ?? '');
  const [showCityPicker, setShowCityPicker] = useState(false);

  function handleConfirm() {
    if (!city || !phone || !name) return;
    const addr = { city, ward, street, house, phone, name };
    addr.label = `${house ? house + ' ' : ''}${street ? street + ', ' : ''}${ward ? ward + ', ' : ''}${city}`;
    onConfirm?.(addr);
    onClose?.();
  }

  const valid = city.trim() && phone.trim() && name.trim();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        style={s.sheetWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Thành phố */}
            <Field label="Thành phố *">
              <TouchableOpacity style={s.pickerBtn} onPress={() => setShowCityPicker(v => !v)}>
                <Text style={city ? s.pickerValue : s.pickerPlaceholder}>
                  {city || 'Chọn thành phố'}
                </Text>
                <Text style={s.pickerArrow}>▾</Text>
              </TouchableOpacity>
              {showCityPicker && (
                <View style={s.cityList}>
                  {CITIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[s.cityItem, city === c && s.cityItemActive]}
                      onPress={() => { setCity(c); setShowCityPicker(false); }}
                    >
                      <Text style={[s.cityItemText, city === c && s.cityItemTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Field>

            <Field label="Phường / Quận">
              <InputBox value={ward} onChangeText={setWard} placeholder="VD: Phường 7, Quận 3" />
            </Field>

            <Field label="Tên đường">
              <InputBox value={street} onChangeText={setStreet} placeholder="VD: Nguyễn Văn Linh" />
            </Field>

            <Field label="Số nhà">
              <InputBox value={house} onChangeText={setHouse} placeholder="VD: 45B" />
            </Field>

            <Field label="Số điện thoại *">
              <InputBox
                value={phone} onChangeText={setPhone}
                placeholder="0912 345 678"
                keyboardType="phone-pad"
              />
            </Field>

            <Field label="Tên người liên hệ *">
              <InputBox value={name} onChangeText={setName} placeholder="Người nhận / giao hàng tại điểm" />
            </Field>

            <View style={{ height: spacing['2xl'] }} />
          </ScrollView>

          {/* Confirm button */}
          <View style={s.footer}>
            <TouchableOpacity
              style={[s.confirmBtn, !valid && s.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={!valid}
              activeOpacity={0.85}
            >
              <Text style={s.confirmText}>Xác nhận địa chỉ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function InputBox({ placeholder, ...props }) {
  return (
    <TextInput
      style={s.input}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

const s = StyleSheet.create({
  backdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheetWrap: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: { ...typography.s1, color: colors.text },
  closeBtn:    { fontSize: 18, color: colors.textSecondary, padding: spacing.xs },

  field:      { marginBottom: spacing.md },
  fieldLabel: { ...typography.c1, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.p2,
    color: colors.text,
    backgroundColor: colors.background,
  },
  pickerBtn: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  pickerValue:      { flex: 1, ...typography.p2, color: colors.text },
  pickerPlaceholder:{ flex: 1, ...typography.p2, color: colors.textSecondary },
  pickerArrow:      { fontSize: 14, color: colors.textSecondary },
  cityList: {
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cityItem:         { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  cityItemActive:   { backgroundColor: '#FFF1E6' },
  cityItemText:     { ...typography.p2, color: colors.text },
  cityItemTextActive:{ color: colors.primary, fontWeight: '600' },

  footer: { paddingVertical: spacing.lg },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#D1D5DB' },
  confirmText: { ...typography.p1, color: colors.white, fontWeight: '700' },
});
