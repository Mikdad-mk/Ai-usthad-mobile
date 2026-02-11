export default {
  expo: {
    name: "AI Usthad",
    slug: "aiustad-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    splash: {
      backgroundColor: "#fbf9f6",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aiustad.mobile",
      infoPlist: {
        NSMicrophoneUsageDescription: "AI Ustad needs access to your microphone for voice input in Malayalam and other languages.",
        NSSpeechRecognitionUsageDescription: "AI Ustad needs access to speech recognition to convert your voice to text."
      }
    },
    android: {
      package: "com.aiustad.mobile",
      permissions: [
        "RECORD_AUDIO",
        "INTERNET"
      ]
    },
    plugins: ["expo-router"],
    scheme: "aiustad",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "1ad440d8-9a7c-4a67-9d9a-de199de881a2",
      },
    },
  },
};
