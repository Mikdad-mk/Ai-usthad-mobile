import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signInUser, signInWithGoogle } from "../lib/auth-service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signInUser(email, password);
      router.replace("/chats");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/chats");
    } catch (error: any) {
      Alert.alert("Google Sign-In Failed", error.message || "Could not sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#fbf9f6]"
    >
      <View className="flex-1 px-6 pt-16 justify-center">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full border-2 border-amber-200 overflow-hidden mb-4">
            <Image
              source={{ uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-2xl font-bold text-amber-700">AI USTHAD</Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</Text>
        <Text className="text-slate-600 mb-8">Sign in to continue your journey</Text>

        {/* Form */}
        <View className="gap-4 mb-6">
          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white border border-slate-200 rounded-2xl px-4 py-4 text-slate-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="bg-white border border-slate-200 rounded-2xl px-4 py-4 text-slate-900"
            />
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading || googleLoading}
          className="bg-slate-900 rounded-full py-4 px-8 mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="mx-4 text-slate-500 text-sm">or</Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="bg-white border border-slate-200 rounded-full py-4 px-8 mb-4 flex-row items-center justify-center"
        >
          {googleLoading ? (
            <ActivityIndicator color="#d97706" />
          ) : (
            <>
              <Text className="text-2xl mr-2">🔍</Text>
              <Text className="text-slate-700 font-semibold text-base">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-slate-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-amber-700 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 items-center"
        >
          <Text className="text-slate-500">← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
