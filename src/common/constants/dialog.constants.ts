export const DIALOG_CONSTANTS = {
  DEFAULT_TOAST_DURATION: 3000,
  DEFAULT_TOAST_DURATION_LONG: 5000,
  ANIMATION_DURATION: 300,
  MAX_QUEUE_SIZE: 10,
  DEFAULT_BUTTON_LABEL: 'OK',
  DEFAULT_CANCEL_LABEL: 'Cancel',
  DEFAULT_CONFIRM_LABEL: 'Confirm',
} as const;

export const TOAST_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const DIALOG_BUTTON_STYLES = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  DANGER: 'danger',
} as const;
