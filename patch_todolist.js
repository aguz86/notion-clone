import fs from 'fs';
let code = fs.readFileSync('src/components/TodoList.tsx', 'utf8');

code = code.replace(
  "import { CheckSquare, Square, Trash2, Plus, Calendar } from 'lucide-react';",
  "import { CheckSquare, Square, Trash2, Plus, Calendar, Pin } from 'lucide-react';"
);

code = code.replace(
  `  const updateDueDate = (id: string, dueDate: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, dueDate } : t));
  };`,
  `  const updateDueDate = (id: string, dueDate: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, dueDate } : t));
  };

  const togglePin = (id: string) => {
    onChange(tasks.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };`
);

code = code.replace(
  `  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });`,
  `  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });`
);

code = code.replace(
  `            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </button>`,
  `            <div className="flex items-center gap-2 transition-opacity">
              <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                <Calendar size={14} className="text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={task.dueDate || ''}
                  onChange={(e) => updateDueDate(task.id, e.target.value)}
                  className="bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={() => togglePin(task.id)}
                className={\`p-1.5 rounded transition-colors \${task.pinned ? 'text-purple-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}\`}
                title={task.pinned ? 'Unpin task' : 'Pin task'}
              >
                <Pin size={16} className={task.pinned ? 'fill-current' : ''} />
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>`
);

fs.writeFileSync('src/components/TodoList.tsx', code);
