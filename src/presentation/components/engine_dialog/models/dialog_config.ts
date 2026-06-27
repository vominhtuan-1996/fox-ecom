import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SdkStrings } from '../../../../common/language';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type AppDialogType = 'info' | 'error' | 'success' | 'warning';
export type AppSnackbarType = 'info' | 'error' | 'success' | 'warning';
export type AppSnackbarPosition = 'top' | 'bottom';

// ─── Color tokens ─────────────────────────────────────────────────────────────

export const DialogColorToken = {
  // Info
  infoBackground: '#EFF6FF',
  infoBorder: '#3B82F6',
  infoIcon: '#3B82F6',
  infoButton: '#2563EB',

  // Error
  errorBackground: '#FFF1F2',
  errorBorder: '#EF4444',
  errorIcon: '#EF4444',
  errorButton: '#DC2626',

  // Success
  successBackground: '#F0FDF4',
  successBorder: '#22C55E',
  successIcon: '#22C55E',
  successButton: '#16A34A',

  // Warning
  warningBackground: '#FFFBEB',
  warningBorder: '#F59E0B',
  warningIcon: '#F59E0B',
  warningButton: '#D97706',

  // Text
  titleDark: '#111827',
  messageGrey: '#6B7280',

  // Snackbar backgrounds
  snackbarInfoBg: '#1E40AF',
  snackbarErrorBg: '#B91C1C',
  snackbarSuccessBg: '#15803D',
  snackbarWarningBg: '#B45309',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getDialogColors(type: AppDialogType) {
  return {
    background: DialogColorToken[`${type}Background`] as string,
    border: DialogColorToken[`${type}Border`] as string,
    icon: DialogColorToken[`${type}Icon`] as string,
    button: DialogColorToken[`${type}Button`] as string,
  };
}

export function getDialogIcon(type: AppDialogType): string {
  return { info: 'ℹ️', error: '❌', success: '✅', warning: '⚠️' }[type];
}

export function getDialogDefaultTitle(type: AppDialogType): string {
  return {
    info: SdkStrings.common.info,
    error: SdkStrings.common.error,
    success: SdkStrings.common.success,
    warning: SdkStrings.common.warning,
  }[type];
}

export function getSnackbarBg(type: AppSnackbarType): string {
  return DialogColorToken[`snackbar${type.charAt(0).toUpperCase() + type.slice(1)}Bg`] as string;
}

export function getSnackbarIcon(type: AppSnackbarType): string {
  return { info: 'ℹ️', error: '❌', success: '✅', warning: '⚠️' }[type];
}

// ─── Configs ─────────────────────────────────────────────────────────────────

export interface AppDialogConfig {
  type?: AppDialogType;
  title?: string;
  message?: string;
  /** Override toàn bộ phần nội dung */
  contentWidget?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  barrierDismissible?: boolean;
  /** Override icon (emoji string hoặc ReactNode) */
  customIcon?: ReactNode;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
}

export interface AppSnackbarConfig {
  message: string;
  type?: AppSnackbarType;
  position?: AppSnackbarPosition;
  /** ms, default 3000 */
  duration?: number;
  customIcon?: ReactNode;
  contentWidget?: ReactNode;
  additionalActions?: ReactNode[];
  leading?: ReactNode;
  trailing?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showCloseButton?: boolean;
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

export type AppProcessStepStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AppProcessStepConfig<R = unknown> {
  title: string;
  processingSubtitle?: string;
  action: () => Promise<R>;
  subtitleBuilder?: (result: R) => string;
  initialStatus?: AppProcessStepStatus;
  initialResult?: R;
}

// ─── Transfer ────────────────────────────────────────────────────────────────

export type AppTransferType = 'download' | 'upload';

export interface AppTransferFileConfig {
  name: string;
  sizeInMB: number;
  transferAction: (onProgress: (progress: number) => void) => Promise<void>;
}
