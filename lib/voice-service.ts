import * as Speech from "expo-speech";
import Voice from "@react-native-voice/voice";

// Voice recognition using React Native Voice
let recognitionCallbacks: {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
} = {};

Voice.onSpeechResults = (e: any) => {
  if (e.value && e.value.length > 0) {
    recognitionCallbacks.onResult?.(e.value[0]);
  }
};

Voice.onSpeechError = (e: any) => {
  recognitionCallbacks.onError?.(e.error?.message || "Speech recognition error");
};

export const startVoiceRecognition = async (
  language: string = "ml-IN" // Malayalam India
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if speech recognition is available
      const available = await Voice.isAvailable();
      if (!available) {
        reject(new Error("Speech recognition not available on this device"));
        return;
      }

      recognitionCallbacks = {
        onResult: (text) => {
          Voice.stop();
          resolve(text);
        },
        onError: (error) => {
          Voice.stop();
          reject(new Error(error));
        },
      };

      await Voice.start(language);
    } catch (error: any) {
      reject(error);
    }
  });
};

export const stopVoiceRecognition = async () => {
  try {
    await Voice.stop();
    await Voice.destroy();
  } catch (error) {
    console.error("Error stopping voice recognition:", error);
  }
};

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
