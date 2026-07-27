import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface BulkDeleteModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getItemId: (item: T) => string;
  onDelete: (selectedIds: string[]) => void;
  title: string;
  initialSelectedIds?: string[];
}

export default function BulkDeleteModal<T>({
  isOpen,
  onClose,
  items,
  renderItem,
  getItemId,
  onDelete,
  title,
  initialSelectedIds = []
}: BulkDeleteModalProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialSelectedIds));
    }
  }, [isOpen, initialSelectedIds]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(getItemId)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-lg font-bold text-[#37352f] dark:text-gray-100">
            <Trash2 size={20} className="text-red-500" />
            {title}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={items.length > 0 && selectedIds.size === items.length}
              onChange={handleToggleAll}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Semua ({selectedIds.size}/{items.length})</span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Tidak ada item.</div>
          ) : (
            items.map(item => {
              const id = getItemId(item);
              return (
                <label key={id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedIds.has(id)}
                    onChange={() => handleToggle(id)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 text-sm text-[#37352f] dark:text-gray-200 overflow-hidden">
                    {renderItem(item)}
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onDelete(Array.from(selectedIds));
              onClose();
            }}
            disabled={selectedIds.size === 0}
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Hapus Terpilih ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  );
}
