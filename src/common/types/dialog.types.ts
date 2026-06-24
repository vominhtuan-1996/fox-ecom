export type DialogType = 'alert' | 'confirm' | 'input' | 'custom' | 'toast';

export type DialogButtonStyle = 'default' | 'primary' | 'danger';

export interface DialogButton {
  label: string;
  onPress: () => void;
  style?: DialogButtonStyle;
}

export interface AlertDialogConfig {
  type: 'alert';
  title: string;
  message: string;
  button?: DialogButton;
}

export interface ConfirmDialogConfig {
  type: 'confirm';
  title: string;
  message: string;
  confirmButton?: DialogButton;
  cancelButton?: DialogButton;
}

export interface InputDialogConfig {
  type: 'input';
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

export interface CustomDialogConfig {
  type: 'custom';
  title?: string;
  content: React.ReactNode;
  buttons?: DialogButton[];
}

export interface ToastConfig {
  type: 'toast';
  message: string;
  duration?: number;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export type DialogConfig =
  | AlertDialogConfig
  | ConfirmDialogConfig
  | InputDialogConfig
  | CustomDialogConfig
  | ToastConfig;

export interface DialogState {
  id: string;
  config: DialogConfig;
  isVisible: boolean;
  createdAt: number;
}

export interface UseDialogReturn {
  alert: (config: Omit<AlertDialogConfig, 'type'>) => Promise<void>;
  confirm: (config: Omit<ConfirmDialogConfig, 'type'>) => Promise<boolean>;
  input: (config: Omit<InputDialogConfig, 'type'>) => Promise<string | null>;
  custom: (config: Omit<CustomDialogConfig, 'type'>) => Promise<void>;
  toast: (config: Omit<ToastConfig, 'type'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
