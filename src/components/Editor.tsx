import React, { useState, useEffect } from 'react';
import { Page, Block, BlockType } from '../types';
import BlockNode from './BlockNode';
import { generateId } from '../utils';

interface EditorProps {
  page: Page;
  onChange: (page: Page) => void;
}

export default function Editor({ page, onChange }: EditorProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Focus last block on load if activeBlockId is null
  useEffect(() => {
    if (!activeBlockId && page.blocks.length > 0) {
      // Intentionally not setting focus to avoid jumping around on initial load,
      // but you can adjust this behavior.
    }
  }, [page.id]);

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = page.blocks.map(b => b.id === id ? { ...b, ...updates } : b);
    onChange({ ...page, blocks: newBlocks });
  };

  const addBlock = (index: number, content: string, type: BlockType = 'p') => {
    const newBlock: Block = { id: generateId(), type, content };
    const newBlocks = [...page.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange({ ...page, blocks: newBlocks });
    setActiveBlockId(newBlock.id);
  };

  const deleteBlock = (index: number, mergeToPrevious: boolean = false) => {
    if (page.blocks.length === 1 && index === 0) {
      // Don't delete the last block, just clear it
      updateBlock(page.blocks[0].id, { content: '', type: 'p' });
      return;
    }

    const blockToDelete = page.blocks[index];
    const newBlocks = [...page.blocks];
    
    if (mergeToPrevious && index > 0) {
      const prevBlock = newBlocks[index - 1];
      const cursorPosition = prevBlock.content.length; // We might want to pass this back for selection, but standard behavior usually just puts cursor at end
      
      newBlocks[index - 1] = { 
        ...prevBlock, 
        content: prevBlock.content + blockToDelete.content 
      };
      setActiveBlockId(prevBlock.id);
    } else if (index > 0) {
      setActiveBlockId(newBlocks[index - 1].id);
    } else {
      setActiveBlockId(newBlocks[1].id);
    }

    newBlocks.splice(index, 1);
    onChange({ ...page, blocks: newBlocks });
  };

  const focusNext = (index: number) => {
    if (index < page.blocks.length - 1) {
      setActiveBlockId(page.blocks[index + 1].id);
    }
  };

  const focusPrevious = (index: number) => {
    if (index > 0) {
      setActiveBlockId(page.blocks[index - 1].id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 transition-colors">
      {/* Cover Image Placeholder */}
      {page.coverImage && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative group transition-colors">
          <img src={page.coverImage} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onChange({ ...page, coverImage: undefined })}
              className="px-3 py-1 bg-white dark:bg-gray-800 text-sm font-medium rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition">
              Remove cover
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 md:px-12 py-8 md:py-12 pb-32">
        {/* Top Actions */}
        <div className="flex gap-4 mb-4 text-gray-400 text-sm opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity">
          {!page.icon && (
            <button 
              onClick={() => onChange({ ...page, icon: '📄' })}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors"
            >
              Add icon
            </button>
          )}
          {!page.coverImage && (
            <button 
              onClick={() => onChange({ ...page, coverImage: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop' })}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors"
            >
              Add cover
            </button>
          )}
        </div>

        {/* Icon & Title */}
        {page.icon && (
          <div className="relative group w-16 h-16 md:w-20 md:h-20 mb-4">
            <div className="text-6xl md:text-7xl">
              {page.icon}
            </div>
          </div>
        )}

        <input
          type="text"
          value={page.title}
          onChange={(e) => onChange({ ...page, title: e.target.value })}
          placeholder="Untitled"
          className="w-full text-4xl md:text-5xl font-bold text-[#37352f] dark:text-white outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-8 bg-transparent"
        />

        {/* Blocks Editor */}
        <div className="space-y-[1px]">
          {page.blocks.map((block, index) => (
            <BlockNode
              key={block.id}
              block={block}
              index={index}
              autoFocus={activeBlockId === block.id}
              onUpdate={updateBlock}
              onAdd={addBlock}
              onDelete={deleteBlock}
              onFocusNext={focusNext}
              onFocusPrevious={focusPrevious}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
