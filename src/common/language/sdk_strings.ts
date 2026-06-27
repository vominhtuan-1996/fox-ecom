/**
 * SdkStrings — single source of truth cho mọi text hiển thị trong SDK.
 *
 * Rule: KHÔNG dùng string literal trực tiếp trong JSX / alert / placeholder.
 * Luôn tham chiếu qua SdkStrings.<namespace>.<key>.
 * Nếu chưa có key → khai báo thêm tại đây, KHÔNG inline ở component.
 */
export const SdkStrings = {
  // ── Common ──────────────────────────────────────────────────────────────────
  common: {
    ok: 'OK',
    cancel: 'Huỷ',
    confirm: 'Xác nhận',
    close: 'Đóng',
    back: 'Quay lại',
    save: 'Lưu',
    delete: 'Xoá',
    retry: 'Thử lại',
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    error: 'Lỗi',
    success: 'Thành công',
    warning: 'Cảnh báo',
    info: 'Thông tin',
  },

  // ── Auth / Login ─────────────────────────────────────────────────────────────
  auth: {
    loginTitle: 'Đăng nhập',
    loginButton: 'Đăng nhập',
    loginWithToken: 'Đăng nhập bằng Token',
    usernamePlaceholder: 'Tên đăng nhập',
    usernameLabel: 'Username',
    passwordPlaceholder: 'Mật khẩu',
    passwordLabel: 'Mật khẩu',
    tokenPlaceholder: 'Access Token',
    tokenLabel: 'Access Token',
    errorEmptyUsername: 'Vui lòng nhập username',
    errorEmptyPassword: 'Vui lòng nhập mật khẩu',
    errorEmptyToken: 'Vui lòng nhập token',
    errorInvalidCredentials: 'Thông tin đăng nhập không đúng',
    errorLoginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.',
  },

  // ── MultiSelector / Selector ─────────────────────────────────────────────────
  selector: {
    searchPlaceholder: 'Tìm kiếm...',
    noResults: 'Không có kết quả',
    noData: 'Không có dữ liệu',
    allLoaded: 'Đã tải hết',
    selectedCount: (n: number) => `Đã chọn ${n} mục`,
  },

  // ── Dialog ───────────────────────────────────────────────────────────────────
  dialog: {
    defaultTitle: 'Thông báo',
    defaultConfirmButton: 'Xác nhận',
    defaultCancelButton: 'Huỷ',
    defaultOkButton: 'OK',
    inputPlaceholder: 'Nhập nội dung...',
  },

  // ── Toast ────────────────────────────────────────────────────────────────────
  toast: {
    success: 'Thành công',
    error: 'Đã xảy ra lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin',
  },

  // ── Navigator ────────────────────────────────────────────────────────────────
  navigator: {
    backLabel: 'Quay lại',
    defaultTitle: '',
  },

  // ── Product / Cart ───────────────────────────────────────────────────────────
  product: {
    addToCart: 'Thêm vào giỏ',
    outOfStock: 'Hết hàng',
    price: (amount: string) => `${amount} ₫`,
  },

  cart: {
    title: 'Giỏ hàng',
    empty: 'Giỏ hàng trống',
    checkout: 'Thanh toán',
    total: 'Tổng cộng',
    remove: 'Xoá',
    quantity: (n: number) => `SL: ${n}`,
  },
} as const;
