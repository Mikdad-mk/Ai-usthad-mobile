# Voice Input - Expo Go Limitation

## ⚠️ Important Notice

The voice input feature uses `@react-native-voice/voice`, which is a **native module** that requires custom native code. This means:

## ❌ Does NOT Work With Expo Go

The voice input button will **not appear** when running in Expo Go because the native voice module cannot be loaded.

**Error you might see:**
```
Error checking voice availability: [TypeError: Cannot read property 'isSpeechAvailable' of null]
```

This is **expected behavior** and not a bug. The app gracefully handles this by hiding the voice button.

## ✅ Works With Development Build

To use voice input, you need to create a **development build**:

### Option 1: Local Development Build

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

This will:
1. Build the native code
2. Install on your device/emulator
3. Enable voice input functionality

### Option 2: EAS Development Build

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Create development build
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

Then install the built APK/IPA on your device.

### Option 3: Production Build

```bash
# Build for production
eas build --profile production --platform android
# or
eas build --profile production --platform ios
```

## 🔍 How to Tell if Voice is Available

The app automatically detects if voice input is supported:

- **Voice Available**: Large 🎤 button appears above text input
- **Voice Not Available**: Button is hidden, only text input shows

## 🛠️ Current Setup

Your app is configured to:
1. Check if voice module is available
2. Hide the button if not available
3. Show helpful console warnings
4. Continue working normally without voice

## 📱 Testing Voice Input

### Step 1: Create Development Build
```bash
# For Android (easiest to test)
npx expo run:android
```

### Step 2: Grant Permissions
When you first tap the mic button, grant:
- Microphone permission
- Speech recognition permission (iOS)

### Step 3: Test
1. Open chat
2. Look for large 🎤 button
3. Tap and speak in Malayalam
4. See transcript appear

## 🚀 Recommended Workflow

### During Development
1. Use Expo Go for quick testing of UI/logic
2. Voice button won't show - this is normal
3. Test other features normally

### When Testing Voice
1. Build development build: `npx expo run:android`
2. Test voice input thoroughly
3. Test on real device (not emulator) for best results

### For Production
1. Build production build: `eas build --profile production`
2. Test on real devices
3. Submit to app stores

## 💡 Why This Limitation?

Expo Go is a pre-built app that includes common Expo modules. Custom native modules like `@react-native-voice/voice` require:
- Native Android/iOS code compilation
- Custom permissions
- Platform-specific implementations

These cannot be included in the generic Expo Go app.

## ✅ What Still Works in Expo Go

Everything except voice input:
- ✅ Chat functionality
- ✅ Text input
- ✅ AI responses
- ✅ Text-to-speech (🔊 Listen button)
- ✅ Authentication
- ✅ All other features

## 🎯 Quick Commands

### Test Without Voice (Expo Go)
```bash
npx expo start
# Scan QR code with Expo Go
# Voice button won't appear - this is expected
```

### Test With Voice (Development Build)
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### Build for Production
```bash
# Android APK
eas build --profile production --platform android

# iOS IPA
eas build --profile production --platform ios
```

## 📚 More Information

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Voice](https://github.com/react-native-voice/voice)

## 🔧 Troubleshooting

### "Voice button not showing in Expo Go"
- **Expected**: This is normal, use development build

### "Voice button not showing in development build"
- Check console for errors
- Ensure permissions are granted
- Try rebuilding: `npx expo run:android --clean`

### "Permission denied"
- Go to device Settings → Apps → AI Ustad
- Enable Microphone permission
- Restart app

### "Voice recognition not working"
- Ensure internet connection
- Check microphone is working
- Try speaking more clearly
- Test in quiet environment

## ✨ Summary

| Environment | Voice Input | Text Input | TTS |
|-------------|-------------|------------|-----|
| Expo Go | ❌ Hidden | ✅ Works | ✅ Works |
| Dev Build | ✅ Works | ✅ Works | ✅ Works |
| Production | ✅ Works | ✅ Works | ✅ Works |

**Bottom Line**: Voice input requires a development or production build. It's worth it for the amazing Malayalam voice input experience!
