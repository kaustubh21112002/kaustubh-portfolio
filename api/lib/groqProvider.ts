// Serverless Groq Chat Completions Provider Adapter
// Strictly server-only: Reads credentials and model configuration exclusively from process.env.
// Never exposes credentials, never enables tools, and throws structured, sanitized provider errors.

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface GroqProviderOptions {
  temperature?: number;
  max_tokens?: number;
}

export type ProviderErrorCategory =
  | 'AUTHENTICATION_ERROR'
  | 'MODEL_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'INVALID_REQUEST'
  | 'PROVIDER_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'MISSING_CONFIGURATION'
  | 'UNKNOWN_PROVIDER_ERROR';

export class GroqProviderError extends Error {
  public readonly category: ProviderErrorCategory;
  public readonly status?: number;
  public readonly isRetryable: boolean;

  constructor(category: ProviderErrorCategory, message: string, status?: number, isRetryable = false) {
    super(message);
    this.name = 'GroqProviderError';
    this.category = category;
    this.status = status;
    this.isRetryable = isRetryable;
  }
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

export function classifyProviderError(status?: number, rawError?: any): { category: ProviderErrorCategory; isRetryable: boolean } {
  if (typeof status === 'number') {
    if (status === 401 || status === 403) {
      return { category: 'AUTHENTICATION_ERROR', isRetryable: false };
    }
    if (status === 404) {
      return { category: 'MODEL_UNAVAILABLE', isRetryable: false };
    }
    if (status === 429) {
      return { category: 'RATE_LIMITED', isRetryable: true };
    }
    if (status >= 400 && status < 500) {
      return { category: 'INVALID_REQUEST', isRetryable: false };
    }
    if (status >= 500) {
      return { category: 'PROVIDER_SERVER_ERROR', isRetryable: true };
    }
  }

  if (rawError) {
    if (rawError.name === 'AbortError' || rawError.name === 'TimeoutError' || rawError.code === 'ETIMEDOUT') {
      return { category: 'TIMEOUT', isRetryable: true };
    }
    if (rawError instanceof TypeError || rawError.code === 'ECONNRESET' || rawError.code === 'ECONNREFUSED' || rawError.code === 'ENOTFOUND') {
      return { category: 'NETWORK_ERROR', isRetryable: true };
    }
  }

  return { category: 'UNKNOWN_PROVIDER_ERROR', isRetryable: false };
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  options: GroqProviderOptions = {}
): Promise<string> {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) {
    throw new GroqProviderError(
      'MISSING_CONFIGURATION',
      'AI provider configuration error: AI_API_KEY environment variable is missing or empty.'
    );
  }

  const model = process.env.AI_MODEL?.trim();
  if (!model) {
    throw new GroqProviderError(
      'MISSING_CONFIGURATION',
      'AI provider configuration error: AI_MODEL environment variable is missing or empty.'
    );
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
  } catch (networkError: any) {
    const { category, isRetryable } = classifyProviderError(undefined, networkError);
    throw new GroqProviderError(category, 'AI provider connection error: Unable to reach AI provider API.', undefined, isRetryable);
  }

  if (!response.ok) {
    const { category, isRetryable } = classifyProviderError(response.status);
    throw new GroqProviderError(
      category,
      `AI provider error: Received HTTP status ${response.status} from provider.`,
      response.status,
      isRetryable
    );
  }

  let data: GroqChatCompletionResponse;
  try {
    data = (await response.json()) as GroqChatCompletionResponse;
  } catch (_jsonError) {
    throw new GroqProviderError(
      'UNKNOWN_PROVIDER_ERROR',
      'AI provider response error: Failed to parse provider response.',
      response.status,
      false
    );
  }

  const assistantMessage = data.choices?.[0]?.message?.content;
  if (typeof assistantMessage !== 'string' || !assistantMessage.trim()) {
    throw new GroqProviderError(
      'UNKNOWN_PROVIDER_ERROR',
      'AI provider response error: Assistant message content is missing or empty.',
      response.status,
      false
    );
  }

  return assistantMessage.trim();
}
