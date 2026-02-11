import { View, Text, TouchableOpacity, Modal, Alert, Linking } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { useFonts, AnekMalayalam_400Regular, AnekMalayalam_600SemiBold, AnekMalayalam_700Bold } from "@expo-google-fonts/anek-malayalam";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  // Load font
  const [fontsLoaded] = useFonts({
    AnekMalayalam_400Regular,
    AnekMalayalam_600SemiBold,
    AnekMalayalam_700Bold,
  });

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          onClose();
          router.replace("/");
        },
      },
    ]);
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "For support, please contact:\n\nEmail: support@aiustad.app\n\nOr visit our website for FAQs and documentation.",
      [{ text: "OK" }]
    );
  };

  const handleReview = () => {
    Alert.alert(
      "Rate AI Ustad",
      "Would you like to rate our app on the store?",
      [
        { text: "Later", style: "cancel" },
        {
          text: "Rate Now",
          onPress: () => {
            // Open app store link
            // For Android: market://details?id=com.aiustad.mobile
            // For iOS: itms-apps://itunes.apple.com/app/idXXXXXXXXX
            Alert.alert("Thank you!", "Store link will be available after app release.");
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      "Settings",
      "Settings page coming soon!\n\nYou'll be able to:\n• Change language preferences\n• Manage notifications\n• Update profile\n• Privacy settings",
      [{ text: "OK" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white rounded-3xl w-11/12 max-w-md overflow-hidden">
          {/* Header */}
          <View className="bg-amber-50 p-6 items-center border-b border-amber-100">
            <View className="w-20 h-20 rounded-full bg-amber-200 items-center justify-center mb-3">
              <Text className="text-3xl text-amber-700 font-bold" style={{ fontFamily: "AnekMalayalam_700Bold" }}>
                {profile?.initials || profile?.name?.substring(0, 2).toUpperCase() || "AU"}
              </Text>
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "AnekMalayalam_700Bold" }}>
              {profile?.name || "User"}
            </Text>
            <Text className="text-sm text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
              {profile?.email}
            </Text>
          </View>

          {/* Menu Items */}
          <View className="p-4">
            {/* Settings */}
            <TouchableOpacity
              onPress={handleSettings}
              className="flex-row items-center p-4 bg-slate-50 rounded-xl mb-3"
            >
              <Text className="text-2xl mr-4">⚙️</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  Settings
                </Text>
                <Text className="text-xs text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  Preferences and privacy
                </Text>
              </View>
              <Text className="text-slate-400">→</Text>
            </TouchableOpacity>

            {/* Help */}
            <TouchableOpacity
              onPress={handleHelp}
              className="flex-row items-center p-4 bg-slate-50 rounded-xl mb-3"
            >
              <Text className="text-2xl mr-4">❓</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  Help & Support
                </Text>
                <Text className="text-xs text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  Get help and contact us
                </Text>
              </View>
              <Text className="text-slate-400">→</Text>
            </TouchableOpacity>

            {/* Review */}
            <TouchableOpacity
              onPress={handleReview}
              className="flex-row items-center p-4 bg-slate-50 rounded-xl mb-3"
            >
              <Text className="text-2xl mr-4">⭐</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  Rate AI Ustad
                </Text>
                <Text className="text-xs text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  Share your feedback
                </Text>
              </View>
              <Text className="text-slate-400">→</Text>
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity
              onPress={handleSignOut}
              className="flex-row items-center p-4 bg-red-50 rounded-xl mb-3"
            >
              <Text className="text-2xl mr-4">🚪</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-red-600" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  Sign Out
                </Text>
                <Text className="text-xs text-red-400" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  Log out of your account
                </Text>
              </View>
              <Text className="text-red-400">→</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <View className="p-4 border-t border-slate-100">
            <TouchableOpacity
              onPress={onClose}
              className="bg-slate-100 rounded-xl py-3"
            >
              <Text className="text-center text-slate-700 font-semibold" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          {/* Version */}
          <View className="pb-4 items-center">
            <Text className="text-xs text-slate-400" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
              AI Ustad v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
