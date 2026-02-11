import { useState, useEffect, useCallback, useRef } from "react";
import Voice from "@react-native-voice/voice";
import { Platform } from "react-native";

interface UseVoiceSpeechProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
  locale?: string;
}

interface UseVoiceSpeechReturn {
  isListening: boolean;
  isSupported: boolean;
  partialText: string;
  toggle: () => void;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function useVoiceSpeech({
  onTranscript,
  onError,
  enabled = true,
  locale = "ml-IN",
}: UseVoiceSpeechProps): UseVoiceSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [partialText, setPartialText] = useState("");
  const isMounted = useRef(true);

  // Check if speech recognition is available
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        // Check if Voice module is properly linked
        if (!Voice || typeof Voice.isAvailable !== 'function') {
          console.warn("Voice module not available. This feature requires a development build.");
          if (isMounted.current) {
            setIsSupported(false);
          }
          return;
        }

        const available = await Voice.isAvailable();
        if (isMounted.current) {
          // Voice.isAvailable() returns 1 for true, 0 for false on some platforms
          setIsSupported(!!available);
        }
      } catch (error) {
        console.error("Error checking voice availability:", error);
        if (isMounted.current) {
          setIsSupported(false);
        }
      }
    };

    checkAvailability();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Set up voice event listeners
  useEffect(() => {
    if (!Voice || !isSupported) return;

    Voice.onSpeechStart = () => {
      if (isMounted.current) {
        setIsListening(true);
        setPartialText("");
      }
    };

    Voice.onSpeechEnd = () => {
      if (isMounted.current) {
        setIsListening(false);
      }
    };

    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0 && isMounted.current) {
        const transcript = e.value[0];
        setPartialText("");
        onTranscript(transcript);
        setIsListening(false);
      }
    };

    Voice.onSpeechPartialResults = (e) => {
      if (e.value && e.value.length > 0 && isMounted.current) {
        setPartialText(e.value[0]);
      }
    };

    Voice.onSpeechError = (e) => {
      if (isMounted.current) {
        setIsListening(false);
        setPartialText("");
        const errorMessage = e.error?.message || "Speech recognition error";
        onError?.(errorMessage);
      }
    };

    return () => {
      if (Voice && typeof Voice.destroy === 'function') {
        Voice.destroy().then(() => {
          if (Voice.removeAllListeners) {
            Voice.removeAllListeners();
          }
        }).catch(err => console.error("Error cleaning up Voice:", err));
      }
    };
  }, [onTranscript, onError, isSupported]);

  const start = useCallback(async () => {
    if (!enabled || !isSupported || !Voice) return;

    try {
      setPartialText("");
      await Voice.start(locale);
    } catch (error: any) {
      console.error("Error starting voice recognition:", error);
      onError?.(error.message || "Failed to start voice recognition");
      setIsListening(false);
    }
  }, [enabled, isSupported, locale, onError]);

  const stop = useCallback(async () => {
    if (!Voice) return;
    
    try {
      await Voice.stop();
      setIsListening(false);
      setPartialText("");
    } catch (error: any) {
      console.error("Error stopping voice recognition:", error);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (isListening) {
      await stop();
    } else {
      await start();
    }
  }, [isListening, start, stop]);

  return {
    isListening,
    isSupported,
    partialText,
    toggle,
    start,
    stop,
  };
}
