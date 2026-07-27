import React, { useState } from 'react';
import { Bookmark as BookmarkType } from '../types';
import { Bookmark, Plus, Trash2, Search, ExternalLink } from 'lucide-react';
import { generateId } from '../utils';

interface BookmarkListProps {
  bookmarks: BookmarkType[];
  onChange: (bookmarks: BookmarkType[]) => void;
}

const CATEGORIES = ['Umum', 'Belajar', 'Projek', 'Referensi', 'Penting'];

export default function BookmarkList({ bookmarks, onChange }: BookmarkListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const addBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    // Ensure URL has protocol
    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newBookmark: BookmarkType = {
      id: generateId(),
      title: newTitle.trim(),
      url: finalUrl,
      category: newCategory
    };
    
    onChange([newBookmark, ...bookmarks]);
    setNewTitle('');
    setNewUrl('');
  };

  const deleteBookmark = (id: string) => {
    onChange(bookmarks.filter(b => b.id !== id));
  };

  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? b.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto w-full text-[#37352f] dark:text-gray-200">
      <div className="flex items-center mb-6">
        <Bookmark size={32} className="mr-4 text-blue-500" />
        <h1 className="text-4xl font-bold">Bookmark Links</h1>
      </div>
      
      <div className="mb-8 text-gray-500 dark:text-gray-400">
        Simpan dan atur link penting Anda dalam berbagai kategori.
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={18} className="text-blue-500" /> Tambah Bookmark Baru
        </h2>
        <form onSubmit={addBookmark} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Judul (ex: Google)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-4">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL (ex: google.com)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[40px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
            placeholder="Cari bookmark..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map(bookmark => (
          <a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all relative"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                  {bookmark.title.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {bookmark.title}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteBookmark(bookmark.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all absolute top-3 right-3"
                title="Hapus bookmark"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-3 pl-10" title={bookmark.url}>
              {bookmark.url.replace(/^https?:\/\//, '')}
            </p>
            
            <div className="flex items-center justify-between pl-10">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded">
                {bookmark.category}
              </span>
              <ExternalLink size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          </a>
        ))}
        
        {filteredBookmarks.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <Bookmark size={32} className="mx-auto mb-3 opacity-20" />
            <p>Tidak ada bookmark yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
