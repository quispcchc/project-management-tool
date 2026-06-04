export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'On Track'
  | 'At Risk'
  | 'Delayed'
  | 'Completed';

export type TaskStatus =
  | 'Todo'
  | 'In Progress'
  | 'Review'
  | 'Done';

export type Priority =
  | 'High'
  | 'Medium'
  | 'Low';

export type UserRole =
  | 'Admin'
  | 'Manager'
  | 'Member';

export type TeamMemberStatus =
  | 'Active'
  | 'Away'
  | 'Inactive';

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: number | string;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  members: number;
  tasks: number;
  dueDate: string;
}

export interface Task {
  id: number | string;
  title: string;
  description?: string;
  project?: string;
  projectId?: number | string;
  assignee: string;
  assigneeId?: number | string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export interface TeamMember {
  id: number | string;
  name: string;
  email: string;
  role: string;
  department: string;
  activeProjects: number;
  status: TeamMemberStatus;
  initials: string;
}

export interface ActivityLog {
  id: number | string;
  userId?: number | string;
  userName: string;
  action: string;
  entityType: 'Project' | 'Task' | 'User' | 'Team';
  entityName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  teamMembers: number;
}
