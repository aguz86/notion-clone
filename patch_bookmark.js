import fs from 'fs';
let code = fs.readFileSync('src/components/BookmarkIdList.tsx', 'utf8');

// Add edit state
code = code.replace(
  "const [copiedId, setCopiedId] = useState<string | null>(null);",
  `const [copiedId, setCopiedId] = useState<string | null>(null);
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
  };`
);

// Add Edit icon to imports
code = code.replace(
  "import { Bookmark, Plus, Trash2, Search, Copy, CheckCircle2, Pin } from 'lucide-react';",
  "import { Bookmark, Plus, Trash2, Search, Copy, CheckCircle2, Pin, Edit2, X, Check } from 'lucide-react';"
);

// Replace bookmark rendering
code = code.replace(
  `        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className={\`group block p-4 bg-white dark:bg-gray-800 border rounded-xl hover:shadow-md transition-all relative \${bookmark.pinned ? 'border-purple-300 dark:border-purple-600 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}\`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${bookmark.pinned ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}\`}>
                  {bookmark.title.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors pr-10">
                  {bookmark.title}
                </h3>
              </div>
              
              <div className="flex items-center absolute top-3 right-3 gap-1">
                <button
                  onClick={() => togglePin(bookmark.id)}
                  className={\`p-1.5 rounded-md transition-all \${bookmark.pinned ? 'text-purple-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}\`}
                  title={bookmark.pinned ? "Unpin" : "Pin ke atas"}
                >
                  <Pin size={14} className={bookmark.pinned ? 'fill-current' : ''} />
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
          </div>
        ))}`,
  `        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className={\`group block p-4 bg-white dark:bg-gray-800 border rounded-xl hover:shadow-md transition-all relative \${bookmark.pinned ? 'border-purple-300 dark:border-purple-600 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}\`}
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
                    <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${bookmark.pinned ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}\`}>
                      {bookmark.title.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors pr-16">
                      {bookmark.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center absolute top-3 right-2 gap-0.5">
                    <button
                      onClick={() => togglePin(bookmark.id)}
                      className={\`p-1.5 rounded-md transition-all \${bookmark.pinned ? 'text-purple-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}\`}
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
        ))}`
);

fs.writeFileSync('src/components/BookmarkIdList.tsx', code);
