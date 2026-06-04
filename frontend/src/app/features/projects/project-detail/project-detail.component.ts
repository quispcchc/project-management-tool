import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus
} from 'lucide-angular';

type TaskStatus = 'Todo' | 'In Progress' | 'Done';
type Priority = 'High' | 'Medium' | 'Low';

type ProjectTask = {
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
};

type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
  readonly ArrowLeftIcon = ArrowLeft;
  readonly CalendarIcon = CalendarDays;
  readonly UsersIcon = Users;
  readonly CheckIcon = CheckCircle2;
  readonly ClockIcon = Clock3;
  readonly AlertIcon = AlertTriangle;
  readonly PlusIcon = Plus;

  project = {
    id: 1,
    name: 'Tax Clinic Booking System',
    description:
      'A multi-clinic appointment booking platform with scheduling, client eligibility flow, reschedule, cancellation, and admin dashboard.',
    owner: 'Al Haq',
    status: 'In Progress',
    progress: 78,
    startDate: 'May 01, 2026',
    dueDate: 'Jun 28, 2026',
    totalTasks: 42,
    completedTasks: 31,
    pendingTasks: 11
  };

  teamMembers: TeamMember[] = [
    { name: 'Al Haq', role: 'Project Manager', initials: 'AH' },
    { name: 'Sindhura', role: 'Frontend Developer', initials: 'SI' },
    { name: 'Naveen', role: 'Backend Developer', initials: 'NA' },
    { name: 'Priya', role: 'QA Analyst', initials: 'PR' }
  ];

  tasks: ProjectTask[] = [
    {
      title: 'Create project detail responsive UI',
      assignee: 'Sindhura',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Today'
    },
    {
      title: 'Connect project API with frontend',
      assignee: 'Naveen',
      status: 'Todo',
      priority: 'High',
      dueDate: 'Tomorrow'
    },
    {
      title: 'Test booking reschedule flow',
      assignee: 'Priya',
      status: 'Done',
      priority: 'Medium',
      dueDate: 'Jun 20'
    },
    {
      title: 'Prepare dashboard report cards',
      assignee: 'Al Haq',
      status: 'Todo',
      priority: 'Low',
      dueDate: 'This week'
    }
  ];

  updates = [
    {
      title: 'Frontend layout completed',
      description: 'Main layout, login screen, and project list page have been designed.',
      date: 'Today'
    },
    {
      title: 'Backend planning started',
      description: 'Project, task, user, and report APIs are being planned.',
      date: 'Yesterday'
    },
    {
      title: 'Initial requirements added',
      description: 'Project tracking, team members, task status, and reporting were added to scope.',
      date: 'Jun 18'
    }
  ];

  getTaskStatusClass(status: TaskStatus): string {
    const classes: Record<TaskStatus, string> = {
      Todo: 'bg-slate-100 text-slate-700',
      'In Progress': 'bg-blue-50 text-blue-700',
      Done: 'bg-emerald-50 text-emerald-700'
    };

    return classes[status];
  }

  getPriorityClass(priority: Priority): string {
    const classes: Record<Priority, string> = {
      High: 'bg-red-50 text-red-700',
      Medium: 'bg-amber-50 text-amber-700',
      Low: 'bg-slate-100 text-slate-700'
    };

    return classes[priority];
  }
}
