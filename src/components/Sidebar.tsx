import React from 'react';
import { File, Plus, Settings, Search, LayoutDashboard, Target, Trash2, Moon, Sun, Download, Upload, CheckSquare, Calculator, Bookmark, Bell } from 'lucide-react';
import { Page, Project, ViewType } from '../types';

interface SidebarProps {
  pages: Page[];
  projects: Project[];
  activeId: string;
  activeView: ViewType;
  onSelect: (view: ViewType, id: string) => void;
  onAddPage: () => void;
  onAddProject: () => void;
  onDeletePage: (id: string) => void;
  onDeleteProject: (id: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenSearch?: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  overdueCount?: number;
  onExport?: () => void;
  onImport?: () => void;
}

export default function Sidebar({ 
  pages, projects, activeId, activeView, onSelect, onAddPage, onAddProject, onDeletePage, onDeleteProject, darkMode, onToggleDarkMode, onOpenSearch, canInstall, onInstall, overdueCount = 0, onExport, onImport
}: SidebarProps) {
  return (
    <div className="w-64 bg-[#F7F7F5] dark:bg-gray-900 h-full flex flex-col border-r border-gray-200 dark:border-gray-800 text-[#37352f] dark:text-gray-200 overflow-hidden transition-colors">
      {/* Workspace header */}
      <div className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between group transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            W
          </div>
          <span className="font-medium text-sm truncate">User's Workspace</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-2 py-2 mb-2">
        <button 
          onClick={() => onSelect('dashboard', '')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeView === 'dashboard' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md mt-1 transition-colors"
        >
          <Search size={16} />
          <span>Search</span>
          <span className="ml-auto text-[10px] uppercase border border-gray-300 dark:border-gray-600 rounded px-1">Ctrl K</span>
        </button>
        <button 
          onClick={() => onSelect('todolist', '')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md mt-1 transition-colors ${
            activeView === 'todolist' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <CheckSquare size={16} />
          <span>To-do List</span>
        </button>
        <button 
          onClick={() => onSelect('calculator', '')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md mt-1 transition-colors ${
            activeView === 'calculator' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Calculator size={16} />
          <span>ROI Calculator</span>
        </button>
        <button 
          onClick={() => onSelect('bookmarks', '')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md mt-1 transition-colors ${
            activeView === 'bookmarks' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Bookmark size={16} />
          <span>Bookmark Link</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {/* Projects Section */}
        <div className="mb-6">
          <div className="group flex items-center justify-between px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
            <span>Projects</span>
            <button onClick={onAddProject} className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 transition-opacity">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-[1px]">
            {projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelect('project', project.id)}
                className={`group flex items-center justify-between px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                  activeView === 'project' && activeId === project.id ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="shrink-0">{project.icon || <Target size={16} />}</span>
                  <span className="truncate">{project.title || 'Untitled Project'}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  title="Delete project"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pages Section */}
        <div>
          <div className="group flex items-center justify-between px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
            <span>Docs</span>
            <button onClick={onAddPage} className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 transition-opacity">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-[1px]">
            {pages.map((page) => (
              <div 
                key={page.id}
                onClick={() => onSelect('page', page.id)}
                className={`group flex items-center justify-between px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                  activeView === 'page' && activeId === page.id ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="shrink-0">{page.icon || <File size={16} />}</span>
                  <span className="truncate">{page.title || 'Untitled'}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(page.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  title="Delete page"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        {canInstall && (
          <button 
            onClick={onInstall}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors mb-1"
          >
            <Download size={16} />
            <span>Install App</span>
          </button>
        )}
        <div className="flex gap-1 mb-1">
          {onExport && (
            <button 
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
              title="Backup (Export)"
            >
              <Download size={16} />
            </button>
          )}
          {onImport && (
            <button 
              onClick={onImport}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
              title="Restore (Import)"
            >
              <Upload size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onSelect('notifications', '')}
            className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${activeView === 'notifications' ? 'bg-black/5 dark:bg-white/10 font-medium text-[#37352f] dark:text-gray-200' : overdueCount > 0 ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
            title="Notifications"
          >
            <Bell size={16} />
            {overdueCount > 0 && (
              <span className="absolute top-1.5 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button 
            onClick={onToggleDarkMode}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

