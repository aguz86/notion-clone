import React, { useState } from 'react';
import { Project, TaskStatus } from '../types';
import { LayoutDashboard, Target, Activity, Clock, CheckCircle2, ChevronRight, Wallet, Plus } from 'lucide-react';
import BulkDeleteModal from './BulkDeleteModal';

interface ProjectDashboardProps {
  projects: Project[];
  onProjectSelect: (id: string) => void;
  onAddProject: () => void;
  onDeleteAllProjects?: () => void;
  onBulkDeleteProjects?: (selectedIds: string[]) => void;
}

export default function ProjectDashboard({ projects, onProjectSelect, onAddProject, onDeleteAllProjects, onBulkDeleteProjects }: ProjectDashboardProps) {
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteInitialSelected, setBulkDeleteInitialSelected] = useState<string[]>([]);
  const getProjectProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'Done').length;
    return Math.round((done / project.tasks.length) * 100);
  };

  const getOverallStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalBudget = 0;
    let totalSpent = 0;
    
    projects.forEach(p => {
      totalTasks += p.tasks.length;
      completedTasks += p.tasks.filter(t => t.status === 'Done').length;
      totalBudget += p.budget || 0;
      totalSpent += p.budgetSpent || 0;
    });

    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return { totalTasks, completedTasks, activeProjects, overallProgress, totalBudget, totalSpent };
  };

  const stats = getOverallStats();
  const formatCurrency = (amount: number = 0) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', compactDisplay: 'short' }).format(amount);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 md:p-12 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8 mt-4 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <LayoutDashboard size={24} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#37352f] dark:text-white">Workspace Overview</h1>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white dark:bg-gray-800 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 flex items-center gap-2"><Target size={16}/> Total Projects</div>
            <div className="text-3xl font-bold text-[#37352f] dark:text-white">{projects.length}</div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white dark:bg-gray-800 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Active Now</div>
            <div className="text-3xl font-bold text-[#37352f] dark:text-white">{stats.activeProjects}</div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white dark:bg-gray-800 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Tasks Done</div>
            <div className="text-3xl font-bold text-[#37352f] dark:text-white">
              {stats.completedTasks} <span className="text-lg text-gray-400 font-normal">/ {stats.totalTasks}</span>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white dark:bg-gray-800 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 flex items-center gap-2"><Wallet size={16} className="text-purple-500"/> Est. Budget</div>
            <div className="text-3xl font-bold text-[#37352f] dark:text-white">{formatCurrency(stats.totalBudget)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#37352f] dark:text-white">Active Projects</h2>
          <div className="flex items-center gap-2">
            {projects.length > 0 && onBulkDeleteProjects && (
              <button 
                onClick={() => {
                  setBulkDeleteInitialSelected(projects.map(p => p.id));
                  setIsBulkDeleteModalOpen(true);
                }}
                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Hapus...
              </button>
            )}
            <button 
              onClick={onAddProject}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus size={16} /> Tambah Projek
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => {
            const progress = getProjectProgress(project);
            return (
              <div 
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className="group border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md cursor-pointer transition-all hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] dark:bg-gray-700 flex items-center justify-center text-xl shadow-sm transition-colors">
                      {project.icon || '🎯'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#37352f] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title || 'Untitled Project'}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {project.status}
                        </span>
                        {project.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock size={12}/> 
                            {new Date(project.dueDate).toLocaleDateString()}
                            {(() => {
                              const daysLeft = Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return (
                                <span className={`ml-1 ${daysLeft < 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-orange-500' : ''}`}>
                                  ({daysLeft < 0 ? 'Telat ' + Math.abs(daysLeft) : daysLeft} hari)
                                </span>
                              );
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </p>

                {(project.totalEstimatedHours || project.estimatedHoursPerDay) && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    {project.estimatedHoursPerDay && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-blue-500" />
                        <span>Alokasi: <b>{project.estimatedHoursPerDay} jam</b>/hari</span>
                      </div>
                    )}
                    {project.totalEstimatedHours && (
                      <div className="flex items-center gap-1">
                        <Target size={12} className="text-purple-500" />
                        <span>Total: <b>{project.totalEstimatedHours} jam</b></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span>Progress</span>
                    <span className={progress === 100 ? 'text-green-600 dark:text-green-400 font-bold' : ''}>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                    <div 
                      className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {projects.length === 0 && (
            <div className="col-span-2 p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              No projects yet. Create your first project from the sidebar.
            </div>
          )}
        </div>
      </div>
      
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        items={projects}
        getItemId={(p) => p.id}
        renderItem={(p) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">{p.icon || '🎯'}</span>
            <span className="font-medium">{p.title || 'Untitled Project'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 ml-auto">
              {p.status}
            </span>
          </div>
        )}
        onDelete={(ids) => onBulkDeleteProjects?.(ids)}
        title="Hapus Projek"
        initialSelectedIds={bulkDeleteInitialSelected}
      />
    </div>
  );
}
