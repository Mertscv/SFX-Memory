import React, { useState } from 'react';
import { Play, Pause, Edit2, Clock, Plus, X } from 'lucide-react';
import { type Sound, updateSound } from '../db/db';
import { formatDuration } from '../services/audioUtils';
import clsx from 'clsx';

interface SoundCardProps {
    sound: Sound;
    onEdit: (sound: Sound) => void;
    onPlay: (sound: Sound) => void;
    isPlaying: boolean;
    onUpdate?: () => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, onEdit, onPlay, isPlaying, onUpdate }) => {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = tagInput.trim();
        if (trimmed && !sound.tags.includes(trimmed)) {
            const updatedTags = Array.isArray(sound.tags) ? [...sound.tags, trimmed] : [trimmed];
            const updatedSound = { ...sound, tags: updatedTags };
            await updateSound(updatedSound);
            if (onUpdate) onUpdate();
            setTagInput('');
            setIsAddingTag(false);
        } else {
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = async (tagToRemove: string) => {
        const updatedSound = { ...sound, tags: sound.tags.filter(t => t !== tagToRemove) };
        await updateSound(updatedSound);
        if (onUpdate) onUpdate();
    };

    return (
        <div
            className={clsx(
                "bg-zinc-800 rounded-lg p-4 border border-zinc-700 transition-all hover:border-zinc-500 group flex flex-col h-full",
                isPlaying && "border-indigo-500 ring-1 ring-indigo-500 bg-zinc-800/80"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-white truncate pr-2 flex-1" title={sound.name}>{sound.name}</h3>
            </div>

            <div className="flex items-center gap-2 mb-3 text-[10px] text-zinc-500">
                <Clock size={10} />
                <span>{formatDuration(sound.duration)}</span>
            </div>

            {sound.notes && (
                <p className="text-xs text-zinc-400 mb-4 line-clamp-2 min-h-[2.5em] italic">
                    {sound.notes}
                </p>
            )}

            {/* Tags Section */}
            <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {(sound.tags || []).map(tag => (
                    <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-zinc-700/50 hover:bg-zinc-700 rounded text-zinc-300 flex items-center gap-1 group/tag transition-colors"
                    >
                        #{tag}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }}
                            className="opacity-0 group-hover/tag:opacity-100 hover:text-red-400 transition-opacity"
                        >
                            <X size={10} />
                        </button>
                    </span>
                ))}

                {isAddingTag ? (
                    <form onSubmit={handleAddTag} className="flex items-center">
                        <input
                            autoFocus
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onBlur={() => handleAddTag()}
                            className="bg-zinc-900 border border-indigo-500 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none w-20"
                            placeholder="Tag..."
                        />
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingTag(true)}
                        className="text-[10px] px-2 py-0.5 bg-zinc-700/20 hover:bg-zinc-700/50 rounded text-zinc-500 hover:text-zinc-300 border border-zinc-700 border-dashed flex items-center gap-1 transition-colors"
                    >
                        <Plus size={10} /> Add Tag
                    </button>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onPlay(sound)}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                        isPlaying
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-zinc-700 hover:bg-zinc-600 text-white"
                    )}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? 'Stop' : 'Play'}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(sound); }}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-zinc-300 hover:text-white transition-colors"
                    title="Edit"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );
};
