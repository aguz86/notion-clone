/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Page, Project, ViewType, TaskStatus, Bookmark, BookmarkId } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectView from './components/ProjectView';
import TodoList from './components/TodoList';
import ROICalculator from './components/ROICalculator';
import BookmarkList from './components/BookmarkList';
import BookmarkIdList from './components/BookmarkIdList';
import NotificationList from './components/NotificationList';
import AddProjectModal from './components/AddProjectModal';
import Login from './components/Login';
import { generateId } from './utils';
import { Search as SearchIcon, X, Bell } from 'lucide-react';
import { supabase } from './supabase';

const INITIAL_PAGES: Page[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '🚀',
    blocks: [
      { id: 'b1', type: 'h1', content: 'Welcome to your Workspace' },
      { id: 'b2', type: 'p', content: 'This workspace combines Notion-style docs with Project tracking.' },
      { id: 'b3', type: 'h2', content: 'Features' },
      { id: 'b4', type: 'ul', content: 'Block-based editing' },
      { id: 'b5', type: 'ul', content: 'Kanban boards and progress tracking' },
      { id: 'b6', type: 'ul', content: 'Multi-project dashboards' },
      { id: 'b7', type: 'todo', content: 'Create a new project from the sidebar', checked: false },
    ]
  }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Website Redesign',
    description: 'Overhaul the main landing page and pricing tier pages for better conversion.',
    icon: '🎨',
    status: 'In Progress',
    dueDate: '2026-08-15',
    budget: 5000000,
    budgetSpent: 1500000,
    tasks: [
      { id: 't1', title: 'Design new hero section', status: 'Done', timeSpent: 120 },
      { id: 't2', title: 'Implement dark mode', status: 'In Progress', subtasks: [{ id: 's1', title: 'Update CSS', completed: true }, { id: 's2', title: 'Update components', completed: false }] },
      { id: 't3', title: 'Update pricing table', status: 'Todo' },
      { id: 't4', title: 'QA and Testing', status: 'Todo' }
    ]
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('notion_clone_pages');
    return saved ? JSON.parse(saved) : INITIAL_PAGES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('notion_clone_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [personalTasks, setPersonalTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem('notion_clone_personal_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('notion_clone_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkIds, setBookmarkIds] = useState<BookmarkId[]>(() => {
    const saved = localStorage.getItem('notion_clone_bookmark_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [activeId, setActiveId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  
  // Theme and Search state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // PWA Install Prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      setShowInstallModal(true);
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Initial load from Supabase
  useEffect(() => {
    if (!isLoggedIn || !supabase) return;

    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', 'adminjp')
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error("Supabase read error:", error);
          }
          return;
        }

        if (data) {
          if (data.projects && data.projects.length > 0) {
            setProjects(prev => JSON.stringify(prev) === JSON.stringify(data.projects) ? prev : data.projects);
          }
          if (data.pages && data.pages.length > 0) {
            setPages(prev => JSON.stringify(prev) === JSON.stringify(data.pages) ? prev : data.pages);
          }
          if (data.personal_tasks && data.personal_tasks.length > 0) {
            setPersonalTasks(prev => JSON.stringify(prev) === JSON.stringify(data.personal_tasks) ? prev : data.personal_tasks);
          }
          if (data.bookmarks && data.bookmarks.length > 0) {
            setBookmarks(prev => JSON.stringify(prev) === JSON.stringify(data.bookmarks) ? prev : data.bookmarks);
          }
        }
      } catch (e) {
        console.error("Supabase load exception:", e);
      }
    };

    loadData();
  }, [isLoggedIn]);

  // Save to LocalStorage and sync to Supabase
  useEffect(() => {
    localStorage.setItem('notion_clone_pages', JSON.stringify(pages));
    localStorage.setItem('notion_clone_projects', JSON.stringify(projects));
    localStorage.setItem('notion_clone_personal_tasks', JSON.stringify(personalTasks));
    localStorage.setItem('notion_clone_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('notion_clone_bookmark_ids', JSON.stringify(bookmarkIds));

    if (!isLoggedIn || !supabase) return;

    const timeoutId = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('workspaces')
          .upsert({ 
            id: 'adminjp', 
            pages, 
            projects, 
            personal_tasks: personalTasks, 
            bookmarks 
          });
        
        if (error) {
          console.warn("Supabase write error:", error);
        }
      } catch (e) {
        console.warn("Supabase write exception:", e);
      }
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(timeoutId);
  }, [pages, projects, personalTasks, bookmarks, isLoggedIn]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getOverdueCount = () => {
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    personalTasks.forEach(task => {
      if (!task.completed && task.dueDate && new Date(task.dueDate) < today) count++;
    });

    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.status !== 'Done' && task.dueDate && new Date(task.dueDate) < today) count++;
      });
    });

    return count;
  };

  const overdueCount = getOverdueCount();

  const handleSelect = (view: ViewType, id: string) => {
    setActiveView(view);
    setActiveId(id);
    setSearchOpen(false);
  };

  const handleAddPage = () => {
    const newPage: Page = {
      id: generateId(),
      title: '',
      icon: '📄',
      blocks: [{ id: generateId(), type: 'p', content: '' }]
    };
    setPages([...pages, newPage]);
    handleSelect('page', newPage.id);
  };

  const handleAddProject = () => {
    setIsAddProjectModalOpen(true);
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([...projects, newProject]);
    handleSelect('project', newProject.id);
  };

  const handleDeletePage = (id: string) => {
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (activeView === 'page' && activeId === id) {
      handleSelect('dashboard', '');
    }
  };

  const handleDeleteProject = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (activeView === 'project' && activeId === id) {
      handleSelect('dashboard', '');
    }
  };

  const handlePageChange = (updatedPage: Page) => {
    setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
  };

  const handleProjectChange = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleBulkDeleteProjects = (selectedIds: string[]) => {
    const idsToDelete = new Set(selectedIds);
    setProjects(projects.filter(p => !idsToDelete.has(p.id)));
    if (activeView === 'project' && idsToDelete.has(activeId)) {
      handleSelect('dashboard', '');
    }
  };

  const toggleProjectPin = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p));
  };

  const handleExport = () => {
    const data = {
      pages,
      projects,
      personalTasks,
      bookmarks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_notion_clone_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data.pages) setPages(data.pages);
          if (data.projects) setProjects(data.projects);
          if (data.personalTasks) setPersonalTasks(data.personalTasks);
          if (data.bookmarks) setBookmarks(data.bookmarks);
          alert('Data berhasil di-restore!');
        } catch (error) {
          console.error("Gagal parse file JSON", error);
          alert('Gagal me-restore data. File JSON tidak valid.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const renderContent = () => {
    if (activeView === 'dashboard') {
      return (
        <ProjectDashboard 
          projects={projects} 
          onProjectSelect={(id) => handleSelect('project', id)} 
          onAddProject={handleAddProject}
          onDeleteAllProjects={() => setProjects([])}
          onBulkDeleteProjects={handleBulkDeleteProjects}
        />
      );
    }
    
    if (activeView === 'project') {
      const activeProject = projects.find(p => p.id === activeId);
      if (activeProject) {
        return <ProjectView project={activeProject} onChange={handleProjectChange} />;
      }
    }

    if (activeView === 'page') {
      const activePage = pages.find(p => p.id === activeId);
      if (activePage) {
        return <Editor page={activePage} onChange={handlePageChange} />;
      }
    }

    if (activeView === 'todolist') {
      return <TodoList tasks={personalTasks} onChange={setPersonalTasks} />;
    }

    if (activeView === 'calculator') {
      return <ROICalculator />;
    }

    if (activeView === 'bookmarks') {
      return <BookmarkList bookmarks={bookmarks} onChange={setBookmarks} />;
    }

    if (activeView === 'bookmark-id') {
      return <BookmarkIdList bookmarks={bookmarkIds} onChange={setBookmarkIds} />;
    }

    if (activeView === 'notifications') {
      return <NotificationList projects={projects} personalTasks={personalTasks} />;
    }

    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Item not found or deleted.
      </div>
    );
  };

  // Search logic
  const searchResults = () => {
    if (!searchQuery.trim()) return { tasks: [], projects: [], pages: [] };
    const q = searchQuery.toLowerCase();
    
    const matchedTasks = projects.flatMap(p => 
      p.tasks.filter(t => t.title.toLowerCase().includes(q)).map(t => ({ ...t, projectName: p.title, projectId: p.id }))
    );
    const matchedProjects = projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const matchedPages = pages.filter(p => p.title.toLowerCase().includes(q));

    return { tasks: matchedTasks, projects: matchedProjects, pages: matchedPages };
  };

  const results = searchResults();

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-900 text-[#37352f] dark:text-gray-200 font-sans overflow-hidden relative transition-colors">
      <AddProjectModal 
        isOpen={isAddProjectModalOpen} 
        onClose={() => setIsAddProjectModalOpen(false)} 
        onAdd={handleProjectCreated} 
      />
      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <SearchIcon size={20} className="text-gray-400" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search projects, tasks, or docs..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-4 text-lg text-[#37352f] dark:text-gray-200"
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!searchQuery && <div className="p-8 text-center text-gray-400">Type something to search across your workspace...</div>}
              
              {searchQuery && results.tasks.length === 0 && results.projects.length === 0 && results.pages.length === 0 && (
                <div className="p-8 text-center text-gray-400">No results found for "{searchQuery}"</div>
              )}

              {results.tasks.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tasks</div>
                  {results.tasks.map(t => (
                    <div key={t.id} onClick={() => handleSelect('project', t.projectId)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer mx-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-medium text-[#37352f] dark:text-gray-200">{t.title}</div>
                        <div className="text-xs text-gray-500">in {t.projectName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {results.projects.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</div>
                  {results.projects.map(p => (
                    <div key={p.id} onClick={() => handleSelect('project', p.id)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer mx-1">
                      <span className="text-xl">{p.icon || '🎯'}</span>
                      <div className="font-medium text-[#37352f] dark:text-gray-200">{p.title || 'Untitled'}</div>
                    </div>
                  ))}
                </div>
              )}

              {results.pages.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Docs</div>
                  {results.pages.map(p => (
                    <div key={p.id} onClick={() => handleSelect('page', p.id)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer mx-1">
                      <span className="text-xl">{p.icon || '📄'}</span>
                      <div className="font-medium text-[#37352f] dark:text-gray-200">{p.title || 'Untitled'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-[#F7F7F5] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          pages={pages} 
          projects={projects}
          activeId={activeId}
          activeView={activeView}
          onSelect={(view, id) => {
            handleSelect(view, id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onAddPage={handleAddPage}
          onAddProject={handleAddProject}
          onDeletePage={handleDeletePage}
          onDeleteProject={handleDeleteProject}
          onReorderProjects={setProjects}
          onToggleProjectPin={toggleProjectPin}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenSearch={() => setSearchOpen(true)}
          canInstall={!!installPrompt}
          onInstall={handleInstallApp}
          overdueCount={overdueCount}
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-white dark:bg-gray-900 transition-colors">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="ml-3 font-medium text-sm truncate text-[#37352f] dark:text-gray-200">
              {activeView === 'dashboard' ? 'Dashboard' : 
               activeView === 'todolist' ? 'To-do List' :
               activeView === 'calculator' ? 'ROI Calculator' :
               activeView === 'bookmarks' ? 'Bookmark Link' :
               activeView === 'notifications' ? 'Notifications' :
               activeView === 'project' ? projects.find(p => p.id === activeId)?.title || 'Project' :
               activeView === 'page' ? pages.find(p => p.id === activeId)?.title || 'Page' : ''}
            </span>
          </div>
          <button 
            onClick={() => handleSelect('notifications', '')}
            className={`p-1.5 rounded-md relative ${overdueCount > 0 ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Bell size={20} />
            {overdueCount > 0 && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {renderContent()}
      </div>
      
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cara Install Aplikasi</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Untuk menginstal aplikasi ini ke layar utama Anda:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="font-bold">iOS (Safari):</span> 
                <span>Ketuk ikon <b>Share</b> di menu bawah, lalu pilih <b>"Add to Home Screen"</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">Android (Chrome):</span> 
                <span>Ketuk menu titik tiga di kanan atas, lalu pilih <b>"Install app"</b> atau <b>"Add to Home screen"</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">Desktop:</span> 
                <span>Klik ikon install (layar dengan tanda panah ke bawah) di ujung kanan address bar browser Anda.</span>
              </li>
            </ul>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
              >
                Buka di Tab Baru (Disarankan)
              </button>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

