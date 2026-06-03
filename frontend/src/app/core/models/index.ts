export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'TEAM_MEMBER';
export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  ownerId: string;
  owner?: Partial<User>;
  notes?: string;
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user?: Partial<User>;
  roleInProject: string;
  responsibility?: string;
  allocation: number;
  isActive: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  project?: Partial<Project>;
  title: string;
  description?: string;
  assignedId?: string;
  assignedTo?: Partial<User>;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdDate: string;
  updatedDate: string;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  project?: { name: string };
  userId: string;
  user: { name: string };
  action: string;
  details?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingTasks: number;
  overdueTasks: number;
  completedThisWeek: number;
}
