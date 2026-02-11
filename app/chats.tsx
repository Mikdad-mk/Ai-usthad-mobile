// @ts-nocheck
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getChatSessions, deleteChatSession, ChatSession } from "../lib/chat-service";

export default function ChatsPage() {
  const router = useRouter();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    } else if (user) {
      loadChats();
    }
  }, [user, authLoading]);

  const loadChats = async () => {
    if (!user) return;
    try {
      const sessions = await getChatSessions(user.id);
      
      // Filter out chats with "New Chat" title (empty chats) - do this quickly
      const nonEmptyChats = sessions.filter(chat => chat.title !== "New Chat");
      
      // Show chats immediately
      setChats(nonEmptyChats);
      setLoading(false);
      
      // Delete empty chats in background (don't wait for this)
      const emptyChats = sessions.filter(chat => chat.title === "New Chat");
      if (emptyChats.length > 0) {
        // Delete in background without blocking UI
        Promise.all(
          emptyChats.map(emptyChat => 
            deleteChatSession(emptyChat.id).catch(err => 
              console.error("Error deleting empty chat:", err)
            )
          )
        );
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
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
            } catch (error) {
              Alert.alert("Error", "Failed to delete chat");
            }
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 bg-[#fbf9f6] items-center justify-center">
        <ActivityIndicator size="large" color="#d97706" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#fbf9f6]">
      {/* Header */}
      <View className="bg-white border-b border-slate-100 pt-12 pb-4 px-6">
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
              <Text className="text-lg font-bold text-amber-700">AI USTHAD</Text>
              <Text className="text-xs text-slate-500">{profile?.name || "User"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignOut}>
            <Text className="text-sm text-slate-600">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          onPress={() => router.push("/chat?new=true")}
          className="bg-amber-600 rounded-full py-3 px-6"
        >
          <Text className="text-white text-center font-semibold">+ New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView className="flex-1 px-4 py-6">
        {chats.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-2xl mb-2">💬</Text>
            <Text className="text-slate-600 text-center">No conversations yet</Text>
            <Text className="text-slate-400 text-sm text-center mt-2">
              Start a new chat to ask your Islamic questions
            </Text>
          </View>
        ) : (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => router.push(`/chat?id=${chat.id}`)}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-slate-900 font-semibold mb-1" numberOfLines={2}>
                    {chat.title}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteChat(chat.id)}
                  className="p-2"
                >
                  <Text className="text-red-500">🗑️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
