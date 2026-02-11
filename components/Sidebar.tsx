import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getChatSessions, deleteChatSession, ChatSession } from "../lib/chat-service";
import { useFonts, AnekMalayalam_400Regular, AnekMalayalam_600SemiBold, AnekMalayalam_700Bold } from "@expo-google-fonts/anek-malayalam";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  currentChatId?: string;
}

export function Sidebar({ visible, onClose, currentChatId }: SidebarProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load font
  const [fontsLoaded] = useFonts({
    AnekMalayalam_400Regular,
    AnekMalayalam_600SemiBold,
    AnekMalayalam_700Bold,
  });

  useEffect(() => {
    if (visible && user) {
      loadChats();
    }
  }, [visible, user]);

  const loadChats = async () => {
    if (!user) return;
    try {
      const sessions = await getChatSessions(user.id);
      const nonEmptyChats = sessions.filter(chat => chat.title !== "New Chat");
      setChats(nonEmptyChats);
      setLoading(false);
    } catch (error) {
      console.error("Error loading chats:", error);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    onClose();
    router.push("/chat?new=true");
  };

  const handleChatSelect = (chatId: string) => {
    onClose();
    router.push(`/chat?id=${chatId}`);
  };

  const handleDeleteChat = async (chatId: string, e: any) => {
    e.stopPropagation();
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChatSession(chatId);
              setChats(chats.filter((c) => c.id !== chatId));
              if (chatId === currentChatId) {
                router.push("/chat?new=true");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete chat");
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row bg-black/50">
        {/* Sidebar */}
        <View className="w-4/5 bg-white h-full">
          {/* Header */}
          <View className="bg-amber-50 pt-12 pb-4 px-4 border-b border-amber-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full border border-amber-200 overflow-hidden">
                  <Image
                    source={{ uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png" }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View>
                  <Text className="text-base font-bold text-amber-700" style={{ fontFamily: "AnekMalayalam_700Bold" }}>
                    AI USTHAD
                  </Text>
                  <Text className="text-xs text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                    {profile?.name || "User"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-3xl text-slate-600 leading-none">×</Text>
              </TouchableOpacity>
            </View>

            {/* New Chat Button */}
            <TouchableOpacity
              onPress={handleNewChat}
              className="bg-amber-600 rounded-full py-3 px-4 flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold mr-2">+</Text>
              <Text className="text-white font-semibold" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                New Chat
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          <ScrollView className="flex-1 px-3 py-4">
            {loading ? (
              <Text className="text-slate-400 text-center py-4" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                Loading...
              </Text>
            ) : chats.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-4xl mb-2">💬</Text>
                <Text className="text-slate-600 text-center" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  No conversations yet
                </Text>
                <Text className="text-slate-400 text-xs text-center mt-2 px-4" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  Start a new chat to ask your Islamic questions
                </Text>
              </View>
            ) : (
              chats.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => handleChatSelect(chat.id)}
                  className={`rounded-xl p-3 mb-2 ${
                    chat.id === currentChatId ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-2">
                      <Text 
                        className={`text-sm font-medium mb-1 ${
                          chat.id === currentChatId ? "text-amber-700" : "text-slate-900"
                        }`}
                        style={{ fontFamily: "AnekMalayalam_600SemiBold" }}
                        numberOfLines={2}
                      >
                        {chat.title}
                      </Text>
                      <Text className="text-xs text-slate-400" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => handleDeleteChat(chat.id, e)}
                      className="p-1"
                    >
                      <Text className="text-base">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Profile Section */}
          <View className="border-t border-slate-100 p-4">
            <View className="flex-row items-center gap-3 bg-slate-50 rounded-xl p-3">
              <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center">
                <Text className="text-amber-700 font-bold" style={{ fontFamily: "AnekMalayalam_700Bold" }}>
                  {profile?.initials || profile?.name?.substring(0, 2).toUpperCase() || "AU"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-900" style={{ fontFamily: "AnekMalayalam_600SemiBold" }}>
                  {profile?.name || "User"}
                </Text>
                <Text className="text-xs text-slate-500" style={{ fontFamily: "AnekMalayalam_400Regular" }}>
                  {profile?.email}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Overlay */}
        <TouchableOpacity 
          className="flex-1 bg-black/50" 
          onPress={onClose}
          activeOpacity={1}
        />
      </View>
    </Modal>
  );
}
