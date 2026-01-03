import React from 'react';
import { Play, Pause, Edit2, Clock } from 'lucide-react';
import { type Sound } from '../db/db';
import { formatDuration } from '../services/audioUtils';
import clsx from 'clsx';

interface SoundCardProps {
    sound: Sound;
    onEdit: (sound: Sound) => void;
    onPlay: (sound: Sound) => void;
    isPlaying: boolean;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, onEdit, onPlay, isPlaying }) => {
    return (
        <div
            className={clsx(
                "bg-zinc-800 rounded-lg p-4 border border-zinc-700 transition-all hover:border-zinc-500 group",
                isPlaying && "border-indigo-500 ring-1 ring-indigo-500 bg-zinc-800/80"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white truncate pr-2 flex-1" title={sound.name}>{sound.name}</h3>
                <span className="text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded-full whitespace-nowrap">
                    {sound.category}
                </span>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-zinc-400">
                <Clock size={12} />
                <span>{formatDuration(sound.duration)}</span>
            </div>

            {sound.notes && (
                <p className="text-sm text-zinc-300 mb-3 line-clamp-2 min-h-[2.5em]">
                    {sound.notes}
                </p>
            )}

            {sound.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {sound.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2 mt-auto">
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
                    {isPlaying ? 'Playing' : 'Play'}
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
