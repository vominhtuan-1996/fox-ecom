import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { View, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { AppDialogEngine } from './AppDialogEngine';
import { AppSnackbarEngine } from './AppSnackbarEngine';
import { AppDialogConfig, AppSnackbarConfig } from './models/dialog_config';
import { DialogBaseComponent } from './components/DialogBaseComponent';
import { SnackbarBaseComponent } from './components/SnackbarBaseComponent';

interface SnackbarEntry {
  id: number;
  config: AppSnackbarConfig;
  position: 'top' | 'bottom';
}

interface DialogEntry {
  id: number;
  type: 'standard' | 'custom';
  config?: AppDialogConfig;
  content?: ReactNode;
  barrierDismissible?: boolean;
}

let _nextId = 0;

/**
 * DialogEngineHost — mount một lần tại root app để kích hoạt AppDialogEngine và AppSnackbarEngine.
 * Tương đương NavigatorKey + Overlay trong Flutter.
 *
 * @example
 * ```
 * // App.js
 * <DialogEngineHost>
 *   <NavigationStack />
 * </DialogEngineHost>
 * ```
 */
export const DialogEngineHost: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogEntry[]>([]);
  const [snackbars, setSnackbars] = useState<SnackbarEntry[]>([]);

  // ── Dialog callbacks ───────────────────────────────────────────────────────

  const showDialog = useCallback((config: AppDialogConfig) => {
    setDialogs(prev => [...prev, { id: _nextId++, type: 'standard', config }]);
  }, []);

  const showCustom = useCallback((content: ReactNode, barrierDismissible = true) => {
    setDialogs(prev => [...prev, { id: _nextId++, type: 'custom', content, barrierDismissible }]);
  }, []);

  const dismissAll = useCallback(() => {
    setDialogs([]);
  }, []);

  const dismissDialog = useCallback((id: number) => {
    setDialogs(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── Snackbar callbacks ─────────────────────────────────────────────────────

  const showTop = useCallback((config: AppSnackbarConfig) => {
    const id = _nextId++;
    setSnackbars(prev => [...prev, { id, config, position: 'top' }]);
    const dur = config.duration ?? 3000;
    setTimeout(() => setSnackbars(prev => prev.filter(s => s.id !== id)), dur);
  }, []);

  const showBottom = useCallback((config: AppSnackbarConfig) => {
    const id = _nextId++;
    setSnackbars(prev => [...prev, { id, config, position: 'bottom' }]);
    const dur = config.duration ?? 3000;
    setTimeout(() => setSnackbars(prev => prev.filter(s => s.id !== id)), dur);
  }, []);

  const clearTop = useCallback(() => {
    setSnackbars(prev => prev.filter(s => s.position !== 'top'));
  }, []);

  const removeSnackbar = useCallback((id: number) => {
    setSnackbars(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── Register / unregister ─────────────────────────────────────────────────

  useEffect(() => {
    AppDialogEngine._register(showDialog, showCustom, dismissAll);
    AppSnackbarEngine._register(showTop, showBottom, clearTop);
    return () => {
      AppDialogEngine._unregister();
      AppSnackbarEngine._unregister();
    };
  }, [showDialog, showCustom, dismissAll, showTop, showBottom, clearTop]);

  // ── Render ────────────────────────────────────────────────────────────────

  const topSnackbars = snackbars.filter(s => s.position === 'top');
  const bottomSnackbars = snackbars.filter(s => s.position === 'bottom');
  const activeDialog = dialogs[dialogs.length - 1];

  return (
    <View style={s.root}>
      {children}

      {/* Top snackbar queue */}
      {topSnackbars.length > 0 && (
        <View style={s.topOverlay} pointerEvents="box-none">
          <SafeAreaView pointerEvents="box-none">
            {topSnackbars.map(item => (
              <SnackbarBaseComponent
                key={item.id}
                config={item.config}
                position="top"
                onClose={() => removeSnackbar(item.id)}
              />
            ))}
          </SafeAreaView>
        </View>
      )}

      {/* Bottom snackbar */}
      {bottomSnackbars.length > 0 && (
        <View style={s.bottomOverlay} pointerEvents="box-none">
          <SafeAreaView pointerEvents="box-none">
            {bottomSnackbars.map(item => (
              <SnackbarBaseComponent
                key={item.id}
                config={item.config}
                position="bottom"
                onClose={() => removeSnackbar(item.id)}
              />
            ))}
          </SafeAreaView>
        </View>
      )}

      {/* Dialog overlay */}
      {activeDialog && (
        activeDialog.type === 'standard' && activeDialog.config
          ? (
            <DialogBaseComponent
              config={activeDialog.config}
              onDismiss={() => dismissDialog(activeDialog.id)}
            />
          )
          : (
            <Modal
              transparent
              animationType="none"
              visible
              onRequestClose={() => {
                if (activeDialog.barrierDismissible !== false) dismissDialog(activeDialog.id);
              }}
            >
              <View style={s.customBackdrop}>
                {activeDialog.content}
              </View>
            </Modal>
          )
      )}
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1 },
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9998,
  },
  bottomOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9998,
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
