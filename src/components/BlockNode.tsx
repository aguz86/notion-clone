import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { Block, BlockType } from '../types';
import { GripVertical, Square, CheckSquare } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

interface BlockNodeProps {
  key?: string | number;
  block: Block;
  index: number;
  autoFocus: boolean;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onAdd: (index: number, content: string, type?: BlockType) => void;
  onDelete: (index: number, mergeToPrevious?: boolean) => void;
  onFocusNext: (index: number) => void;
  onFocusPrevious: (index: number) => void;
}

export default function BlockNode({ 
  block, 
  index, 
  autoFocus, 
  onUpdate, 
  onAdd, 
  onDelete,
  onFocusNext,
  onFocusPrevious
}: BlockNodeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [autoFocus]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Split content if cursor is in the middle, or just create empty block
      const cursorPosition = e.currentTarget.selectionStart;
      const currentContent = e.currentTarget.value;
      
      const beforeCursor = currentContent.substring(0, cursorPosition);
      const afterCursor = currentContent.substring(cursorPosition);
      
      onUpdate(block.id, { content: beforeCursor });
      
      // Carry over list types
      let newType: BlockType = 'p';
      if (block.type === 'ul' || block.type === 'todo') {
        newType = block.type;
      }
      
      onAdd(index, afterCursor, newType);
    } else if (e.key === 'Backspace') {
      if (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
        e.preventDefault();
        if (block.type !== 'p') {
          // If it's a special block, convert back to paragraph
          onUpdate(block.id, { type: 'p' });
        } else {
          // Merge with previous
          onDelete(index, true);
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        onFocusPrevious(index);
      }
    } else if (e.key === 'ArrowDown') {
      if (e.currentTarget.selectionStart === e.currentTarget.value.length) {
        e.preventDefault();
        onFocusNext(index);
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    let newType = block.type;
    
    // Markdown shortcuts
    if (value.startsWith('# ') && block.type !== 'h1') {
      newType = 'h1';
      value = value.substring(2);
    } else if (value.startsWith('## ') && block.type !== 'h2') {
      newType = 'h2';
      value = value.substring(3);
    } else if (value.startsWith('### ') && block.type !== 'h3') {
      newType = 'h3';
      value = value.substring(4);
    } else if ((value.startsWith('- ') || value.startsWith('* ')) && block.type !== 'ul') {
      newType = 'ul';
      value = value.substring(2);
    } else if (value.startsWith('[] ') && block.type !== 'todo') {
      newType = 'todo';
      value = value.substring(3);
    }

    if (newType !== block.type) {
      onUpdate(block.id, { type: newType, content: value });
    } else {
      onUpdate(block.id, { content: value });
    }
  };

  const renderPrefix = () => {
    switch (block.type) {
      case 'ul':
        return <div className="w-6 flex justify-center items-center mt-2 mr-2"><div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" /></div>;
      case 'todo':
        return (
          <button 
            className="w-6 flex justify-center items-center mt-1 mr-2 text-gray-400 hover:text-green-500 dark:hover:text-green-400"
            onClick={() => onUpdate(block.id, { checked: !block.checked })}
          >
            {block.checked ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
          </button>
        );
      default:
        return null;
    }
  };

  let textareaClasses = "w-full resize-none outline-none bg-transparent py-1 m-0 text-[#37352f] dark:text-gray-200";
  switch (block.type) {
    case 'h1':
      textareaClasses += " text-4xl font-bold mt-6 mb-2 text-[#37352f] dark:text-white";
      break;
    case 'h2':
      textareaClasses += " text-2xl font-semibold mt-4 mb-1 text-[#37352f] dark:text-white";
      break;
    case 'h3':
      textareaClasses += " text-xl font-medium mt-3 mb-1 text-[#37352f] dark:text-white";
      break;
    case 'todo':
      if (block.checked) textareaClasses += " line-through text-gray-400 dark:text-gray-500";
      break;
  }

  return (
    <div className={`group flex items-start -ml-8 rounded-md transition-colors ${
      block.type === 'todo' && block.checked ? 'bg-green-50/50 dark:bg-green-900/10' : ''
    }`}>
      <div className="w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 cursor-grab">
        <GripVertical size={16} className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400" />
      </div>
      {renderPrefix()}
      <TextareaAutosize
        ref={textareaRef}
        value={block.content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className={textareaClasses}
        placeholder={block.type === 'p' && index === 0 ? "Type '/' for commands" : ""}
      />
    </div>
  );
}
