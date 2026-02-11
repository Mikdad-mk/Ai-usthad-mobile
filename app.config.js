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
    },
    android: {
      package: "com.aiustad.mobile",
    },
    plugins: ["expo-router"],
    scheme: "aiustad",
    extra: {
      eas: {
        projectId: "1ad440d8-9a7c-4a67-9d9a-de199de881a2",
      },
    },
  },
};
