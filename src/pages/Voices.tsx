import React, { useEffect, useState } from 'react';
import { Mic2, MoreVertical, Play, Copy, Pencil, Trash2, Loader2 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { getVoices, deleteVoice, createVoice, updateVoice, generateSpeech } from '../lib/mockVoiceProvider';
import { Voice, VoiceType } from '../types';
import { CreateVoiceModal } from '../components/voices/CreateVoiceModal';

export const Voices: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    setIsLoading(true);
    const data = await getVoices();
    setVoices(data);
    setIsLoading(false);
  };

  const handleCreate = async (voiceData: any) => {
    await createVoice(voiceData);
    await loadVoices();
  };

  const handleRename = async (id: string, newName: string) => {
    await updateVoice(id, { name: newName });
    await loadVoices();
  };

  const handleDuplicate = async (voice: Voice) => {
    await createVoice({
      name: `${voice.name} (Copy)`,
      type: voice.type,
      language: voice.language,
      attributes: voice.attributes
    });
    await loadVoices();
  };

  const handleDelete = async (id: string) => {
    await deleteVoice(id);
    await loadVoices();
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Voices</h1>
          <p className="mt-2 text-zinc-400">Manage and design your custom AI voices.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-white transition-colors"
        >
          Add Voice
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-zinc-500 text-sm flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4"/> Loading voices...</div>
          </div>
        ) : voices.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState 
              icon={Mic2}
              title="No voices yet"
              description="You haven't added any voices to your library. Create your first voice to get started."
              actionLabel="Create your first voice"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {voices.map(voice => (
              <VoiceCard 
                key={voice.id} 
                voice={voice} 
                onDelete={() => handleDelete(voice.id)} 
                onRename={(newName) => handleRename(voice.id, newName)}
                onDuplicate={() => handleDuplicate(voice)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateVoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreate} 
      />
    </div>
  );
};

const VoiceCard: React.FC<{ 
  voice: Voice; 
  onDelete: () => void;
  onRename: (newName: string) => void;
  onDuplicate: () => void;
}> = ({ voice, onDelete, onRename, onDuplicate }) => {
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'queued' | 'processing' | 'completed'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(voice.name);

  const typeColors = {
    cloned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    designed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    auto: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const handlePreview = async () => {
    if (previewStatus !== 'idle') return;
    await generateSpeech(
      { text: "Hello, this is a mock preview of my voice.", voiceId: voice.id, language: voice.language },
      (status) => setPreviewStatus(status)
    );
    setTimeout(() => setPreviewStatus('idle'), 2000);
  };

  const handleSaveRename = () => {
    if (editName.trim() && editName !== voice.name) {
      onRename(editName);
    } else {
      setEditName(voice.name); // Reset if blank
    }
    setIsEditing(false);
  };

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:bg-zinc-900 hover:border-zinc-700">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
          <Mic2 className="h-5 w-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${typeColors[voice.type]}`}>
          {voice.type}
        </span>
      </div>
      
      {isEditing ? (
        <input 
          autoFocus
          className="bg-zinc-950 border border-zinc-700 text-sm rounded px-2 py-1 mb-1 text-zinc-100 w-full focus:outline-none focus:border-zinc-500"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onBlur={handleSaveRename}
          onKeyDown={e => e.key === 'Enter' && handleSaveRename()}
        />
      ) : (
        <h3 className="font-medium text-zinc-100 truncate mb-1" title={voice.name}>{voice.name}</h3>
      )}
      <p className="text-xs text-zinc-500 mb-6">{voice.language}</p>

      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
        <button 
          onClick={handlePreview}
          disabled={previewStatus !== 'idle'}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50"
        >
          {previewStatus === 'idle' ? (
            <><Play className="h-3.5 w-3.5" /> Preview</>
          ) : previewStatus === 'completed' ? (
             <><Play className="h-3.5 w-3.5 text-green-400" /> Done</>
          ) : (
             <span className="animate-pulse text-amber-500">{previewStatus}...</span>
          )}
        </button>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded" title="Rename">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDuplicate} className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded" title="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
