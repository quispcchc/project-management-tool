import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Briefcase,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Users,
  ArrowUpRight
} from 'lucide-angular';

type StatCard = {
  label: string;
  value: string;
  helper: string;
  icon: any;
};

type ProjectSummary = {
  id: number;
  name: string;
  owner: string;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  progress: number;
  dueDate: string;
};

type TaskSummary = {
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  readonly BriefcaseIcon = Briefcase;
  readonly CheckCircleIcon = CheckCircle2;
  readonly ClockIcon = Clock3;
  readonly AlertIcon = AlertTriangle;
  readonly UsersIcon = Users;
  readonly ArrowIcon = ArrowUpRight;

  stats: StatCard[] = [
    {
      label: 'Total Projects',
      value: '12',
      helper: '4 active this month',
      icon: Briefcase
    },
    {
      label: 'Completed Tasks',
      value: '86',
      helper: '18 completed this week',
      icon: CheckCircle2
    },
    {
      label: 'Pending Tasks',
      value: '24',
      helper: '7 need attention',
      icon: Clock3
    },
    {
      label: 'Team Members',
      value: '8',
      helper: 'Across all projects',
      icon: Users
    }
  ];

  projects: ProjectSummary[] = [
    {
      id: 1,
      name: 'Tax Clinic Booking System',
      owner: 'Al Haq',
      status: 'On Track',
      progress: 78,
      dueDate: 'Jun 28, 2026'
    },
    {
      id: 2,
      name: 'Sales Bot Platform',
      owner: 'Sindhura',
      status: 'At Risk',
      progress: 52,
      dueDate: 'Jul 12, 2026'
    },
    {
      id: 3,
      name: 'Internal Project Tracker',
      owner: 'Product Team',
      status: 'On Track',
      progress: 35,
      dueDate: 'Aug 05, 2026'
    }
  ];

  tasks: TaskSummary[] = [
    {
      title: 'Finalize project detail page UI',
      project: 'Internal Project Tracker',
      priority: 'High',
      dueDate: 'Today'
    },
    {
      title: 'Add backend API for task status update',
      project: 'Project Manager',
      priority: 'Medium',
      dueDate: 'Tomorrow'
    },
    {
      title: 'Review dashboard metrics',
      project: 'Reports Module',
      priority: 'Low',
      dueDate: 'This week'
    }
  ];

  getStatusClass(status: ProjectSummary['status']): string {
    const classes = {
      'On Track': 'bg-teal-50 text-teal-700 ring-teal-600/20',
      'At Risk': 'bg-orange-50 text-orange-700 ring-orange-600/20',
      Delayed: 'bg-red-50 text-red-700 ring-red-600/20',
      Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    };

    return classes[status];
  }

  getPriorityClass(priority: TaskSummary['priority']): string {
    const classes = {
      High: 'bg-red-50 text-red-700',
      Medium: 'bg-amber-50 text-amber-700',
      Low: 'bg-slate-100 text-slate-700'
    };

    return classes[priority];
  }
}
