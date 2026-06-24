# Dialog Engine - Quick Reference & Cheat Sheet

## 🚀 Setup (Một lần)

```tsx
// App.tsx hoặc root component
import { DialogProvider } from 'fox-ecom';

export default function App() {
  return (
    <DialogProvider>
      <YourAppContent />
    </DialogProvider>
  );
}
```

## 💬 Alert Dialog

**Mục đích**: Thông báo với 1 nút OK

```tsx
const { alert } = useDialog();

// Đơn giản
await alert({
  title: 'Success',
  message: 'Operation completed!',
});

// Đầy đủ
await alert({
  title: '✅ Success',
  message: 'Your changes have been saved.',
  button: {
    label: 'Got it',
    style: 'primary', // 'default' | 'primary' | 'danger'
    onPress: () => console.log('Closed'),
  },
});
```

## ✅ Confirm Dialog

**Mục đích**: Xác nhận Yes/No

```tsx
const { confirm } = useDialog();

const result = await confirm({
  title: 'Delete Item?',
  message: 'This action cannot be undone.',
  confirmButton: {
    label: 'Delete',
    style: 'danger',
  },
  cancelButton: {
    label: 'Cancel',
  },
});

if (result) {
  console.log('Confirmed!');
} else {
  console.log('Cancelled!');
}
```

## 📝 Input Dialog

**Mục đích**: Nhập text từ user

```tsx
const { input } = useDialog();

const name = await input({
  title: 'What is your name?',
  message: 'Required for registration',
  placeholder: 'Enter your name...',
  defaultValue: '',
});

if (name) {
  console.log('Name:', name);
} else {
  console.log('User cancelled');
}
```

## 🎨 Custom Dialog

**Mục đích**: Nội dung hoàn toàn tùy chỉnh

```tsx
const { custom } = useDialog();

await custom({
  title: 'Custom Content',
  content: (
    <View>
      <Image source={require('./image.png')} />
      <Text>Any React component here!</Text>
    </View>
  ),
  buttons: [
    {
      label: 'Action 1',
      onPress: () => console.log('1'),
      style: 'primary',
    },
    {
      label: 'Action 2',
      onPress: () => console.log('2'),
    },
    {
      label: 'Cancel',
      onPress: () => console.log('cancel'),
    },
  ],
});
```

## 🔔 Toast Notification

**Mục đích**: Thông báo tạm thời (tự động đóng)

```tsx
const { toast } = useDialog();

// Đơn giản
toast({ message: 'Saved!' });

// Đầy đủ
toast({
  message: 'Item added to cart',
  variant: 'success',        // 'success' | 'error' | 'warning' | 'info'
  duration: 3000,            // milliseconds (default 3000)
});

// Ví dụ khác
toast({ message: 'Error occurred!', variant: 'error', duration: 5000 });
toast({ message: 'Please fill all fields', variant: 'warning' });
toast({ message: 'Info only', variant: 'info' });
```

## 🎯 Advanced Usage

### Manual Close
```tsx
const { show, dismiss } = useDialog();

const id = await show({ type: 'alert', ... });
// Sau đó
dismiss(id);
```

### Close All
```tsx
const { dismissAll } = useDialog();

// Đóng tất cả dialogs
dismissAll();
```

### Chaining Operations
```tsx
const { confirm, input, toast } = useDialog();

const ok = await confirm({ title: 'Proceed?' });
if (ok) {
  const name = await input({ title: 'Your name?' });
  if (name) {
    toast({ message: `Welcome ${name}!`, variant: 'success' });
  }
}
```

## 🎨 Button Styles

```tsx
// Primary (blue) - recommended for confirmations
button: { label: 'OK', style: 'primary' }

// Default (light gray) - for secondary actions
button: { label: 'Cancel', style: 'default' }

// Danger (red) - for destructive actions
button: { label: 'Delete', style: 'danger' }
```

## 🎭 Dialog Types Summary

| Type | Returns | Auto-close | Use Case |
|------|---------|-----------|----------|
| `alert` | `Promise<void>` | Manual | Simple notification |
| `confirm` | `Promise<boolean>` | Manual | Yes/No decision |
| `input` | `Promise<string\|null>` | Manual | User input |
| `custom` | `Promise<void>` | Manual | Complex UI |
| `toast` | `void` | Auto (3s) | Quick notification |

## ⚡ Performance Tips

