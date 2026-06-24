# 🦊 Fox eCommerce - Web UI Preview

Web-based UI component preview for Fox eCommerce SDK

## 🚀 Getting Started

### Install Dependencies

```bash
cd demo
npm install
```

### Start Development Server

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features

- ✅ Menu Navigation
- ✅ Alert Dialog
- ✅ Confirm Dialog
- ✅ Input Dialog
- ✅ Custom Dialog
- ✅ Toast Notifications
- 🎨 Responsive Design

## 🎯 Components

```
src/
├── screens/              # Page screens
│   ├── MenuScreen.js
│   ├── HomeScreen.js
│   ├── DialogAlertScreen.js
│   ├── DialogConfirmScreen.js
│   ├── DialogInputScreen.js
│   ├── DialogCustomScreen.js
│   └── ToastScreen.js
├── components/           # Reusable components
│   ├── Dialog.js
│   └── Toast.js
├── styles/              # CSS files
│   ├── MenuScreen.css
│   ├── Screen.css
│   ├── Dialog.css
│   └── Toast.css
└── App.js               # Main app
```

## 📦 Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder.

## 🔗 Integration with SDK

To use real SDK components instead of demo versions:

```javascript
// demo/src/components/Dialog.js
import { DialogAlert, DialogConfirm } from 'fox-ecom';

// Replace demo Dialog with real SDK component
```

## 📚 Learn More

- [Create React App](https://create-react-app.dev/)
- [React Docs](https://react.dev/)

---

**Preview URL**: http://localhost:3000
