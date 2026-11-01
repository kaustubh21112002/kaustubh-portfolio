// Serverless Groq Chat Completions Provider Adapter
// Strictly server-only: Reads credentials and model configuration exclusively from process.env.
// Never exposes credentials, never enables tools, and throws sanitized errors.

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface GroqProviderOptions {
  temperature?: number;
  max_tokens?: number;
}

interface GroqChatCompletionChoice {
  message?: {
    role?: string;
    content?: string;
  };
}

interface GroqChatCompletionResponse {
  choices?: GroqChatCompletionChoice[];
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  options: GroqProviderOptions = {}
): Promise<string> {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('AI provider configuration error: AI_API_KEY environment variable is missing or empty.');
  }

  const model = process.env.AI_MODEL?.trim();
  if (!model) {
    throw new Error('AI provider configuration error: AI_MODEL environment variable is missing or empty.');
  }

  const requestBody: {
    model: string;
    messages: ChatMessage[];
    tool_choice: 'none';
    stream: false;
    temperature?: number;
    max_tokens?: number;
  } = {
    model,
    messages,
    tool_choice: 'none',
    stream: false
  };

  if (typeof options.temperature === 'number') {
    requestBody.temperature = options.temperature;
  }
  if (typeof options.max_tokens === 'number') {
    requestBody.max_tokens = options.max_tokens;
  }

  let response: Response;
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  } catch (_networkError) {
    throw new Error('AI provider connection error: Unable to reach AI provider API.');
  }

  if (!response.ok) {
    throw new Error(`AI provider error: Received HTTP status ${response.status} from provider.`);
  }

  let data: GroqChatCompletionResponse;
  try {
    data = (await response.json()) as GroqChatCompletionResponse;
  } catch (_jsonError) {
    throw new Error('AI provider response error: Failed to parse provider response.');
  }

  const assistantMessage = data.choices?.[0]?.message?.content;
  if (typeof assistantMessage !== 'string' || !assistantMessage.trim()) {
    throw new Error('AI provider response error: Assistant message content is missing or empty.');
  }

  return assistantMessage.trim();
}

