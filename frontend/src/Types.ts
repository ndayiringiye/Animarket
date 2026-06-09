// src/types.ts
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: {
    role: 'assistant';
    content: string;
  };
}
