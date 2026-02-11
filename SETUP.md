# AI Usthad Mobile - Setup Guide

Complete setup instructions for the AI Usthad mobile application.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/

2. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **Development Environment**
   - **iOS**: Xcode (Mac only) or Expo Go app
   - **Android**: Android Studio or Expo Go app

4. **Accounts**
   - Supabase account (https://supabase.com)
   - Google Cloud account for Gemini API (https://makersuite.google.com/app/apikey)

## Step 1: Install Dependencies

```bash
cd aiustad-mobile
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Get your Supabase credentials:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings > API
   - Copy the URL and anon/public key

3. Get your Gemini API key:
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy the key

4. Update `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 3: Verify Supabase Database

Ensure your Supabase database has these tables:

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### chat_sessions
```sql
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### chat_messages
```sql
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  text TEXT NOT NULL,
  sources JSONB,
  is_from_document BOOLEAN DEFAULT FALSE,
  is_not_in_document BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 4: Run the App

### Option A: Using Expo Go (Easiest)

1. Install Expo Go on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Start the development server:
```bash
npm start
```

3. Scan the QR code:
   - iOS: Use Camera app
   - Android: Use Expo Go app

### Option B: Using Simulators/Emulators

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

## Step 5: Test the App

1. **Landing Page**: Should show the AI Usthad branding
2. **Sign Up**: Create a new account
3. **Login**: Sign in with your credentials
4. **Chat**: Start a conversation with AI Usthad
5. **Chat History**: View and manage your conversations

## Troubleshooting

### Issue: "Unable to resolve module"
```bash
npx expo start --clear
```

### Issue: Metro bundler not starting
```bash
rm -rf node_modules
npm install
npm start
```

### Issue: iOS build fails
```bash
cd ios
pod install
cd ..
npm run ios
```

### Issue: Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: Supabase connection fails
- Check your `.env` file has correct credentials
- Verify Supabase project is active
- Check network connection

### Issue: Gemini API errors
- Verify API key is correct
- Check API quota limits
- Ensure billing is enabled (if required)

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

5. Build for Android:
```bash
eas build --platform android
```

### Local Builds

**iOS (Mac only):**
```bash
npx expo run:ios --configuration Release
```

**Android:**
```bash
npx expo run:android --variant release
```

## Deployment

### iOS App Store

1. Build with EAS:
```bash
eas build --platform ios
```

2. Submit to App Store:
```bash
eas submit --platform ios
```

### Google Play Store

1. Build with EAS:
```bash
eas build --platform android
```

2. Submit to Play Store:
```bash
eas submit --platform android
```

## Environment-Specific Configurations

### Development
- Uses Expo Go
- Hot reloading enabled
- Debug mode

### Preview
- Internal distribution
- APK for Android
- TestFlight for iOS

### Production
- Optimized builds
- Auto-increment version
- Store-ready

## Security Notes

1. **Never commit `.env` file** to version control
2. **Rotate API keys** regularly
3. **Use Row Level Security** in Supabase
4. **Enable 2FA** on all accounts
5. **Review permissions** before publishing

## Support

For issues or questions:
- Check the main README.md
- Review Expo documentation: https://docs.expo.dev/
- Contact the development team

## Next Steps

After successful setup:
1. Customize the app icon and splash screen
2. Add push notifications
3. Implement voice input
4. Add document upload feature
5. Enable offline mode
6. Add analytics

---

Developed by Students of Islamic Da'wa Academy, Akode
Lead Developer: Hafiz Midlaj
