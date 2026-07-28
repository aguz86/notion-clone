import React, { useState } from 'react';
import { BookmarkId } from '../types';
import { Bookmark, Plus, Trash2, Search, Copy, CheckCircle2, Pin, Edit2, X, Check } from 'lucide-react';
import { generateId } from '../utils';

interface BookmarkIdListProps {
  bookmarks: BookmarkId[];
  onChange: (bookmarks: BookmarkId[]) => void;
}

const CATEGORIES = ['Umum', 'Rekening Bank', 'Identitas', 'Alamat', 'Token/Tagihan', 'Penting'];

export default function BookmarkIdList({ bookmarks, onChange }: BookmarkIdListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);

  const startEdit = (b: BookmarkId) => {
    setEditingId(b.id);
    setEditTitle(b.title);
    setEditValue(b.value);
    setEditCategory(b.category);
  };

  const saveEdit = () => {
    if (!editTitle.trim() || !editValue.trim() || !editingId) return;
    onChange(bookmarks.map(b => b.id === editingId ? { ...b, title: editTitle, value: editValue, category: editCategory } : b));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const addBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newValue.trim()) return;

    const newBookmark: BookmarkId = {
      id: generateId(),
      title: newTitle.trim(),
      value: newValue.trim(),
      category: newCategory,
      pinned: false
    };

    onChange([newBookmark, ...bookmarks]);
    setNewTitle('');
    setNewValue('');
  };

  const deleteBookmark = (id: string) => {
    onChange(bookmarks.filter(b => b.id !== id));
  };

  const togglePin = (id: string) => {
    onChange(bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b));
  };

  const copyToClipboard = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const filteredBookmarks = sortedBookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? b.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto w-full text-[#37352f] dark:text-gray-200">
      <div className="flex items-center mb-6">
        <Bookmark size={32} className="mr-4 text-purple-500" />
        <h1 className="text-4xl font-bold">Bookmark ID</h1>
      </div>
      
      <div className="mb-8 text-gray-500 dark:text-gray-400">
        Simpan data penting seperti rekening bank, e-KTP, alamat, dan token rumah.
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={18} className="text-purple-500" /> Tambah ID Baru
        </h2>
        <form onSubmit={addBookmark} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Judul (ex: Rek BCA)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="md:col-span-4">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Nomor/Nilai (ex: 1234567890)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[40px] flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeCategory === null 
                ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Semua
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                activeCategory === category 
                  ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari data..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className={`group block p-4 bg-white dark:bg-gray-800 border rounded-xl hover:shadow-md transition-all relative ${bookmark.pinned ? 'border-purple-300 dark:border-purple-600 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
          >
            {editingId === bookmark.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Judul"
                />
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Nilai"
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={cancelEdit} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"><X size={16} /></button>
                  <button onClick={saveEdit} className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"><Check size={16} /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bookmark.pinned ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                      {bookmark.title.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors pr-16">
                      {bookmark.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center absolute top-3 right-2 gap-0.5">
                    <button
                      onClick={() => togglePin(bookmark.id)}
                      className={`p-1.5 rounded-md transition-all ${bookmark.pinned ? 'text-purple-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                      title={bookmark.pinned ? "Unpin" : "Pin ke atas"}
                    >
                      <Pin size={14} className={bookmark.pinned ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => startEdit(bookmark)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3 pl-10 pr-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded w-full truncate border border-gray-100 dark:border-gray-700" title={bookmark.value}>
                    {bookmark.value}
                  </p>
                  <button
                    onClick={() => copyToClipboard(bookmark.id, bookmark.value)}
                    className="ml-2 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0"
                    title="Copy ke clipboard"
                  >
                    {copiedId === bookmark.id ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                
                <div className="flex items-center justify-start pl-10">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded">
                    {bookmark.category}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        
        {filteredBookmarks.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <Bookmark size={32} className="mx-auto mb-3 opacity-20" />
            <p>Tidak ada data yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
