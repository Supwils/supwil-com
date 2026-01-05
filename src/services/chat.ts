export type ChatMessage = {
  id?: number | string;
  sender: string;
  text: string;
  timestamp?: string | number;
  isError?: boolean;
  [key: string]: unknown;
};

export type SendChatOptions = Record<string, unknown>;

type ChatApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function sendChat(
  messages: ChatMessage[],
  options: SendChatOptions = {}
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        options,
      }),
    });

    const data = (await response.json()) as ChatApiResponse;

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to get AI response");
    }

    if (!data.message) {
      throw new Error("Failed to get AI response");
    }

    return data.message;
  } catch (error) {
    console.error("Chat service error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get AI response: ${errorMessage}`);
  }
}

export async function sendChatStream(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  options: SendChatOptions = {}
): Promise<string> {
  const response = await sendChat(messages, options);
  onChunk?.(response);
  return response;
}

export default {
  sendChat,
  sendChatStream,
};
