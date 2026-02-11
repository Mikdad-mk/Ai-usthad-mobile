import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useCallback } from "react";
import { useVoiceSpeech } from "../hooks/useVoiceSpeech";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  isLoading: boolean;
  locale?: string;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  isLoading,
  locale = "ml-IN",
  disabled = false,
}: VoiceInputButtonProps) {
  const handleError = useCallback((error: string) => {
    Alert.alert("Voice Input Error", error);
  }, []);

  const { isListening, isSupported, partialText, toggle } = useVoiceSpeech({
    onTranscript,
    onError: handleError,
    enabled: !isLoading && !disabled,
    locale,
  });

  if (!isSupported) {
    return null;
  }

  return (
    <View className="flex items-center gap-2">
      <TouchableOpacity
        onPress={toggle}
        disabled={isLoading || disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
          isListening
            ? "bg-red-500 border-red-600"
            : "bg-amber-100 border-amber-300"
        } ${(isLoading || disabled) && "opacity-50"}`}
        style={{
          shadowColor: isListening ? "#ef4444" : "#d97706",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {isListening ? (
          <Text className="text-3xl">⏹</Text>
        ) : (
          <Text className="text-3xl">🎤</Text>
        )}
      </TouchableOpacity>

      {/* Status text */}
      <View className="h-6 items-center justify-center min-w-[120px]">
        {isListening && (
          <Text className="text-xs font-medium text-amber-600 text-center">
            {partialText ? (
              <Text className="text-slate-800">
                🗣️ {partialText.substring(0, 40)}
                {partialText.length > 40 && "..."}
              </Text>
            ) : (
              "🎤 Listening..."
            )}
          </Text>
        )}
        {!isListening && !isLoading && (
          <Text className="text-xs text-slate-400 text-center">
            Tap mic to speak
          </Text>
        )}
      </View>
    </View>
  );
}
