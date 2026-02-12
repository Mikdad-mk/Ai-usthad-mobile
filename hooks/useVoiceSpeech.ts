import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isSupported, setIsSupported] = useState(false); // Always false since we removed voice
  const [partialText, setPartialText] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const start = useCallback(async () => {
    // Voice not supported in this build
    onError?.("Voice input not available in this build");
  }, [onError]);

  const stop = useCallback(async () => {
    setIsListening(false);
    setPartialText("");
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
