import { useState, useEffect, useRef } from 'react';
import { Upload, Search, Music, Volume2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import { type Sound, addSound, getAllSounds, updateSound, deleteSound } from './db/db';
import { getAudioDuration, suggestTags } from './services/audioUtils';
import { SoundCard } from './components/SoundCard';
import { EditModal } from './components/EditModal';

function App() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [editingSound, setEditingSound] = useState<Sound | null>(null);
  const [playState, setPlayState] = useState<{ id: string | null; url: string | null }>({ id: null, url: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  // Extract unique tags and sort them
  const allTags = Array.from(new Set(sounds.flatMap(s => s.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) continue;

      try {
        const duration = await getAudioDuration(file);
        const tags = suggestTags(file.name);

        const newSound: Sound = {
          id: uuidv4(),
          file: file,
          fileName: file.name,
          name: file.name.replace(/\.[^/.]+$/, ""),
          duration,
          tags: tags,
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

  // Filter sounds based on search query AND selected tags
  const filteredSounds = sounds.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      (selectedTags.includes('Untagged')
        ? s.tags.length === 0
        : selectedTags.every(tag => s.tags.includes(tag)));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white font-sans overflow-hidden">
      {/* Sidebar - Dynamic Tag Filters */}
      <aside className="w-64 bg-[#181818] border-r border-[#282828] p-4 hidden md:flex flex-col">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-8 text-indigo-400">
          <Volume2 className="w-6 h-6" />
          SFX Memory
        </h1>

        <div className="flex flex-col flex-1 overflow-hidden">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
            Filters
          </h2>

          <nav className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            <button
              onClick={() => setSelectedTags([])}
              className={clsx(
                "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                selectedTags.length === 0 ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              All Sounds <span className="float-right text-xs opacity-60 mt-0.5">{sounds.length}</span>
            </button>

            {/* Special Untagged Filter */}
            <button
              onClick={() => toggleTag('Untagged')}
              className={clsx(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selectedTags.includes('Untagged') ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              Untagged <span className="float-right text-xs opacity-60 mt-0.5">{sounds.filter(s => s.tags.length === 0).length}</span>
            </button>

            <div className="h-4" /> {/* Spacer */}

            <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-3">
              Tags
            </h2>

            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={clsx(
                  "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group",
                  selectedTags.includes(tag) ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <span className="truncate">#{tag}</span>
                <span className="text-[10px] opacity-40 group-hover:opacity-60 transition-opacity">
                  {sounds.filter(s => s.tags.includes(tag)).length}
                </span>
              </button>
            ))}

            {allTags.length === 0 && !selectedTags.includes('Untagged') && (
              <p className="px-3 py-2 text-xs text-zinc-600 italic">No tags yet...</p>
            )}
          </nav>
        </div>

        <div className="mt-auto pt-4">
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-500">Drag mp3/wav files here</p>
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
                  onUpdate={loadSounds}
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