```tsx
// ❌ Don't: Heavy components
await dialog.custom({
  content: <FlatList data={huge_array} ... />
});

// ✅ Do: Simple components
await dialog.custom({
  content: <Text>Simple message</Text>
});

// ❌ Don't: Many simultaneous dialogs
dialog.alert(...);
dialog.alert(...);
dialog.alert(...);
dialog.alert(...);

// ✅ Do: Sequential dialogs
await dialog.alert(...);
await dialog.alert(...);
```

## 🐛 Common Patterns

### Confirmation Before Action
```tsx
const handleDelete = async () => {
  const ok = await dialog.confirm({
    title: 'Delete?',
    message: 'Are you sure?',
    confirmButton: { label: 'Delete', style: 'danger' },
  });
  
  if (ok) {
    // Perform delete
    await deleteItem(id);
    toast({ message: 'Deleted!', variant: 'success' });
  }
};
```

### Form Validation
```tsx
if (!name) {
  toast({ message: 'Enter name', variant: 'warning' });
  return;
}

if (!email) {
  toast({ message: 'Enter email', variant: 'warning' });
  return;
}

await alert({ title: 'Success', message: 'Form submitted!' });
```

### Loading Sequence
```tsx
const handleLogin = async () => {
  const email = await dialog.input({
    title: 'Email',
    placeholder: 'you@example.com',
  });
  
  if (!email) return;
  
  const ok = await dialog.confirm({
    title: 'Confirm Email',
    message: `Login as ${email}?`,
  });
  
  if (ok) {
    // Call API
    toast({ message: 'Logged in!', variant: 'success' });
  }
};
```

## 📋 API Quick Reference

```typescript
// Hook
const {
  alert,      // (config) => Promise<void>
  confirm,    // (config) => Promise<boolean>
  input,      // (config) => Promise<string|null>
  custom,     // (config) => Promise<void>
  toast,      // (config) => void
  dismiss,    // (id: string) => void
  dismissAll, // () => void
} = useDialog();

// Variants
type Variant = 'success' | 'error' | 'warning' | 'info';

// Styles
type ButtonStyle = 'default' | 'primary' | 'danger';
```

## 🔍 Debugging

```tsx
// Log all dialogs
const dialogs = useDialog().getAll?.(); // if exposed
console.log('Active dialogs:', dialogs);

// Check context
import { DialogContext } from 'fox-ecom';
const context = useContext(DialogContext);
console.log('Dialog context:', context);
```

## ❌ Common Mistakes

```tsx
// ❌ Forget DialogProvider
<App /> // Will throw error

// ❌ Don't await toast (returns void)
const result = await dialog.toast(...); // Wrong!

// ❌ Mix await and .then()
dialog.confirm(...).then(r => console.log(r)); // Works but messy

// ❌ Forget error handling
const name = await dialog.input(...);
// name could be null!

// ✅ Handle all cases
const name = await dialog.input(...);
if (name) {
  // User entered name
} else {
  // User cancelled
}
```

## 🎯 Real World Examples

### E-commerce Add to Cart
```tsx
const handleAddToCart = async () => {
  const quantity = await dialog.input({
    title: 'Quantity',
    placeholder: '1',
    defaultValue: '1',
  });
  
  if (quantity && parseInt(quantity) > 0) {
    addToCart(product, parseInt(quantity));
    toast({ message: 'Added to cart! 🛒', variant: 'success' });
  }
};
```

### Permission Request
```tsx
const handleDeleteAccount = async () => {
  const confirmed = await dialog.confirm({
    title: 'Delete Account?',
    message: 'This cannot be undone. All data will be lost.',
    confirmButton: { label: 'Delete Account', style: 'danger' },
  });
  
  if (confirmed) {
    const password = await dialog.input({
      title: 'Confirm Password',
      placeholder: 'Enter your password',
    });
    
    if (password) {
      // Delete account
      toast({ message: 'Account deleted', variant: 'error' });
    }
  }
};
```

### Error Handling
```tsx
try {
  await saveData();
  toast({ message: 'Saved successfully!', variant: 'success' });
} catch (error) {
  await alert({
    title: 'Error',
    message: error.message,
    button: { label: 'OK', style: 'danger' },
  });
}
```

---

**Need more help?** → Read `docs/DIALOG_ENGINE.md`

**See examples?** → Check `example/DialogExample.tsx`
