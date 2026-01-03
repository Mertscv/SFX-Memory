import { useState, useEffect, useRef } from 'react';
import { Upload, Search, Music, Volume2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { type Sound, addSound, getAllSounds, updateSound, deleteSound } from './db/db';
import { getAudioDuration, suggestCategory } from './services/audioUtils';
import { SoundCard } from './components/SoundCard';
import { EditModal } from './components/EditModal';

function App() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [editingSound, setEditingSound] = useState<Sound | null>(null);
  const [playState, setPlayState] = useState<{ id: string | null; url: string | null }>({ id: null, url: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSounds();
    return () => {
      if (playState.url) URL.revokeObjectURL(playState.url);
    };
  }, []);

  const loadSounds = async () => {
    const loaded = await getAllSounds();
    setSounds(loaded.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) continue;

      try {
        const duration = await getAudioDuration(file);
        const newSound: Sound = {
          id: uuidv4(),
          file: file,
          fileName: file.name,
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: suggestCategory(file.name),
          duration,
          tags: [],
          notes: '',
          createdAt: Date.now()
        };

        await addSound(newSound);
      } catch (err) {
        console.error("Error adding file:", file.name, err);
      }
    }
    await loadSounds();
  };

  const handlePlay = (sound: Sound) => {
    if (playState.id === sound.id) {
      audioRef.current?.pause();
      setPlayState({ id: null, url: null });
    } else {
      if (playState.url) URL.revokeObjectURL(playState.url);

      const url = URL.createObjectURL(sound.file);
      setPlayState({ id: sound.id, url });

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }
  };

  const onAudioEnded = () => {
    setPlayState({ id: null, url: null });
  };

  const handleUpdate = async (updated: Sound) => {
    await updateSound(updated);
    setEditingSound(null);
    loadSounds();
  };

  const handleDelete = async (id: string) => {
    await deleteSound(id);
    setEditingSound(null);
    if (playState.id === id) {
      audioRef.current?.pause();
      setPlayState({ id: null, url: null });
    }
    loadSounds();
  };

  // Filter sounds
  const filteredSounds = sounds.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#121212] text-white font-sans overflow-hidden">
      {/* Sidebar - Quick Filters (Mock) */}
      <aside className="w-64 bg-[#181818] border-r border-[#282828] p-4 hidden md:flex flex-col">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-8 text-indigo-400">
          <Volume2 className="w-6 h-6" />
          SFX Memory
        </h1>

        <nav className="space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-md bg-indigo-500/10 text-indigo-400 font-medium">
            All Sounds <span className="float-right text-xs opacity-60 mt-1">{sounds.length}</span>
          </button>
          {['Transition', 'Impact', 'Ambience', 'UI', 'Foley'].map(cat => (
            <button key={cat} className="w-full text-left px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              {cat}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 mb-2">Drag mp3/wav files here to add to library</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col min-w-0"
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        {/* Header */}
        <header className="h-16 border-b border-[#282828] bg-[#121212] flex items-center px-6 justify-between shrink-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search sounds, tags, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F1F1F] border-none rounded-full py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
              <Upload size={16} />
              Import Sounds
              <input type="file" multiple accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
            </label>
          </div>
        </header>

        {/* Sound Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredSounds.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <Music size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No sounds found</p>
              <p className="text-sm opacity-60">Drag and drop audio files to start building your memory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSounds.map(sound => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  onEdit={setEditingSound}
                  onPlay={handlePlay}
                  isPlaying={playState.id === sound.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Global Audio Element */}
        <audio ref={audioRef} onEnded={onAudioEnded} className="hidden" />

        {/* Drag Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-indigo-500/20 backdrop-blur-sm border-2 border-indigo-500 border-dashed z-50 flex items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-white drop-shadow-md">Drop Files Here</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {editingSound && (
        <EditModal
          sound={editingSound}
          onClose={() => setEditingSound(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
