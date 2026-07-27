import React, { useState } from 'react';
import { Project, Task, TaskStatus, ProjectViewMode } from '../types';
import { generateId } from '../utils';
import { Plus, GripVertical, Trash2, Calendar as CalendarIcon, List, LayoutGrid, Clock, Wallet, CheckSquare, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import BulkDeleteModal from './BulkDeleteModal';

interface ProjectViewProps {
  project: Project;
  onChange: (project: Project) => void;
}

const COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

export default function ProjectView({ project, onChange }: ProjectViewProps) {
  const [viewMode, setViewMode] = useState<ProjectViewMode>('kanban');
  const [newTaskTitles, setNewTaskTitles] = useState<Record<TaskStatus, string>>({
    'Todo': '', 'In Progress': '', 'Done': ''
  });
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteInitialSelected, setBulkDeleteInitialSelected] = useState<string[]>([]);

  const getProgress = () => {
    if (project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'Done').length;
    return Math.round((done / project.tasks.length) * 100);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const columns = {
      'Todo': project.tasks.filter(t => t.status === 'Todo'),
      'In Progress': project.tasks.filter(t => t.status === 'In Progress'),
      'Done': project.tasks.filter(t => t.status === 'Done'),
    };

    const sourceCol = columns[sourceStatus];
    const destCol = columns[destStatus];

    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destStatus;
    destCol.splice(destination.index, 0, movedTask);

    const updatedTasks = [
      ...columns['Todo'],
      ...columns['In Progress'],
      ...columns['Done']
    ];

    onChange({ ...project, tasks: updatedTasks });
  };

  const addTask = (status: TaskStatus = 'Todo', title?: string) => {
    const taskTitle = title || newTaskTitles[status].trim();
    if (!taskTitle) return;
    const newTask: Task = {
      id: generateId(),
      title: taskTitle,
      status,
      subtasks: []
    };
    
    // Add to specific column by putting it at the end of the filtered list, then combining
    const columns = {
      'Todo': project.tasks.filter(t => t.status === 'Todo'),
      'In Progress': project.tasks.filter(t => t.status === 'In Progress'),
      'Done': project.tasks.filter(t => t.status === 'Done'),
    };
    
    columns[status].push(newTask);
    
    const updatedTasks = [
      ...columns['Todo'],
      ...columns['In Progress'],
      ...columns['Done']
    ];
    
    onChange({ ...project, tasks: updatedTasks });
    setNewTaskTitles(prev => ({ ...prev, [status]: '' }));
  };

  const deleteTask = (taskId: string) => {
    onChange({ ...project, tasks: project.tasks.filter(t => t.id !== taskId) });
  };

  const progress = getProgress();
  const formatCurrency = (amount: number = 0) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 transition-colors">
      {project.coverImage && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative group">
          <img src={project.coverImage} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onChange({ ...project, coverImage: undefined })}
              className="px-3 py-1 bg-white dark:bg-gray-800 text-sm font-medium rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition">
              Remove cover
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-12 py-8 md:py-12 pb-32">
        {/* Actions Header */}
        <div className="flex gap-4 mb-4 text-gray-400 text-sm opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity">
          {!project.icon && (
            <button onClick={() => onChange({ ...project, icon: '🎯' })} className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">
              Add icon
            </button>
          )}
          {!project.coverImage && (
            <button onClick={() => onChange({ ...project, coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop' })} className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">
              Add cover
            </button>
          )}
        </div>

        {/* Title and Metadata */}
        {project.icon && (
          <div className="text-6xl md:text-7xl mb-4">{project.icon}</div>
        )}
        
        <input
          type="text"
          value={project.title}
          onChange={(e) => onChange({ ...project, title: e.target.value })}
          placeholder="Project Title"
          className="w-full text-4xl md:text-5xl font-bold text-[#37352f] dark:text-white outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-6 bg-transparent"
        />

        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6 mb-8 p-4 bg-[#F7F7F5] dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20">Status</span>
            <select 
              value={project.status}
              onChange={(e) => onChange({ ...project, status: e.target.value as Project['status'] })}
              className="bg-transparent text-sm font-medium text-[#37352f] dark:text-gray-200 outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20">Due Date</span>
            <input 
              type="date" 
              value={project.dueDate || ''}
              onChange={(e) => onChange({ ...project, dueDate: e.target.value })}
              className="bg-transparent text-sm font-medium text-[#37352f] dark:text-gray-200 outline-none hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20"><Wallet size={16} className="inline mr-1" />Budget</span>
            <input 
              type="number" 
              value={project.budget || ''}
              onChange={(e) => onChange({ ...project, budget: Number(e.target.value) })}
              placeholder="0"
              className="bg-transparent text-sm font-medium text-[#37352f] dark:text-gray-200 outline-none hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded w-24"
            />
            {project.budget && (
              <span className="text-xs text-gray-400 ml-2">Spent: {formatCurrency(project.budgetSpent || 0)}</span>
            )}
          </div>

          <div className="flex-1 min-w-[200px] flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-[#37352f] dark:text-white w-10 text-right">{progress}%</span>
          </div>
        </div>

        <textarea
          value={project.description}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
          placeholder="Project description and goals..."
          className="w-full resize-none outline-none text-[#37352f] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 mb-10 text-lg bg-transparent"
          rows={3}
        />

        {/* View Toggles & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-[#37352f] dark:text-white flex items-center gap-2 mr-2">
              Task Board
            </h3>
            {project.tasks.filter(t => t.status === 'Done').length > 0 && (
              <button
                onClick={() => {
                  setBulkDeleteInitialSelected(project.tasks.filter(t => t.status === 'Done').map(t => t.id));
                  setIsBulkDeleteModalOpen(true);
                }}
                className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Hapus Selesai
              </button>
            )}
            {project.tasks.length > 0 && (
              <button
                onClick={() => {
                  setBulkDeleteInitialSelected(project.tasks.map(t => t.id));
                  setIsBulkDeleteModalOpen(true);
                }}
                className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Hapus Semua
              </button>
            )}
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">Kanban</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <List size={16} /> <span className="hidden sm:inline">List</span>
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <CalendarIcon size={16} /> <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
        </div>

        {/* Board Views */}
        {viewMode === 'kanban' && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {COLUMNS.map(column => (
                <Droppable key={column} droppableId={column}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-w-[300px] rounded-xl p-4 flex flex-col transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-[#F7F7F5] dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h4 className="font-semibold text-[#37352f] dark:text-gray-200">{column}</h4>
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {project.tasks.filter(t => t.status === column).length}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
                        {project.tasks.filter(t => t.status === column).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.9 : 1
                                }}
                                className={`group p-3 rounded-lg border flex flex-col gap-2 transition-all ${
                                  task.status === 'Done' ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-white dark:bg-gray-900'
                                } ${
                                  snapshot.isDragging 
                                    ? 'shadow-lg border-blue-400 rotate-1' 
                                    : task.status === 'Done' 
                                      ? 'shadow-sm border-green-200 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700' 
                                      : 'shadow-sm border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <GripVertical size={16} className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <span className="text-sm text-[#37352f] dark:text-gray-200 flex-1 leading-snug">{task.title}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTask(task.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 rounded transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                {(task.subtasks?.length || 0) > 0 && (
                                  <div className="pl-6 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <CheckSquare size={12} />
                                      {task.subtasks?.filter(s => s.completed).length}/{task.subtasks?.length}
                                    </div>
                                    {task.timeSpent && (
                                      <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Add Task Input */}
                        <div className="mt-2 group">
                          <input
                            type="text"
                            value={newTaskTitles[column]}
                            onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [column]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.nativeEvent.isComposing) addTask(column);
                            }}
                            placeholder="+ Add a task..."
                            className="w-full bg-transparent text-sm p-2 outline-none border border-transparent rounded hover:bg-black/5 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-400 focus:shadow-sm transition-all text-[#37352f] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}

        {viewMode === 'list' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-500 dark:text-gray-400">
              <div className="col-span-6">Task Name</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Due Date</div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {project.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${
                    task.status === 'Done' 
                      ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="col-span-6 font-medium text-[#37352f] dark:text-gray-200 flex items-center gap-2">
                    <CheckSquare size={16} className={task.status === 'Done' ? 'text-green-500' : 'text-gray-300'} />
                    {task.title}
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <select 
                      value={task.status}
                      onChange={(e) => {
                        const updated = project.tasks.map(t => t.id === task.id ? { ...t, status: e.target.value as TaskStatus } : t);
                        onChange({ ...project, tasks: updated });
                      }}
                      className="bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500">
                    <input 
                      type="date"
                      value={task.dueDate || ''}
                      onChange={(e) => {
                         const updated = project.tasks.map(t => t.id === task.id ? { ...t, dueDate: e.target.value } : t);
                         onChange({ ...project, tasks: updated });
                      }}
                      className="bg-transparent outline-none hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                    />
                  </div>
                </div>
              ))}
              <div className="p-4 group">
                 <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                        addTask('Todo', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    placeholder="+ Add a new task..."
                    className="w-full bg-transparent text-sm p-2 outline-none border border-transparent rounded hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-400 focus:shadow-sm transition-all text-[#37352f] dark:text-gray-200 placeholder-gray-500"
                  />
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'calendar' && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium text-[#37352f] dark:text-gray-200 mb-2">Calendar View</h4>
            <p className="text-sm max-w-md mx-auto">Tasks with due dates will appear here. Set due dates in the List view or task details.</p>
          </div>
        )}

      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        items={project.tasks}
        getItemId={(t) => t.id}
        renderItem={(t) => (
          <div className="flex items-center gap-2">
            <span className={t.status === 'Done' ? "line-through text-gray-400" : ""}>{t.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
              t.status === 'Done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              t.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {t.status}
            </span>
          </div>
        )}
        onDelete={(selectedIds) => {
          const idsToDelete = new Set(selectedIds);
          onChange({ ...project, tasks: project.tasks.filter(t => !idsToDelete.has(t.id)) });
        }}
        title="Hapus Tasks"
        initialSelectedIds={bulkDeleteInitialSelected}
      />
      </div>
    </div>
  );
}
