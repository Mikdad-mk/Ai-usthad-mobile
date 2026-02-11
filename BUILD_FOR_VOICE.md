# Building App for Voice Input

## ⚠️ Important: Voice Input Requires Native Build

The microphone button is **hidden in Expo Go** because voice input requires native modules that aren't available in Expo Go.

## 🚀 How to Enable Voice Input

### Option 1: Local Development Build (Recommended for Testing)

**For Android:**
```bash
npx expo run:android
```

This will:
1. Build the native Android app
2. Install it on your connected device/emulator
3. Enable voice input functionality
4. Take 5-10 minutes first time

**For iOS:**
```bash
npx expo run:ios
```

### Option 2: EAS Build (For Production)

**Development Build:**
```bash
eas build --profile development --platform android
```

**Production Build:**
```bash
eas build --profile production --platform android
```

Then install the APK on your device.

## 📱 What You'll Get

### With Voice Input (Dev/Production Build)
```
┌─────────────────────────────┐
│    🇮🇳 മലയാളം ▼            │ ← Language selector
│                             │
│        ┌─────┐              │
│        │ 🎤  │              │ ← Microphone button
│        └─────┘              │
│                             │
│  Tap mic to speak in        │
│  Malayalam                  │
└─────────────────────────────┘
```

### Without Voice Input (Expo Go)
```
┌─────────────────────────────┐
│                             │
│  ┌──────────────────┐       │
│  │ Type here...     │       │ ← Only text input
│  └──────────────────┘       │
│                             │
└─────────────────────────────┘
```

## 🎯 Current Status

### In Expo Go (Current)
- ❌ Voice input hidden
- ✅ Text input works
- ✅ All other features work
- ✅ Chat, AI responses, TTS work

### In Development Build
- ✅ Voice input visible and working
- ✅ Language selector (Malayalam, English, Arabic)
- ✅ Real-time transcription
- ✅ All features work

## 🔧 Quick Build Command

To test voice input right now:

```bash
# Make sure you have Android Studio installed
# Connect your Android device or start emulator
npx expo run:android
```

Wait 5-10 minutes for first build, then the app will open with voice input enabled!

## 📝 Why This Limitation?

Voice input uses `@react-native-voice/voice`, a native module that requires:
- Native Android/iOS code compilation
- Custom permissions (microphone access)
- Platform-specific implementations

These cannot be included in the generic Expo Go app, which is pre-built.

## ✅ What Works in Expo Go

Everything except voice input:
- ✅ Chat interface
- ✅ Text input
- ✅ AI responses (Gemini)
- ✅ Text-to-speech (🔊 Listen button)
- ✅ Authentication (Email + Google OAuth)
- ✅ Chat history
- ✅ Profile settings
- ✅ Sidebar navigation
- ✅ All UI features

## 🎓 Recommended Workflow

### During Development
1. Use Expo Go for quick UI/logic testing
2. Voice button will be hidden - this is normal
3. Test with text input

### When Testing Voice
1. Run `npx expo run:android`
2. Test voice input thoroughly
3. Test language switching
4. Test on real device for best results

### For Production
1. Build with EAS: `eas build --profile production`
2. Test on multiple devices
3. Submit to app stores
4. Users get full voice experience

## 🚀 Next Steps

1. **Continue developing in Expo Go** - All features except voice work
2. **When ready to test voice** - Run `npx expo run:android`
3. **For production** - Build with EAS and submit to stores

The voice input feature is fully implemented and will work beautifully once you create a build!
