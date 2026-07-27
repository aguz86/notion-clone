import React from 'react';
import { Project, PersonalTask } from '../types';
import { Bell, AlertCircle, Clock, CheckSquare } from 'lucide-react';

interface NotificationListProps {
  projects: Project[];
  personalTasks: PersonalTask[];
}

export default function NotificationList({ projects, personalTasks }: NotificationListProps) {
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = [];

    // Personal tasks
    personalTasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < today) {
          overdue.push({
            id: task.id,
            title: task.title,
            dueDate: task.dueDate,
            type: 'Personal Task',
            source: 'To-do List'
          });
        }
      }
    });

    // Project tasks
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.status !== 'Done' && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          if (dueDate < today) {
            overdue.push({
              id: task.id,
              title: task.title,
              dueDate: task.dueDate,
              type: 'Project Task',
              source: project.title
            });
          }
        }
      });
    });

    return overdue.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const overdueTasks = getOverdueTasks();

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl mx-auto w-full text-[#37352f] dark:text-gray-200">
      <div className="flex items-center mb-6">
        <Bell size={32} className="mr-4 text-red-500" />
        <h1 className="text-4xl font-bold">Notifications</h1>
      </div>
      
      <div className="mb-8 text-gray-500 dark:text-gray-400">
        Tugas dan to-do list yang telah melewati batas waktu (overdue).
      </div>

      <div className="space-y-4">
        {overdueTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada tugas yang terlambat.</p>
            <p className="text-sm mt-1">Semua tugas Anda sudah selesai atau masih dalam batas waktu.</p>
          </div>
        ) : (
          overdueTasks.map(task => (
            <div 
              key={`${task.type}-${task.id}`}
              className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl"
            >
              <div className="mt-1">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs font-medium border border-gray-200 dark:border-gray-700">
                      {task.type}
                    </span>
                    {task.source}
                  </span>
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                    <Clock size={14} />
                    {new Date(task.dueDate).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
