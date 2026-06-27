import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Navigator } from '../../navigator/Navigator';
import { ScreenProps } from '../../navigator/types';
import { usePmsAuth } from '../../../modules/auth/hooks/usePmsAuth';
import { SdkStrings } from '../../../common/language';

interface LoginScreenProps {
  onLoginSuccess?: (token: string) => void;
  onBack?: () => void;
}

// ─── Route: main (username login) ───────────────────────────────────────────

function MainLoginScreen({
  pop,
  push,
  onLoginSuccess,
  onBack,
}: ScreenProps & Pick<LoginScreenProps, 'onLoginSuccess' | 'onBack'>) {
  const [username, setUsername] = useState('');
  const { login, loading, error } = usePmsAuth();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert(SdkStrings.common.error, SdkStrings.auth.errorEmptyUsername);
      return;
    }
    const res = await login(username, '');
    if (res.success && res.user?.token) {
      onLoginSuccess?.(res.user.token);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.logo}>
          <View style={s.logoCircle}><Text style={s.logoEmoji}>📦</Text></View>
          <Text style={s.logoTitle}>PMS</Text>
          <Text style={s.logoSub}>Triển khai ấn phẩm MKT</Text>
        </View>

        <InputField value={username} onChangeText={setUsername} label="Username" icon="👤" />
        <View style={{ height: 32 }} />

        <TouchableOpacity style={[s.btnPrimary, loading && s.disabled]} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={s.btnPrimaryText}>ĐĂNG NHẬP</Text>}
        </TouchableOpacity>

        {!!error && !loading && <Text style={s.error}>{error}</Text>}

        <View style={s.divider}>
          <View style={s.dividerLine} /><Text style={s.dividerLabel}>HOẶC</Text><View style={s.dividerLine} />
        </View>

        <TouchableOpacity style={s.btnOutline} onPress={() => push('token')}>
          <Text style={s.btnOutlineText}>🔑  Đăng nhập bằng Token</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Route: token login ──────────────────────────────────────────────────────

function TokenLoginScreen({
  pop,
  onLoginSuccess,
}: ScreenProps & Pick<LoginScreenProps, 'onLoginSuccess'>) {
  const [token, setToken] = useState('');
  const { loginWithToken, loading, error } = usePmsAuth();

  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert(SdkStrings.common.error, SdkStrings.auth.errorEmptyToken);
      return;
    }
    const res = await loginWithToken(token);
    if (res.success && res.user?.token) {
      onLoginSuccess?.(res.user.token);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.logo}>
          <View style={[s.logoCircle, { backgroundColor: '#fce4ec' }]}><Text style={s.logoEmoji}>🔑</Text></View>
          <Text style={s.logoTitle}>Token</Text>
          <Text style={s.logoSub}>Dán access token vào bên dưới</Text>
        </View>

        <InputField value={token} onChangeText={setToken} label="Access Token" icon="🔐" secureTextEntry />
        <View style={{ height: 32 }} />

        <TouchableOpacity style={[s.btnPrimary, { backgroundColor: '#c62828' }, loading && s.disabled]} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={s.btnPrimaryText}>XÁC THỰC TOKEN</Text>}
        </TouchableOpacity>

        {!!error && !loading && <Text style={s.error}>{error}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Root: Navigator wrapping cả hai route ───────────────────────────────────

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => (
  <Navigator
    initialRoute="main"
    routes={[{ key: 'main', component: null }, { key: 'token', component: null }]}
    pushTransition="slide"
    popTransition="slide"
    theme={{
      headerBackground: '#1565c0',
      headerTitleStyle: { color: '#fff', fontSize: 17, fontWeight: '600' },
      backLabelColor: '#bbdefb',
      headerRight: onBack
        ? <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={{ color: '#bbdefb', fontSize: 15 }}>{SdkStrings.common.close}</Text>
          </TouchableOpacity>
        : undefined,
    }}
    renderScreen={(key, screenProps) => {
      if (key === 'main') {
        return <MainLoginScreen {...screenProps} onLoginSuccess={onLoginSuccess} onBack={onBack} />;
      }
      if (key === 'token') {
        return <TokenLoginScreen {...screenProps} onLoginSuccess={onLoginSuccess} />;
      }
      return null;
    }}
  />
);

// ─── Shared components ───────────────────────────────────────────────────────

const InputField = ({
  value, onChangeText, label, icon, secureTextEntry = false,
}: {
  value: string;
  onChangeText: (t: string) => void;
  label: string;
  icon: string;
  secureTextEntry?: boolean;
}) => (
  <View style={s.inputWrap}>
    <Text style={s.inputIcon}>{icon}</Text>
    <TextInput
      style={s.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#9ca3af"
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 32 },
  logo: { alignItems: 'center', marginBottom: 48 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 36 },
  logoTitle: { fontSize: 32, fontWeight: 'bold', color: '#1565c0', letterSpacing: 2 },
  logoSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1f2937', paddingVertical: 14 },
  btnPrimary: {
    backgroundColor: '#1976d2', borderRadius: 10,
    paddingVertical: 15, alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  btnOutline: {
    borderRadius: 10, paddingVertical: 15, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#1976d2',
  },
  btnOutlineText: { color: '#1976d2', fontSize: 15, fontWeight: '600' },
  disabled: { opacity: 0.6 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerLabel: { color: '#9ca3af', fontSize: 12, marginHorizontal: 16 },
  error: { marginTop: 16, color: '#ef4444', textAlign: 'center', fontSize: 14 },
});
