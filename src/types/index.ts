
// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Task related types
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  lists: List[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  githubRepo?: string;
}

// GitHub related types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}
