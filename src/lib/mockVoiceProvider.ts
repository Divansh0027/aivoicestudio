/**
 * MOCK PROVIDER — replace with real OmniVoiceInferenceService in a later phase.
 * This file contains purely in-memory data and mock functions for Phase 1.
 */

import { Voice, VoiceType, VoiceAttributes, GenerationOptions, GenerationResult } from '../types';

let mockVoices: Voice[] = [
  {
    id: 'v1',
    name: 'Atlas (Default)',
    type: 'designed',
    language: 'English',
    createdAt: Date.now() - 10000000,
    lastUsedAt: Date.now() - 5000000,
    attributes: {
      gender: 'Male',
      age: 'Middle-aged',
      pitch: 'Low',
      style: 'Professional',
      englishAccent: 'American',
    }
  },
  {
    id: 'v2',
    name: 'Echo (Assistant)',
    type: 'auto',
    language: 'English',
    createdAt: Date.now() - 8000000,
    lastUsedAt: Date.now() - 2000000,
  },
  {
    id: 'v3',
    name: 'My Custom Clone',
    type: 'cloned',
    language: 'English',
    createdAt: Date.now() - 3000000,
    lastUsedAt: Date.now() - 1000000,
  }
];

export const getVoices = async (): Promise<Voice[]> => {
  return [...mockVoices];
};

export const createVoice = async (voice: Omit<Voice, 'id' | 'createdAt' | 'lastUsedAt'>): Promise<Voice> => {
  const newVoice: Voice = {
    ...voice,
    id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
  };
  mockVoices = [newVoice, ...mockVoices];
  return newVoice;
};

export const updateVoice = async (id: string, updates: Partial<Voice>): Promise<Voice> => {
  const index = mockVoices.findIndex(v => v.id === id);
  if (index === -1) throw new Error("Voice not found");
  mockVoices[index] = { ...mockVoices[index], ...updates };
  return mockVoices[index];
};

export const deleteVoice = async (id: string): Promise<void> => {
  mockVoices = mockVoices.filter(v => v.id !== id);
};

export const generateSpeech = async (
  options: GenerationOptions,
  onStatusChange?: (status: 'queued' | 'processing' | 'completed') => void
): Promise<GenerationResult> => {
  
  // Simulate network queue
  if (onStatusChange) onStatusChange('queued');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate OmniVoice inference processing
  if (onStatusChange) onStatusChange('processing');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return a mock result. NO REAL AUDIO IS SYNTHESIZED.
  const result: GenerationResult = {
    id: `gen_${Date.now()}`,
    isMock: true,
    status: 'completed',
    audioUrl: 'mock_audio_reference',
    duration: 4.2, // Fake duration
    createdAt: Date.now()
  };
  
  if (onStatusChange) onStatusChange('completed');
  return result;
};
