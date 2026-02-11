import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as Speech from "expo-speech";
import {
  ChatMessage,
  createChatSession,
  getChatMessages,
  saveMessage,
  updateChatSession,
  updateChatTitle,
  buildConversationContext,
} from "../lib/chat-service";
import { sendMessageToGemini } from "../lib/gemini-service";
import { speakText, stopSpeaking, VOICE_LANGUAGES } from "../lib/voice-service";
import { VoiceInputButton } from "../components/VoiceInputButton";

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, loading: authLoading } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(VOICE_LANGUAGES.MALAYALAM);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    } else if (user && !chatId && messages.length === 0) {
      // Only initialize once when user is loaded and chat is not initialized
      initializeChat();
    }
  }, [user, authLoading]); // Remove params from dependencies to prevent infinite loop

  const initializeChat = async () => {
    if (!user) return;

    try {
      const isNewChat = params.new === "true";
      const existingChatId = params.id as string;

      if (isNewChat || !existingChatId) {
        // Don't create chat session yet - wait for first message
        setChatId(null);
        setMessages([
          {
            id: "welcome-temp",
            chat_id: "temp",
            role: "model",
            text: "السلام عليكم! Welcome to AI Ustad. I'm here to help you with authentic Islamic knowledge based on Fathul Mueen and Ahlussunnah wal Jama'a methodology. How can I assist you today?",
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        // Load existing chat
        setChatId(existingChatId);
        const existingMessages = await getChatMessages(existingChatId);
        setMessages(existingMessages);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      Alert.alert("Error", "Failed to initialize chat");
    } finally {
      setInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !user) return;

    const userMessageText = inputText.trim();
    setInputText("");
    
    // Show loading immediately
    setLoading(true);

    try {
      let currentChatId = chatId;

      // Create chat session on first message if it doesn't exist
      if (!currentChatId) {
        const newChat = await createChatSession(user.id);
        currentChatId = newChat.id;
        setChatId(currentChatId);
        
        // Remove the temporary welcome message
        setMessages((prev) => prev.filter((msg) => msg.id !== "welcome-temp"));
      }

      // Create temporary user message to show immediately
      const tempUserMessage: ChatMessage = {
        id: `temp_user_${Date.now()}`,
        chat_id: currentChatId,
        role: "user",
        text: userMessageText,
        created_at: new Date().toISOString(),
      };
      
      // Show user message immediately
      setMessages((prev) => [...prev, tempUserMessage]);
      
      // Scroll to bottom immediately
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);

      // Save user message in background
      const userMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`;
      const userMessage = await saveMessage({
        id: userMessageId,
        chat_id: currentChatId,
        role: "user",
        text: userMessageText,
      });

      // Replace temp message with real one
      setMessages((prev) => 
        prev.map(msg => msg.id === tempUserMessage.id ? userMessage : msg)
      );

      // Update chat title with first message (in background)
      if (messages.length <= 1) {
        updateChatTitle(currentChatId, userMessageText).catch(err => 
          console.error("Error updating title:", err)
        );
      }

      // Build conversation context
      const context = buildConversationContext([...messages, userMessage]);

      // Get AI response
      const aiResponse = await sendMessageToGemini(userMessageText, context);

      // Save AI message
      const aiMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`;
      const aiMessage = await saveMessage({
        id: aiMessageId,
        chat_id: currentChatId,
        role: "model",
        text: aiResponse,
      });

      setMessages((prev) => [...prev, aiMessage]);

      // Update chat session timestamp (in background)
      updateChatSession(currentChatId).catch(err => 
        console.error("Error updating session:", err)
      );

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error("Error sending message:", error);
      Alert.alert("Error", error.message || "Failed to send message");
      
      // Remove the temporary message on error
      setMessages((prev) => prev.filter(msg => !msg.id.startsWith("temp_")));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(transcript);
  };

  const handleSpeakResponse = async (text: string) => {
    try {
      if (isSpeaking) {
        stopSpeaking();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        await speakText(text, selectedLanguage);
        setIsSpeaking(false);
      }
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert("Error", "Could not speak the text");
    }
  };

  if (authLoading || initializing) {
    return (
      <View className="flex-1 bg-[#fbf9f6] items-center justify-center">
        <ActivityIndicator size="large" color="#d97706" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#fbf9f6]"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="bg-white border-b border-slate-100 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Text className="text-slate-600 text-lg">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-full border border-amber-200 overflow-hidden">
              <Image
                source={{ uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-lg font-bold text-amber-700">AI USTHAD</Text>
              <Text className="text-xs text-slate-500">Islamic Scholar</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollViewRef} className="flex-1 px-4 py-6">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            <View
              className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                message.role === "user"
                  ? "bg-amber-600"
                  : "bg-white border border-slate-100"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text
                className={`text-base leading-relaxed ${
                  message.role === "user" ? "text-white" : "text-slate-800"
                }`}
              >
                {message.text}
              </Text>
              {message.role === "model" && (
                <TouchableOpacity
                  onPress={() => handleSpeakResponse(message.text)}
                  className="mt-2 flex-row items-center"
                >
                  <Text className="text-amber-600 text-xs">
                    {isSpeaking ? "🔊 Stop" : "🔊 Listen"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        {loading && (
          <View className="items-start mb-4">
            <View className="bg-white border border-slate-100 rounded-3xl px-5 py-4">
              <ActivityIndicator color="#d97706" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="bg-white border-t border-slate-100 px-4 py-4">
        {/* Voice Input Button - Centered above input */}
        <View className="items-center mb-3">
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            isLoading={loading}
            locale={selectedLanguage}
            disabled={false}
          />
        </View>

        {/* Text Input and Send Button */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask your question..."
              placeholderTextColor="#94a3b8"
              className="text-slate-900 text-base"
              multiline
              maxLength={500}
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            className="w-12 h-12 bg-amber-600 rounded-full items-center justify-center"
            disabled={!inputText.trim() || loading}
            style={{ opacity: !inputText.trim() || loading ? 0.5 : 1 }}
          >
            <Text className="text-white text-xl">↑</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-slate-400 text-center mt-2">
          🎤 {selectedLanguage === VOICE_LANGUAGES.MALAYALAM ? "Malayalam" : "English"} • Powered by Fathul Mueen
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
