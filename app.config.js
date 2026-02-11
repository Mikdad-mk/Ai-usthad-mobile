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
  },
};
