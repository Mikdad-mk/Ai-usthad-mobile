import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal } from "react-native";
import { useCallback, useState } from "react";
import { useVoiceSpeech } from "../hooks/useVoiceSpeech";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  isLoading: boolean;
  locale?: string;
  disabled?: boolean;
  onLanguageChange?: (locale: string) => void;
}

const LANGUAGES = [
  { code: "ml-IN", name: "Malayalam", emoji: "🇮🇳", flag: "മലയാളം" },
  { code: "en-US", name: "English", emoji: "🇺🇸", flag: "English" },
  { code: "ar-SA", name: "Arabic", emoji: "🇸🇦", flag: "العربية" },
];

export function VoiceInputButton({
  onTranscript,
  isLoading,
  locale = "ml-IN",
  disabled = false,
  onLanguageChange,
}: VoiceInputButtonProps) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleError = useCallback((error: string) => {
    Alert.alert("Voice Input Error", error);
  }, []);

  const { isListening, isSupported, partialText, toggle } = useVoiceSpeech({
    onTranscript,
    onError: handleError,
    enabled: !isLoading && !disabled,
    locale,
  });

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange?.(languageCode);
    setShowLanguageSelector(false);
  };

  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];

  // Hide button if not supported (Expo Go)
  if (!isSupported) {
    return null;
  }

  return (
    <View className="items-center gap-2">
      {/* Language Selector Modal */}
      <Modal
        visible={showLanguageSelector}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLanguageSelector(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-3xl w-11/12 max-w-sm p-6">
            <Text className="text-xl font-bold text-slate-900 mb-4 text-center">
              Select Voice Language
            </Text>
            
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                className={`flex-row items-center p-4 rounded-xl mb-2 ${
                  lang.code === locale ? "bg-amber-50 border-2 border-amber-300" : "bg-slate-50"
                }`}
              >
                <Text className="text-3xl mr-3">{lang.emoji}</Text>
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${
                    lang.code === locale ? "text-amber-700" : "text-slate-900"
                  }`}>
                    {lang.flag}
                  </Text>
                  <Text className="text-xs text-slate-500">{lang.name}</Text>
                </View>
                {lang.code === locale && (
                  <Text className="text-amber-600 text-xl">✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowLanguageSelector(false)}
              className="bg-slate-100 rounded-xl py-3 mt-4"
            >
              <Text className="text-center text-slate-700 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selector Button */}
      <TouchableOpacity
        onPress={() => setShowLanguageSelector(true)}
        disabled={isListening || isLoading}
        className="flex-row items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"
      >
        <Text className="text-lg">{currentLanguage.emoji}</Text>
        <Text className="text-xs text-slate-600 font-medium">
          {currentLanguage.flag}
        </Text>
        <Text className="text-xs text-slate-400">▼</Text>
      </TouchableOpacity>

      {/* Voice Button */}
      <TouchableOpacity
        onPress={toggle}
        disabled={isLoading || disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
          isListening
            ? "bg-red-500 border-red-600 animate-pulse"
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
          <View className="items-center">
            <View className="w-6 h-6 bg-white rounded-sm" />
          </View>
        ) : (
          <Text className="text-3xl">🎤</Text>
        )}
      </TouchableOpacity>

      {/* Status text */}
      <View className="h-12 items-center justify-center min-w-[200px]">
        {isListening && (
          <View className="items-center">
            <Text className="text-xs font-medium text-red-600 mb-1">
              🎤 Listening...
            </Text>
            {partialText && (
              <Text className="text-sm text-slate-800 text-center px-4" numberOfLines={2}>
                {partialText}
              </Text>
            )}
          </View>
        )}
        {!isListening && !isLoading && (
          <Text className="text-xs text-slate-400 text-center">
            Tap mic to speak in {currentLanguage.name}
          </Text>
        )}
      </View>
    </View>
  );
}
