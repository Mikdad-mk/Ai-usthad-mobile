# Google OAuth Setup Guide

## What's Been Fixed

### 1. Reloading Issue After Login ✅
- Fixed the AuthContext to prevent multiple re-renders
- Added proper cleanup and mounted state checks
- The app will now navigate directly to /chats after login without reloading

### 2. Google Sign-In Integration ✅
- Added Google OAuth support using Supabase
- Integrated expo-web-browser and expo-linking for OAuth flow
- Added Google Sign-In buttons to both login and signup pages
- Environment variables are already configured in .env

## Supabase Configuration Required

To enable Google Sign-In, you need to configure it in your Supabase dashboard:

### Step 1: Get Your Redirect URL
Your app's redirect URL is: `aiustad://`

### Step 2: Configure Supabase
1. Go to https://supabase.com/dashboard
2. Select your project: `oveqfjmzmbcexsgfoqvb`
3. Navigate to: Authentication → Providers
4. Find "Google" and click to configure
5. Enable the Google provider
6. Add your Google OAuth credentials:
   - Client ID (Android): `876165817486-f993k5089fic03afa56169n9rklfj096.apps.googleusercontent.com`
   - Client ID (iOS): `876165817486-8esfel6303l75tej4ba2e554ig1fbpi6.apps.googleusercontent.com`
   - Client ID (Web): `876165817486-tcobjm5pgocnhb97rhc0rvtnpnm5pbs8.apps.googleusercontent.com`
7. Add redirect URL: `aiustad://`
8. Save the configuration

### Step 3: Google Cloud Console Setup
Make sure in your Google Cloud Console project:
1. OAuth consent screen is configured
2. Authorized redirect URIs include:
   - `https://oveqfjmzmbcexsgfoqvb.supabase.co/auth/v1/callback`
   - `aiustad://`

## Testing

After configuration:
1. Run `npx expo start`
2. Open the app on your device/emulator
3. Go to Login or Signup page
4. Click "Continue with Google"
5. Complete the Google sign-in flow
6. You should be redirected to /chats immediately

## Files Modified
- `contexts/AuthContext.tsx` - Fixed reloading issue
- `lib/auth-service.ts` - Added Google OAuth function
- `app/login.tsx` - Added Google Sign-In button
- `app/signup.tsx` - Added Google Sign-In button
- Installed: `expo-web-browser`, `expo-linking`
