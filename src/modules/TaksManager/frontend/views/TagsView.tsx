import React, { useState } from 'react';
import { Tag } from './TaskManagerView';

interface TagsViewProps {
    tags: Tag[];
    onCreateTag: (tag: { name: string; color: string }) => Promise<void>;
    onSaveTag: (tag: Tag) => Promise<void>;
    onDeleteTag: (tagId: number) => Promise<void>;
}

const TagsView: React.FC<TagsViewProps> = ({ tags, onCreateTag, onSaveTag, onDeleteTag }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3b82f6');
    const [editTagName, setEditTagName] = useState('');
    const [editTagColor, setEditTagColor] = useState('');

    const handleCreate = async () => {
        if (!newTagName.trim()) return;
        await onCreateTag({ name: newTagName, color: newTagColor });
        setNewTagName('');
        setNewTagColor('#3b82f6');
        setIsCreating(false);
    };

    const startEditing = (tag: Tag) => {
        setEditingTagId(tag.id);
        setEditTagName(tag.name);
        setEditTagColor(tag.color);
    };

    const handleUpdate = async (id: number) => {
        if (!editTagName.trim()) return;
        await onSaveTag({ id, name: editTagName, color: editTagColor });
        setEditingTagId(null);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/20">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider m-0">Tags Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Create and manage categories for your tasks</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Tag
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {isCreating && (
                    <div className="bg-slate-800/40 border border-blue-500/30 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Create New Tag</h3>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                                <label className="text-xs font-semibold text-slate-400">Tag Name</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Enter tag name..."
                                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400">Color</label>
                                <div className="flex items-center gap-3 bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
                                    <input
                                        type="color"
                                        value={newTagColor}
                                        onChange={(e) => setNewTagColor(e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-sm font-mono text-slate-300 uppercase">{newTagColor}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Create Tag
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tags.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                            <svg className="mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                            <p className="text-lg font-medium">No tags found</p>
                            <p className="text-sm">Start by creating your first tag to organize tasks.</p>
                        </div>
                    ) : (
                        tags.map(tag => (
                            <div
                                key={tag.id}
                                className={`
                                    group relative bg-slate-800/30 border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:bg-slate-800/50 hover:border-white/10 hover:-translate-y-1
                                    ${editingTagId === tag.id ? 'ring-2 ring-blue-500/50 bg-slate-800/60' : ''}
                                `}
                            >
                                {editingTagId === tag.id ? (
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            value={editTagName}
                                            onChange={(e) => setEditTagName(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                            autoFocus
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={editTagColor}
                                                    onChange={(e) => setEditTagColor(e.target.value)}
                                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                                                />
                                                <span className="text-xs font-mono text-slate-400 uppercase">{editTagColor}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingTagId(null)}
                                                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(tag.id)}
                                                    className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                                style={{ backgroundColor: tag.color, boxShadow: `0 0 10px ${tag.color}40` }}
                                            />
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEditing(tag)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                    title="Edit Tag"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => onDeleteTag(tag.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Delete Tag"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">{tag.name}</h3>
                                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{tag.color}</p>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagsView;
