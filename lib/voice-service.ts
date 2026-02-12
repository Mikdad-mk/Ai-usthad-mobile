import * as Speech from "expo-speech";

// Text to speech
export const speakText = async (
  text: string,
  language: string = "ml-IN"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.9,
      onDone: () => resolve(),
      onError: (error) => reject(error),
    });
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};

export const isSpeakingAsync = async (): Promise<boolean> => {
  return await Speech.isSpeakingAsync();
};

// Available languages for voice input
export const VOICE_LANGUAGES = {
  MALAYALAM: "ml-IN",
  ENGLISH: "en-US",
  ARABIC: "ar-SA",
  HINDI: "hi-IN",
  TAMIL: "ta-IN",
  URDU: "ur-PK",
};

// Language display names
export const LANGUAGE_NAMES: Record<string, string> = {
  "ml-IN": "Malayalam",
  "en-US": "English",
  "ar-SA": "Arabic",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "ur-PK": "Urdu",
};
