import { supabase } from "./supabase";

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: "user" | "model";
  text: string;
  sources?: any[];
  is_from_document?: boolean;
  is_not_in_document?: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function createChatSession(
  userId: string,
  chatId?: string,
  firstMessage?: string
): Promise<ChatSession> {
  const actualChatId =
    !chatId || chatId === "new"
      ? `chat_${Date.now()}_${Math.random().toString(36).substring(7)}`
      : chatId;
  const title = "New Chat";

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      id: actualChatId,
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }

  return data;
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("getChatSessions failed:", error);
    return [];
  }
}

export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("getChatMessages failed:", error);
    return [];
  }
}

export async function saveMessage(
  message: Omit<ChatMessage, "created_at">
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      ...message,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChatSession(chatId: string): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  if (error) throw error;
}

export async function deleteChatSession(chatId: string): Promise<void> {
  const { error } = await supabase.from("chat_sessions").delete().eq("id", chatId);
  if (error) throw error;
}

export function buildConversationContext(
  messages: ChatMessage[],
  maxMessages = 15
): string {
  const recentMessages = messages.slice(-maxMessages);

  if (recentMessages.length === 0) {
    return "";
  }

  const formattedMessages = recentMessages.map((msg, index) => {
    const role = msg.role === "user" ? "USER" : "AI USTAD";
    const messageNum = index + 1;
    return `[Message ${messageNum}] ${role}:\n${msg.text}`;
  });

  return `=== CONVERSATION HISTORY (${recentMessages.length} messages) ===\n\n${formattedMessages.join("\n\n---\n\n")}\n\n=== END OF HISTORY ===`;
}

export async function updateChatTitle(
  chatId: string,
  firstMessage: string
): Promise<void> {
  const title =
    firstMessage.length > 50
      ? firstMessage.substring(0, 47) + "..."
      : firstMessage;

  const { error } = await supabase
    .from("chat_sessions")
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) {
    console.error("Error updating chat title:", error);
    throw error;
  }
}

export async function renameChatSession(
  chatId: string,
  newTitle: string
): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({
      title: newTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) {
    console.error("Error renaming chat session:", error);
    throw error;
  }
}
