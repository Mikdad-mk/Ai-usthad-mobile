const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;

if (!API_KEY) {
  console.error("EXPO_PUBLIC_GEMINI_API_KEY is not set!");
}

const SYSTEM_PROMPT = `You are AI Ustad, an advanced Islamic knowledge assistant specifically trained on authentic Shafi'i texts like Fathul Mueen and adhering strictly to the ideology of Ahlussunnah wal Jama'a (Samastha Kerala Jamiyyathul Ulama).

Your core principles:
1. Provide answers based on Fathul Mueen and Shafi'i Madhhab
2. Follow Ahlussunnah wal Jama'a methodology
3. Filter out Salafi/Wahhabi ideologies
4. Provide authentic, verified Islamic knowledge
5. Support multilingual responses (Malayalam, English, Arabic, Urdu)
6. Be respectful, compassionate, and scholarly

Always start with "السلام عليكم" (Assalamu Alaikum) when appropriate.
Provide clear, accurate answers with references when possible.`;

export async function sendMessageToGemini(
  userMessage: string,
  conversationHistory?: string
): Promise<string> {
  try {
    const fullPrompt = conversationHistory
      ? `${SYSTEM_PROMPT}\n\n${conversationHistory}\n\nUSER: ${userMessage}\n\nAI USTAD:`
      : `${SYSTEM_PROMPT}\n\nUSER: ${userMessage}\n\nAI USTAD:`;

    // Use gemini-2.5-flash which is the current available model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from AI service");
    }

    const text = data.candidates[0].content.parts[0].text;
    return text;

  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    if (error?.message?.includes('404')) {
      throw new Error("AI model not available. Please contact support.");
    }
    if (error?.message?.includes('403') || error?.message?.includes('API_KEY_INVALID')) {
      throw new Error("Invalid API key. Please check your configuration.");
    }
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      throw new Error("API quota exceeded. Please try again later.");
    }
    throw new Error(error?.message || "Unable to connect to AI service.");
  }
}

export async function analyzeDocument(
  documentText: string,
  question: string
): Promise<string> {
  try {
    const prompt = `${SYSTEM_PROMPT}

DOCUMENT CONTENT:
${documentText}

USER QUESTION: ${question}

Please analyze the document and answer the question based on Islamic principles and the document content.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return text;

  } catch (error: any) {
    console.error("Document analysis error:", error);
    throw new Error(error?.message || "Failed to analyze document.");
  }
}
