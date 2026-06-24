# Dialog Engine

Bộ Dialog Engine hoàn chỉnh cho ứng dụng React Native với hỗ trợ nhiều loại dialog và tính năng nâng cao.

## 📋 Loại Dialogs Được Hỗ Trợ

### 1. Alert Dialog
Thông báo đơn giản với một nút OK.

```tsx
const { alert } = useDialog();

await alert({
  title: '🎉 Success',
  message: 'Operation completed successfully!',
  button: {
    label: 'OK',
    style: 'primary', // 'default' | 'primary' | 'danger'
  },
});
```

### 2. Confirm Dialog
Xác nhận hành động với nút Yes/No.

```tsx
const { confirm } = useDialog();

const result = await confirm({
  title: '⚠️ Confirm',
  message: 'Do you want to delete this item?',
  confirmButton: {
    label: 'Delete',
    style: 'danger',
  },
  cancelButton: {
    label: 'Cancel',
  },
});

if (result) {
  // User confirmed
}
```

### 3. Input Dialog
Dialog nhập dữ liệu từ người dùng.

```tsx
const { input } = useDialog();

const name = await input({
  title: '📝 Enter Name',
  message: 'What is your name?',
  placeholder: 'Type your name...',
  defaultValue: '',
});

if (name) {
  console.log('Name:', name);
}
```

### 4. Custom Dialog
Dialog tùy chỉnh với nội dung React component.

```tsx
const { custom } = useDialog();

await custom({
  title: '🎨 Custom Content',
  content: (
    <View>
      <Text>Any React component here</Text>
      <Image source={require('./image.png')} />
    </View>
  ),
  buttons: [
    {
      label: 'Action 1',
      onPress: () => { /* handle */ },
      style: 'primary',
    },
    {
      label: 'Cancel',
      onPress: () => { /* handle */ },
    },
  ],
});
```

### 5. Toast Notification
Thông báo tạm thời tự động biến mất.

```tsx
const { toast } = useDialog();

toast({
  message: 'Operation successful! ✨',
  variant: 'success', // 'success' | 'error' | 'warning' | 'info'
  duration: 3000, // ms, mặc định 3000
});
```

## 🚀 Cách Sử Dụng

### 1. Bọc App với DialogProvider

```tsx
import { DialogProvider } from 'fox-ecom';

export default function App() {
  return (
    <DialogProvider>
      <YourAppContent />
    </DialogProvider>
  );
}
```

### 2. Sử dụng useDialog Hook trong Component

```tsx
import { useDialog } from 'fox-ecom';

const MyComponent: React.FC = () => {
  const { alert, confirm, toast, dismiss, dismissAll } = useDialog();

  return (
    <TouchableOpacity onPress={() => alert({ ... })}>
      <Text>Show Dialog</Text>
    </TouchableOpacity>
  );
};
```

## 📖 API Reference

### `useDialog()` Hook

Trả về object với các method sau:

```typescript
interface UseDialogReturn {
  // Hiển thị alert dialog
  alert(config: AlertConfig): Promise<void>;

  // Hiển thị confirm dialog
  confirm(config: ConfirmConfig): Promise<boolean>;

  // Hiển thị input dialog
  input(config: InputConfig): Promise<string | null>;

  // Hiển thị custom dialog
  custom(config: CustomConfig): Promise<void>;

  // Hiển thị toast notification
  toast(config: ToastConfig): void;

  // Đóng dialog theo ID
  dismiss(id: string): void;

  // Đóng tất cả dialogs
  dismissAll(): void;
}
```

### Alert Dialog Config

```typescript
interface AlertDialogConfig {
  title: string;
  message: string;
  button?: {
    label: string;
    onPress?: () => void;
    style?: 'default' | 'primary' | 'danger';
  };
}
```

### Confirm Dialog Config

```typescript
interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmButton?: {
    label: string;
    onPress?: () => void;
    style?: 'primary';
  };
  cancelButton?: {
    label: string;
    onPress?: () => void;
  };
}
```

### Input Dialog Config

```typescript
interface InputDialogConfig {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}
```

### Custom Dialog Config

```typescript
interface CustomDialogConfig {
  title?: string;
  content: React.ReactNode;
  buttons?: {
    label: string;
    onPress: () => void;
    style?: 'default' | 'primary' | 'danger';
  }[];
}
```

### Toast Config

```typescript
interface ToastConfig {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, default 3000
}
```

## 🎨 Styling

Dialog Engine tự động sử dụng theme system của project:
- **Colors**: Từ `src/common/theme/colors.ts`
- **Typography**: Từ `src/common/theme/typography.ts`
- **Spacing**: Từ `src/common/theme/spacing.ts`
- **Shadows**: Từ `src/common/theme/spacing.ts`

Để thay đổi styling, chỉnh sửa các file theme.

## 🏗️ Architecture

Dialog Engine tuân theo Clean Architecture 5-layer:

```
Domain Layer
  ├── dialog.repository.ts (interface)
  └── show_dialog.usecase.ts

Data Layer
  └── dialog.repository.impl.ts (implementation)

Presentation Layer
  ├── useDialog.ts (hook)
  ├── DialogProvider.tsx (context provider)
  ├── DialogHost.tsx (render engine)
  └── dialogs/
      ├── DialogAlert.tsx
      ├── DialogConfirm.tsx
      ├── DialogInput.tsx
      ├── DialogCustom.tsx
      └── Toast.tsx

Common Layer
  ├── dialog.types.ts
  └── dialog.constants.ts
```

## 💡 Best Practices

### 1. Luôn sử dụng async/await

```tsx
// ✅ Đúng
const result = await dialog.confirm({ ... });

// ❌ Sai
dialog.confirm({ ... }).then(result => { ... });
```

### 2. Xử lý user cancel

```tsx
const name = await dialog.input({ ... });

if (name) {
  // User entered name
} else {
  // User cancelled
}
```

### 3. Khống chế queue dialogs

Dialog Engine tự động giới hạn queue tối đa 10 dialogs. Nếu vượt quá, dialog cũ nhất sẽ bị đóng tự động.

### 4. Custom content

Khi sử dụng custom dialog, tránh các component quá nặng:

```tsx
// ✅ Đơn giản
<Text>Simple content</Text>

// ❌ Tránh
<FlatList data={largeArray} ... />
```

## 🔧 Configuration

Điều chỉnh constants trong `src/common/constants/dialog.constants.ts`:

```typescript
const DIALOG_CONSTANTS = {
  DEFAULT_TOAST_DURATION: 3000,      // Toast hiển thị mặc định
  ANIMATION_DURATION: 300,            // Thời gian animation
  MAX_QUEUE_SIZE: 10,                 // Tối đa dialog trong queue
};
```

## 📝 Examples

Xem file `example/DialogExample.tsx` để xem đầy đủ các ví dụ sử dụng.

## ⚙️ Integration

Dialog Engine đã được tích hợp với:
- ✅ Clean Architecture 5-layer
- ✅ Dependency Injection (DI)
- ✅ Theme System
- ✅ TypeScript strict mode
- ✅ React Native Hooks
