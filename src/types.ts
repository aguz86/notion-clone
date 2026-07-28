export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'ul' | 'todo';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // For todo blocks
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  coverImage?: string;
  blocks: Block[];
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Client';
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks?: Subtask[];
  assignees?: string[];
  dueDate?: string;
  timeSpent?: number; // in minutes
  estimatedTime?: number; // in minutes
}

export interface Project {
  id: string;
  folderId?: string;
  title: string;
  description: string;
  status: ProjectStatus;
  dueDate?: string;
  startDate?: string;
  icon?: string;
  coverImage?: string;
  tasks: Task[];
  budget?: number;
  budgetSpent?: number;
  totalEstimatedHours?: number;
  estimatedHoursPerDay?: number;
  pinned?: boolean;
}

export interface Folder {
  id: string;
  name: string;
}

export interface PersonalTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  pinned?: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  pinned?: boolean;
}

export interface BookmarkId {
  id: string;
  title: string;
  value: string;
  category: string;
  pinned?: boolean;
}

export type ViewType = 'dashboard' | 'project' | 'page' | 'todolist' | 'calculator' | 'bookmarks' | 'bookmark-id' | 'notifications';
export type ProjectViewMode = 'kanban' | 'list' | 'calendar';

