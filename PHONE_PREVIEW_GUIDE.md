# Phone Preview Setup Guide

## Extension Setup ✅
- ✅ Phone Preview v3.1.7 installed
- ✅ VSCode settings configured (.vscode/settings.json)
- ✅ Launch configuration ready (.vscode/launch.json)

## How to Use

### Step 1: Start Metro Bundler
```bash
cd /Users/tuanvm37/fox-ecom/example
npm run start -- --reset-cache
```

### Step 2: Open VSCode & Launch Phone Preview
```bash
# In VSCode:
# 1. Command Palette (Cmd+Shift+P)
# 2. Type: "Phone Preview: Start"
# 3. Select the configuration
```

OR use the Run & Debug panel:
- Click "Run and Debug" in VSCode sidebar
- Select "Phone Preview - iOS" from dropdown
- Click the green play button

### Step 3: View Your App
- Phone preview window opens in VSCode
- Hot reload works automatically
- Edit code and see changes instantly

## Configuration

**Current Setup:**
- Bundle URL: `http://localhost:8081`
- Device: iPhone 17 Pro
- Auto-start: Disabled (manual start)

## Troubleshooting

If Phone Preview can't connect:
1. Verify Metro is running on port 8081
2. Check network: `curl http://localhost:8081/index.bundle`
3. Restart Phone Preview extension
4. Check VSCode output panel for errors

## Benefits
- ✅ No simulator window needed
- ✅ Inline app preview
- ✅ Fast hot reload
- ✅ Better development experience
