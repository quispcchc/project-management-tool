import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  Search,
  Filter,
  CalendarDays,
  Users,
  ArrowUpRight
} from 'lucide-angular';

type ProjectStatus = 'Planning' | 'In Progress' | 'At Risk' | 'Completed';

type Project = {
  id: number;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  members: number;
  tasks: number;
  dueDate: string;
};

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly CalendarIcon = CalendarDays;
  readonly UsersIcon = Users;
  readonly ArrowIcon = ArrowUpRight;

  searchTerm = signal('');
  selectedStatus = signal<'All' | ProjectStatus>('All');

  statuses: Array<'All' | ProjectStatus> = [
    'All',
    'Planning',
    'In Progress',
    'At Risk',
    'Completed'
  ];

  projects = signal<Project[]>([
    {
      id: 1,
      name: 'Tax Clinic Booking System',
      description: 'Multi-clinic appointment booking, scheduling, reschedule, and cancellation system.',
      owner: 'Al Haq',
      status: 'In Progress',
      progress: 78,
      members: 5,
      tasks: 42,
      dueDate: 'Jun 28, 2026'
    },
    {
      id: 2,
      name: 'Sales Bot Platform',
      description: 'AI-powered WhatsApp sales assistant with product knowledge and lead capture.',
      owner: 'Sindhura',
      status: 'At Risk',
      progress: 52,
      members: 3,
      tasks: 26,
      dueDate: 'Jul 12, 2026'
    },
    {
      id: 3,
      name: 'Project Management',
      description: 'Internal project management tool for tracking projects, teams, tasks, and reports.',
      owner: 'Product Team',
      status: 'Planning',
      progress: 35,
      members: 4,
      tasks: 19,
      dueDate: 'Aug 05, 2026'
    },
    {
      id: 4,
      name: 'Reports Dashboard',
      description: 'Executive reporting module with project health, workload, and completion trends.',
      owner: 'Analytics Team',
      status: 'Completed',
      progress: 100,
      members: 2,
      tasks: 16,
      dueDate: 'May 20, 2026'
    }
  ]);

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.projects().filter(project => {
      const matchesSearch =
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term);

      const matchesStatus = status === 'All' || project.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  setSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  setStatus(status: 'All' | ProjectStatus): void {
    this.selectedStatus.set(status);
  }

  getStatusClass(status: ProjectStatus): string {
    const classes: Record<ProjectStatus, string> = {
      Planning: 'bg-slate-100 text-slate-700 ring-slate-600/20',
      'In Progress': 'bg-blue-50 text-blue-700 ring-blue-600/20',
      'At Risk': 'bg-amber-50 text-amber-700 ring-amber-600/20',
      Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    };

    return classes[status];
  }
}
