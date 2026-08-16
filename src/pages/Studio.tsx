import React, { useState, useEffect } from 'react';
import { PlayCircle, Settings2, Sparkles, Volume2, Download, Pause, Square, Play } from 'lucide-react';
import { Voice, VoiceAttributes, GenerationResult } from '../types';
import { getVoices, generateSpeech } from '../lib/mockVoiceProvider';

const EXPRESSIONS = [
  { tag: '[laughter]', label: 'Laughter' },
  { tag: '[sigh]', label: 'Sigh' },
  { tag: '[confirmation-en]', label: 'Confirmation (Mhm)' },
  { tag: '[question-en]', label: 'Question (Huh?)' },
  { tag: '[surprise-ah]', label: 'Surprise (Ah!)' },
  { tag: '[dissatisfaction-hnn]', label: 'Dissatisfaction' }
];

const ATTRIBUTES = {
  gender: ['Male', 'Female', 'Neutral'],
  age: ['Child', 'Young Adult', 'Middle-aged', 'Senior'],
  pitch: ['Very Low', 'Low', 'Default', 'High', 'Very High'],
  style: ['Default', 'Whisper', 'Professional', 'Casual', 'Energetic'],
  englishAccent: ['None', 'American', 'British', 'Australian', 'Indian'],
  chineseDialect: ['None', 'Mandarin', 'Cantonese', 'Sichuanese'],
};

export const Studio: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [text, setText] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [language, setLanguage] = useState('English');
  const [attributes, setAttributes] = useState<VoiceAttributes>({});
  
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'queued' | 'processing' | 'completed'>('idle');
  const [result, setResult] = useState<GenerationResult | null>(null);

  useEffect(() => {
    getVoices().then(data => {
      setVoices(data);
      if (data.length > 0) setSelectedVoiceId(data[0].id);
    });
  }, []);

  const selectedVoice = voices.find(v => v.id === selectedVoiceId);

  useEffect(() => {
    if (selectedVoice && selectedVoice.attributes) {
      setAttributes(selectedVoice.attributes);
    }
  }, [selectedVoiceId, selectedVoice]);

  const insertExpression = (tag: string) => {
    setText(prev => prev + ' ' + tag + ' ');
  };

  const handleGenerate = async () => {
    if (!text.trim() || !selectedVoiceId) return;
    
    setResult(null);
    const mockResult = await generateSpeech(
      { text, voiceId: selectedVoiceId, language, attributes: isAdvanced ? attributes : undefined },
      (status) => setGenerationStatus(status)
    );
    setResult(mockResult);
    setGenerationStatus('idle'); // Reset UI control status after completion
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 animate-in fade-in duration-500 pb-8">
      {/* Left Panel: Settings */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 mb-1">Studio</h1>
          <p className="text-zinc-400 text-sm">Text-to-speech generation.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-100">Settings</h2>
            <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => setIsAdvanced(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!isAdvanced ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Simple
              </button>
              <button 
                onClick={() => setIsAdvanced(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${isAdvanced ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Advanced
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Voice</label>
              <select 
                value={selectedVoiceId}
                onChange={e => setSelectedVoiceId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              >
                {voices.length === 0 && <option value="">No voices available</option>}
                {voices.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Language</label>
              <select 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              >
                <option value="English">English</option>
                <option value="Chinese">Chinese</option>
                <option value="Multilingual">Multilingual (Auto-detect)</option>
              </select>
            </div>

            {isAdvanced && selectedVoice && (selectedVoice.type === 'designed' || selectedVoice.type === 'auto') && (
              <div className="pt-4 border-t border-zinc-800/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-zinc-500" />
                  <h3 className="text-xs font-medium text-zinc-300">Voice Attributes Override</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {Object.entries(ATTRIBUTES).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-[11px] text-zinc-500 mb-1 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <select 
                        value={attributes[key as keyof VoiceAttributes] || ''}
                        onChange={e => setAttributes({...attributes, [key]: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
                      >
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isAdvanced && selectedVoice?.type === 'cloned' && (
              <div className="pt-4 border-t border-zinc-800/80">
                <p className="text-xs text-zinc-500 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                  Attribute overrides are not available for cloned voices.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Right Panel: Editor & Output */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden min-h-[300px]">
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-md transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  + Expression
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                  {EXPRESSIONS.map(exp => (
                    <button 
                      key={exp.tag}
                      onClick={() => insertExpression(exp.tag)}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-md"
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              {text.length} characters
            </div>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text to synthesize... Try adding an expression like [laughter] or [sigh]."
            className="flex-1 w-full bg-transparent p-6 text-zinc-100 text-lg leading-relaxed resize-none focus:outline-none placeholder:text-zinc-600"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={generationStatus !== 'idle' || !text.trim() || !selectedVoiceId}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-100 text-zinc-900 rounded-lg font-medium text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {generationStatus === 'idle' ? (
                <><PlayCircle className="h-4 w-4" /> Generate Speech</>
              ) : generationStatus === 'queued' ? (
                'Queueing...'
              ) : (
                <><span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-900 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900"></span></span> Processing...</>
              )}
            </button>
            {result?.isMock && (
              <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                Mock Mode — Audio is not real
              </span>
            )}
          </div>
        </div>

        {/* Result Player Mock */}
        {result && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
            <button className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 hover:bg-white transition-colors">
              <Play className="h-5 w-5 ml-1" />
            </button>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300">Generated Output (Placeholder)</span>
                <span className="text-zinc-500">0:00 / {result.duration}s</span>
              </div>
              {/* Fake Waveform */}
              <div className="h-8 w-full flex items-center gap-0.5 opacity-50">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="flex-1 bg-zinc-700 rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button disabled className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors" title="Save to Project (Coming Soon)">
                <Volume2 className="h-5 w-5" />
              </button>
              <button disabled className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors" title="Download (Coming Soon)">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
