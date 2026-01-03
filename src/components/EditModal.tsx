import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { type Sound } from '../db/db';

interface EditModalProps {
    sound: Sound;
    onSave: (updatedSound: Sound) => void;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ sound, onSave, onClose, onDelete }) => {
    const [formData, setFormData] = useState({ ...sound });
    const [tagInput, setTagInput] = useState('');

    const handleSave = () => {
        onSave(formData);
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">Edit Sound</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                        <input
                            type="text"
                            list="categories"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                        <datalist id="categories">
                            <option value="Transition" />
                            <option value="Impact" />
                            <option value="Ambience" />
                            <option value="UI" />
                            <option value="Foley" />
                            <option value="Voice" />
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white min-h-[80px] focus:outline-none focus:border-indigo-500"
                            placeholder="Where might you use this? e.g., 'Before the drop', 'Comedic effect'"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Mood Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map(tag => (
                                <span key={tag} className="bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Type tag and press Enter"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800 flex justify-between">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this sound?')) {
                                onDelete(sound.id);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
