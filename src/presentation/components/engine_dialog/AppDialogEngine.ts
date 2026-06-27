import React from 'react';
import { AppDialogConfig, AppDialogType, AppProcessStepConfig, AppTransferFileConfig, AppTransferType } from './models/dialog_config';
import { ProcessStepperComponent } from './components/ProcessStepperComponent';
import { MultiTransferDialog } from './components/MultiTransferDialog';
import { UpdatePatchDialog } from './components/UpdatePatchDialog';

// ─── Host callback (registered by DialogEngineHost) ───────────────────────────

type ShowDialogFn = (config: AppDialogConfig) => void;
type ShowCustomFn = (content: React.ReactNode, barrierDismissible?: boolean) => void;
type DismissAllFn = () => void;

let _showDialog: ShowDialogFn | null = null;
let _showCustom: ShowCustomFn | null = null;
let _dismissAll: DismissAllFn | null = null;

/**
 * AppDialogEngine — static class, context-free.
 * Gọi `AppDialogEngine.info(...)` từ bất kỳ đâu sau khi mount `<DialogEngineHost />`.
 * Tương đương AppDialogEngine trong Flutter (dùng navigatorKey).
 */
export class AppDialogEngine {
  // ── Registration (called by DialogEngineHost) ─────────────────────────────

  static _register(show: ShowDialogFn, showCustom: ShowCustomFn, dismissAll: DismissAllFn): void {
    _showDialog = show;
    _showCustom = showCustom;
    _dismissAll = dismissAll;
  }

  static _unregister(): void {
    _showDialog = null;
    _showCustom = null;
    _dismissAll = null;
  }

  // ── Core show ─────────────────────────────────────────────────────────────

  static show(config: AppDialogConfig): void {
    _showDialog?.(config);
  }

  // ── Shortcuts by type ─────────────────────────────────────────────────────

  static info(message: string, config?: Partial<AppDialogConfig>): void {
    AppDialogEngine.show({ type: 'info', message, ...config });
  }

  static error(message: string, config?: Partial<AppDialogConfig>): void {
    AppDialogEngine.show({ type: 'error', message, ...config });
  }

  static success(message: string, config?: Partial<AppDialogConfig>): void {
    AppDialogEngine.show({ type: 'success', message, ...config });
  }

  static warning(message: string, config?: Partial<AppDialogConfig>): void {
    AppDialogEngine.show({ type: 'warning', message, ...config });
  }

  static confirm(message: string, onConfirm: () => void, config?: Partial<AppDialogConfig>): void {
    AppDialogEngine.show({
      type: 'warning',
      message,
      showCancelButton: true,
      onConfirm,
      ...config,
    });
  }

  // ── Highlight message ─────────────────────────────────────────────────────

  static showHighlightMessage(message: string, type: AppDialogType = 'info'): void {
    AppDialogEngine.show({
      type,
      message,
      barrierDismissible: true,
      showConfirmButton: false,
    });
  }

  // ── Stepper ───────────────────────────────────────────────────────────────

  static showStepper(params: {
    steps: AppProcessStepConfig[];
    title?: string;
    summaryTitleBuilder?: (results: unknown[]) => string;
    summaryNotesBuilder?: (results: unknown[]) => string[];
    onCompleted?: () => void;
  }): void {
    _showCustom?.(
      React.createElement(ProcessStepperComponent, {
        steps: params.steps,
        title: params.title,
        summaryTitleBuilder: params.summaryTitleBuilder,
        summaryNotesBuilder: params.summaryNotesBuilder,
        onAllCompleted: params.onCompleted,
      }),
      false,
    );
  }

  // ── Multi transfer ────────────────────────────────────────────────────────

  static showMultiDownload(params: {
    files: AppTransferFileConfig[];
    title?: string;
    onCompleted?: () => void;
    onCanceled?: () => void;
  }): void {
    AppDialogEngine._showTransfer({ ...params, type: 'download' });
  }

  static showMultiUpload(params: {
    files: AppTransferFileConfig[];
    title?: string;
    onCompleted?: () => void;
    onCanceled?: () => void;
  }): void {
    AppDialogEngine._showTransfer({ ...params, type: 'upload' });
  }

  // ── Update patch ──────────────────────────────────────────────────────────

  static showUpdatePatch(params: {
    version: string;
    changelog: string[];
    onUpdate: () => void;
    autoSimulate?: boolean;
  }): void {
    _showCustom?.(
      React.createElement(UpdatePatchDialog, {
        version: params.version,
        changelog: params.changelog,
        onUpdate: params.onUpdate,
        autoSimulate: params.autoSimulate,
        showSimulator: params.autoSimulate,
      }),
      false,
    );
  }

  // ── Dismiss ───────────────────────────────────────────────────────────────

  static dismissAll(): void {
    _dismissAll?.();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private static _showTransfer(params: {
    files: AppTransferFileConfig[];
    type: AppTransferType;
    title?: string;
    onCompleted?: () => void;
    onCanceled?: () => void;
  }): void {
    _showCustom?.(
      React.createElement(MultiTransferDialog, {
        files: params.files,
        type: params.type,
        title: params.title,
        onCompleted: () => { _dismissAll?.(); params.onCompleted?.(); },
        onCanceled: () => { _dismissAll?.(); params.onCanceled?.(); },
      }),
      false,
    );
  }
}
