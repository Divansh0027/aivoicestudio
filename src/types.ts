export type VoiceType = 'cloned' | 'designed' | 'auto';

export interface VoiceAttributes {
  gender?: string;
  age?: string;
  pitch?: string;
  style?: string;
  englishAccent?: string;
  chineseDialect?: string;
}

export interface Voice {
  id: string;
  name: string;
  type: VoiceType;
  language: string;
  createdAt: number;
  lastUsedAt: number;
  attributes?: VoiceAttributes;
}

export interface GenerationOptions {
  text: string;
  voiceId: string;
  language: string;
  speed?: number;
  attributes?: VoiceAttributes;
}

export interface GenerationResult {
  id: string;
  isMock: true;
  status: 'queued' | 'processing' | 'completed' | 'error';
  audioUrl?: string;
  duration?: number;
  createdAt: number;
}
