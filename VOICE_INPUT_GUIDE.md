# Voice Input Feature - Malayalam Support

## What's Been Added ✅

### 1. Voice Input with Malayalam Support
- Custom hook `useVoiceSpeech` for React Native voice recognition
- Reusable `VoiceInputButton` component with visual feedback
- Supports Malayalam (ml-IN) as the primary language
- Also supports: English, Arabic, Hindi, Tamil, and Urdu
- Real-time voice-to-text conversion with partial results display

### 2. Text-to-Speech for AI Responses
- Each AI response now has a "🔊 Listen" button
- Tap to hear the response read aloud in Malayalam
- Tap again to stop playback

### 3. Visual Feedback
- Large, centered microphone button (🎤)
- Animated pulse effect during recording
- Real-time partial transcript display ("🗣️ [text]...")
- "Listening..." status indicator
- Red stop button (⏹) during active recording

## How to Use

### Voice Input (Manglish/Malayalam)
1. Open a chat
2. Tap the large microphone button (🎤) above the input field
3. Speak your question in Malayalam or Manglish
4. See your words appear in real-time as you speak
5. The text will automatically populate the input field
6. Review and tap send (↑)

### Listen to Responses
1. After receiving an AI response
2. Tap the "🔊 Listen" button below the message
3. The response will be read aloud
4. Tap "🔊 Stop" to stop playback

## Architecture

### Custom Hook: `useVoiceSpeech`
Located in `hooks/useVoiceSpeech.ts`

**Features:**
- Manages voice recognition lifecycle
- Handles partial and final results
- Error handling with callbacks
- Automatic cleanup on unmount
- Language support configuration

**API:**
```typescript
const { 
  isListening,    // Current recording state
  isSupported,    // Device capability check
  partialText,    // Real-time transcript
  toggle,         // Start/stop recording
  start,          // Start recording
  stop            // Stop recording
} = useVoiceSpeech({
  onTranscript: (text) => {},  // Final transcript callback
  onError: (error) => {},      // Error callback
  enabled: true,               // Enable/disable
  locale: "ml-IN"              // Language code
});
```

### Component: `VoiceInputButton`
Located in `components/VoiceInputButton.tsx`

**Features:**
- Large, accessible button design
- Visual state indicators (idle/listening)
- Real-time partial transcript display
- Status messages
- Disabled state handling

**Props:**
```typescript
interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;  // Callback for final text
  isLoading: boolean;                     // Disable during loading
  locale?: string;                        // Language (default: ml-IN)
  disabled?: boolean;                     // Manual disable
}
```

## Technical Details

### Packages Used
- `@react-native-voice/voice` - Speech recognition
- `expo-speech` - Text-to-speech

### Supported Languages
- Malayalam (ml-IN) - Primary
- English (en-US)
- Arabic (ar-SA)
- Hindi (hi-IN)
- Tamil (ta-IN)
- Urdu (ur-PK)

### Permissions Required
**Android:**
- RECORD_AUDIO - For microphone access (already configured)
- INTERNET - For speech recognition API

**iOS:**
- NSMicrophoneUsageDescription - Microphone permission
- NSSpeechRecognitionUsageDescription - Speech recognition permission

## Files Structure

```
hooks/
  └── useVoiceSpeech.ts          # Voice recognition hook
components/
  └── VoiceInputButton.tsx       # Voice input UI component
lib/
  └── voice-service.ts           # Voice utilities (TTS)
app/
  └── chat.tsx                   # Chat page with voice integration
```

## Implementation Details

### Voice Recognition Flow
1. User taps microphone button
2. Hook checks device support
3. Starts voice recognition with specified locale
4. Displays partial results in real-time
5. On speech end, returns final transcript
6. Transcript populates input field
7. User can edit before sending

### Error Handling
- Device compatibility check
- Permission denied alerts
- Network error handling
- Graceful fallback to text input

## Testing

### On Android
1. Run `npx expo start` and scan QR code
2. Grant microphone permission when prompted
3. Tap microphone button
4. Speak in Malayalam: "എനിക്ക് സഹായം വേണം"
5. Watch real-time transcript appear
6. Text should populate input field
7. Test text-to-speech on AI response

### On iOS
1. Run `npx expo start` and scan QR code
2. Grant microphone and speech recognition permissions
3. Follow same testing steps as Android

## Advantages Over Web Implementation

1. **Native Performance**: Uses native speech recognition APIs
2. **Better Accuracy**: Platform-optimized recognition
3. **Offline Capability**: Some devices support offline recognition
4. **Partial Results**: Real-time feedback as you speak
5. **Better Error Handling**: Native error states
6. **Cleaner Architecture**: Reusable hook and component

## Notes

### Voice Recognition
- Requires active internet connection (most devices)
- First use requests microphone permissions
- Accuracy depends on:
  - Clear pronunciation
  - Minimal background noise
  - Good internet connection
  - Device microphone quality

### Malayalam Support
- Works best with standard Malayalam pronunciation
- Manglish (Malayalam in English letters) requires English locale
- Some devices may have better Malayalam support than others

### Text-to-Speech
- Malayalam TTS quality varies by device
- Android: Uses Google TTS engine
- iOS: Uses Apple's TTS engine
- Ensure device has Malayalam language pack installed

## Troubleshooting

### Voice input not working?
1. Check microphone permissions in device settings
2. Ensure internet connection is active
3. Try speaking more clearly
4. Check if device supports speech recognition
5. Restart the app

### No partial results showing?
- Some devices don't support partial results
- Final transcript will still work
- This is a device limitation, not an app issue

### Text-to-speech not working?
1. Check device volume
2. Ensure TTS engine is installed (Android)
3. Download Malayalam language pack if needed
4. Try a different language to test TTS functionality

### Button not appearing?
- Device doesn't support speech recognition
- Check console for error messages
- Try on a different device

## Future Enhancements

Potential improvements:
- Language selector UI
- Voice command shortcuts
- Continuous listening mode
- Custom wake word
- Voice activity detection
- Noise cancellation
- Multiple language support in single session

