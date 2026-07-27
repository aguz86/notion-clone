import React, { useState } from 'react';
import { PersonalTask } from '../types';
import { CheckSquare, Square, Trash2, Plus, Calendar } from 'lucide-react';
import { generateId } from '../utils';
import BulkDeleteModal from './BulkDeleteModal';

interface TodoListProps {
  tasks: PersonalTask[];
  onChange: (tasks: PersonalTask[]) => void;
}

export default function TodoList({ tasks, onChange }: TodoListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteInitialSelected, setBulkDeleteInitialSelected] = useState<string[]>([]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) return;
    
    const newTask: PersonalTask = {
      id: generateId(),
      title: newTaskTitle,
      completed: false,
      dueDate: newTaskDueDate
    };
    
    onChange([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const toggleTask = (id: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTitle = (id: string, title: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const updateDueDate = (id: string, dueDate: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, dueDate } : t));
  };

  const deleteTask = (id: string) => {
    onChange(tasks.filter(t => t.id !== id));
  };

  const deleteCompletedTasks = () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    setBulkDeleteInitialSelected(completedIds);
    setIsBulkDeleteModalOpen(true);
  };

  const deleteAllTasks = () => {
    const allIds = tasks.map(t => t.id);
    setBulkDeleteInitialSelected(allIds);
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDelete = (selectedIds: string[]) => {
    const idsToDelete = new Set(selectedIds);
    onChange(tasks.filter(t => !idsToDelete.has(t.id)));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = tasks.length - completedCount;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Ensure current page is valid when tasks are deleted
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl mx-auto w-full text-[#37352f] dark:text-gray-200">
      <div className="group relative flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-4xl font-bold px-3 py-1 outline-none w-full bg-transparent">
          Personal Tasks
        </h1>
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 px-3 shrink-0">
            {completedCount > 0 && (
              <button 
                onClick={deleteCompletedTasks}
                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Hapus Selesai
              </button>
            )}
            <button 
              onClick={deleteAllTasks}
              className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>
      
      <div className="px-3 mb-6 text-gray-500 dark:text-gray-400">
        Keep track of your personal to-dos and activities outside of projects.
      </div>

      <div className="px-3 mb-8 flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/50">
          <CheckSquare size={16} />
          <span>Selesai: {completedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
          <Square size={16} />
          <span>Belum Selesai: {uncompletedCount}</span>
        </div>
      </div>
      
      <form onSubmit={addTask} className="px-3 mb-8">
        <div className="flex flex-col md:flex-row gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex items-center">
            <Plus size={20} className="text-gray-400 ml-2 mr-3" />
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-transparent border-none outline-none text-[#37352f] dark:text-gray-200"
            />
          </div>
          <div className="flex items-center gap-2 px-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-2 md:pt-0">
            <input
              type="datetime-local"
              required
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="bg-transparent text-sm text-[#37352f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-1">
        {paginatedTasks.map(task => (
          <div 
            key={task.id} 
            className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors border ${
              task.completed 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-900/40' 
                : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'
            }`}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="text-gray-400 hover:text-green-500 transition-colors shrink-0"
            >
              {task.completed ? <CheckSquare size={20} className="text-green-500" /> : <Square size={20} />}
            </button>
            
            <input
              type="text"
              value={task.title}
              onChange={(e) => updateTitle(task.id, e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none font-medium ${
                task.completed ? 'text-gray-400 line-through' : 'text-[#37352f] dark:text-gray-200'
              }`}
            />

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                <Calendar size={14} className="text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={task.dueDate || ''}
                  onChange={(e) => updateDueDate(task.id, e.target.value)}
                  className="bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>No personal tasks yet.</p>
            <p className="text-sm mt-1">Add tasks above to keep track of your daily activities.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        items={tasks}
        getItemId={(t) => t.id}
        renderItem={(t) => (
          <div className="flex items-center gap-2">
            <span className={t.completed ? "line-through text-gray-400" : ""}>{t.title}</span>
            {t.dueDate && <span className="text-xs text-gray-500">({new Date(t.dueDate).toLocaleDateString('id-ID')})</span>}
          </div>
        )}
        onDelete={handleBulkDelete}
        title="Hapus Personal Tasks"
        initialSelectedIds={bulkDeleteInitialSelected}
      />
    </div>
  );
}
