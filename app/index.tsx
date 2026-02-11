import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect to chat
      router.replace("/chat?new=true");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#fbf9f6] items-center justify-center">
        <ActivityIndicator size="large" color="#d97706" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#fbf9f6]">
      {/* Hero Section */}
      <View className="px-6 pt-16 pb-12">
        {/* Logo */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full border-2 border-amber-200 overflow-hidden mb-4">
            <Image
              source={{ uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-2xl font-bold text-amber-700">AI USTHAD</Text>
        </View>

        {/* Badge */}
        <View className="self-center mb-6 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
          <Text className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            ✨ Scholar Intelligence V2.5
          </Text>
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-slate-900 text-center mb-4 leading-tight">
          Your Intelligent{"\n"}
          <Text className="text-amber-600">Islamic Scholar</Text>
        </Text>

        {/* Description */}
        <Text className="text-base text-slate-600 text-center leading-relaxed mb-8 px-4">
          AI Ustad delivers authentic Islamic knowledge rooted in the principles of{" "}
          <Text className="font-semibold text-amber-800">Ahlussunnah wal Jama'a</Text>.
          Trained on the authoritative text of{" "}
          <Text className="italic text-slate-800">Fathul Mueen</Text>.
        </Text>

        {/* CTA Buttons */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="bg-slate-900 rounded-full py-4 px-8 shadow-lg"
          >
            <Text className="text-white text-center font-semibold text-base">
              💬 Start Asking Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-white border border-slate-200 rounded-full py-4 px-8"
          >
            <Text className="text-slate-700 text-center font-semibold text-base">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <View className="flex-row justify-center gap-6 mb-12">
          <View className="flex-row items-center gap-2">
            <Text className="text-green-500">✓</Text>
            <Text className="text-xs text-slate-500 font-medium">Verified Sources</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-500">✓</Text>
            <Text className="text-xs text-slate-500 font-medium">Ahlussunnah Compliant</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="bg-white py-12 px-6">
        <Text className="text-2xl font-bold text-slate-900 text-center mb-3">
          Scholarly Depth, Modern Accessibility
        </Text>
        <Text className="text-slate-600 text-center mb-8">
          Bridging traditional Islamic scholarship and AI
        </Text>

        {/* Feature Cards */}
        <View className="gap-6">
          <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <View className="w-12 h-12 bg-white rounded-2xl border border-slate-200 items-center justify-center mb-4">
              <Text className="text-2xl">📜</Text>
            </View>
            <Text className="text-lg font-bold text-slate-900 mb-2">Kitab-Based Reasoning</Text>
            <Text className="text-sm text-slate-600 leading-relaxed">
              Grounded in <Text className="font-semibold text-amber-700">Fathul Mueen</Text>, ensuring answers adhere to the Shafi'i madhhab.
            </Text>
          </View>

          <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <View className="w-12 h-12 bg-white rounded-2xl border border-slate-200 items-center justify-center mb-4">
              <Text className="text-2xl">🎤</Text>
            </View>
            <Text className="text-lg font-bold text-slate-900 mb-2">Natural Interaction</Text>
            <Text className="text-sm text-slate-600 leading-relaxed">
              Ask questions using your voice or text. Experience fluid conversations.
            </Text>
          </View>

          <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <View className="w-12 h-12 bg-white rounded-2xl border border-slate-200 items-center justify-center mb-4">
              <Text className="text-2xl">🛡️</Text>
            </View>
            <Text className="text-lg font-bold text-slate-900 mb-2">Verified Methodology</Text>
            <Text className="text-sm text-slate-600 leading-relaxed">
              Built on <Text className="font-semibold text-amber-700">Ahlussunnah wal Jama'a</Text> methodology.
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View className="px-6 py-12">
        <LinearGradient
          colors={["#0f172a", "#1e293b"]}
          className="rounded-[2.5rem] px-8 py-12"
        >
          <Text className="text-3xl font-bold text-white text-center mb-4">
            Ready to seek knowledge?
          </Text>
          <Text className="text-slate-300 text-center mb-8 leading-relaxed">
            Join thousands trusting AI Ustad for daily Islamic queries. Accurate, Private, 24/7.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="bg-amber-600 rounded-full py-4 px-8 mb-4"
          >
            <Text className="text-white text-center font-bold text-base">
              Create Free Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-transparent border border-slate-600 rounded-full py-4 px-8"
          >
            <Text className="text-white text-center font-bold text-base">
              Login
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Footer */}
      <View className="bg-white border-t border-slate-100 py-8 px-6">
        <View className="items-center mb-4">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden">
              <Image
                source={{ uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="font-semibold text-slate-900">AI USTHAD</Text>
          </View>
          <Text className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI Ustad. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
