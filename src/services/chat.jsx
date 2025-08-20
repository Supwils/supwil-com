/**
 * Send a chat message to the API and get a response
 * @param {Array} messages - Array of message objects with {sender, text, timestamp}
 * @param {Object} options - Optional parameters for the API call
 * @returns {Promise<string>} - The AI response
 */
export async function sendChat(messages, options = {}) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        options
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to get AI response');
    }

    return data.message;
  } catch (error) {
    console.error('Chat service error:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

/**
 * Send a chat message with streaming response (placeholder for future implementation)
 * @param {Array} messages - Array of message objects
 * @param {Function} onChunk - Callback for each chunk of the response
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} - The complete response
 */
export async function sendChatStream(messages, onChunk, options = {}) {
  // For now, use the regular sendChat function
  // TODO: Implement streaming when needed
  const response = await sendChat(messages, options);
  if (onChunk) {
    onChunk(response);
  }
  return response;
}

export default {
  sendChat,
  sendChatStream
};