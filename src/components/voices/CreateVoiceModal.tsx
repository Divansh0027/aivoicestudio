import React, { useState, useRef } from 'react';
import { X, Upload, Mic2, Wand2, Bot } from 'lucide-react';
import { VoiceType, VoiceAttributes } from '../../types';
import { generateSpeech } from '../../lib/mockVoiceProvider';

interface CreateVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voice: { name: string; type: VoiceType; language: string; attributes?: VoiceAttributes }) => Promise<void>;
}

const ATTRIBUTES = {
  gender: ['Male', 'Female', 'Neutral'],
  age: ['Child', 'Young Adult', 'Middle-aged', 'Senior'],
  pitch: ['Very Low', 'Low', 'Default', 'High', 'Very High'],
  style: ['Default', 'Whisper', 'Professional', 'Casual', 'Energetic'],
  englishAccent: ['None', 'American', 'British', 'Australian', 'Indian'],
  chineseDialect: ['None', 'Mandarin', 'Cantonese', 'Sichuanese'],
};

export const CreateVoiceModal: React.FC<CreateVoiceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<VoiceType>('cloned');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [attributes, setAttributes] = useState<VoiceAttributes>({
    gender: 'Neutral',
    age: 'Young Adult',
    pitch: 'Default',
    style: 'Default',
    englishAccent: 'American',
    chineseDialect: 'None',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'queued' | 'processing' | 'completed'>('idle');
  const [referenceFile, setReferenceFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    await onSave({
      name,
      type,
      language,
      attributes: type !== 'cloned' ? attributes : undefined
    });
    setIsSaving(false);
    resetAndClose();
  };

  const handleTest = async () => {
    if (testStatus !== 'idle') return;
    await generateSpeech(
      { text: "Hello, this is a test preview.", voiceId: "mock_preview", language },
      (status) => setTestStatus(status)
    );
    setTimeout(() => setTestStatus('idle'), 2000);
  };

  const resetAndClose = () => {
    setStep(1);
    setType('cloned');
    setName('');
    setTestStatus('idle');
    setReferenceFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-zinc-100">
            {step === 1 ? 'Choose Voice Type' : 'Configure Voice'}
          </h2>
          <button onClick={resetAndClose} className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TypeCard 
                icon={Mic2} 
                title="Clone" 
                desc="Upload or record audio to create an identical replica."
                selected={type === 'cloned'}
                onClick={() => setType('cloned')}
              />
              <TypeCard 
                icon={Wand2} 
                title="Design" 
                desc="Construct a new voice using specific vocal attributes."
                selected={type === 'designed'}
                onClick={() => setType('designed')}
              />
              <TypeCard 
                icon={Bot} 
                title="Auto" 
                desc="Let OmniVoice automatically synthesize a standard voice."
                selected={type === 'auto'}
                onClick={() => setType('auto')}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Voice Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Podcast Host, Calm Assistant"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                  >
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Multilingual">Multilingual</option>
                  </select>
                </div>
              </div>

              {type === 'cloned' && (
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300">Reference Audio</h3>
                  <div 
                    className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setReferenceFile(file.name);
                      }}
                    />
                    {referenceFile ? (
                      <div className="flex flex-col items-center w-full max-w-sm">
                        <p className="text-sm font-medium text-zinc-200 mb-2">{referenceFile} selected</p>
                        <div className="h-8 w-full flex items-center gap-0.5 opacity-50 mb-2 pointer-events-none">
                          {[...Array(30)].map((_, i) => (
                            <div key={i} className="flex-1 bg-zinc-500 rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 pointer-events-none">
                          <Upload className="h-5 w-5 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-200 pointer-events-none">Click to upload or drag and drop</p>
                      </>
                    )}
                    <p className="text-xs text-zinc-500 mt-1 pointer-events-none">Mock/UI only — audio is not uploaded or processed</p>
                  </div>
                </div>
              )}

              {type === 'designed' && (
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-4">Voice Attributes (OmniVoice)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(ATTRIBUTES).map(([key, options]) => (
                      <div key={key}>
                        <label className="block text-xs text-zinc-500 mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <select 
                          value={attributes[key as keyof VoiceAttributes] || ''}
                          onChange={(e) => setAttributes({ ...attributes, [key]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        >
                          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-300">Preview Test</h3>
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">Mock Output</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleTest}
                    disabled={testStatus === 'queued' || testStatus === 'processing'}
                    className="px-4 py-2 bg-zinc-800 text-zinc-100 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    {testStatus === 'idle' ? 'Generate Test Audio' : testStatus === 'queued' ? 'Queueing...' : testStatus === 'processing' ? 'Synthesizing...' : 'Test Again'}
                  </button>
                  {testStatus === 'completed' && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Mock audio ready
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3 shrink-0 bg-zinc-950">
          {step === 1 ? (
            <button 
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-lg font-medium text-sm hover:bg-white transition-colors"
            >
              Continue
            </button>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg font-medium text-sm hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-lg font-medium text-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Voice'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TypeCard = ({ icon: Icon, title, desc, selected, onClick }: { icon: any, title: string, desc: string, selected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl border text-left transition-all ${
      selected 
        ? 'border-zinc-500 bg-zinc-900 ring-1 ring-zinc-500' 
        : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 hover:border-zinc-700'
    }`}
  >
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${
      selected ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 text-zinc-400'
    }`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className={`font-medium mb-1 ${selected ? 'text-zinc-100' : 'text-zinc-300'}`}>{title}</h3>
    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
  </button>
);
