import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  Search,
  Filter,
  CalendarDays,
  Users,
  ArrowUpRight,
  Trash2,
  X
} from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

type ProjectStatus = 'Planning' | 'In Progress' | 'At Risk' | 'Completed';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly CalendarIcon = CalendarDays;
  readonly UsersIcon = Users;
  readonly ArrowIcon = ArrowUpRight;
  readonly TrashIcon = Trash2;
  readonly XIcon = X;

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  isCreateModalOpen = signal(false);

  searchTerm = signal('');
  selectedStatus = signal<'All' | ProjectStatus>('All');

  statuses: Array<'All' | ProjectStatus> = [
    'All',
    'Planning',
    'In Progress',
    'At Risk',
    'Completed'
  ];

  projects = signal<Project[]>([]);

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    clientName: [''],
    startDate: [''],
    endDate: [''],
    status: ['NOT_STARTED', Validators.required],
    priority: ['MEDIUM', Validators.required],
    notes: [''],
    requirements: ['']
  });

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.projects().filter(project => {
      const displayStatus = this.toDisplayStatus(project.displayStatus || project.status);

      const matchesSearch =
        project.name?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.owner?.toLowerCase().includes(term);

      const matchesStatus = status === 'All' || displayStatus === status;

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectService.getProjects().subscribe({
      next: projects => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load projects.');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.projectForm.reset({
      name: '',
      description: '',
      clientName: '',
      startDate: '',
      endDate: '',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      notes: '',
      requirements: ''
    });

    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  createProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.projectService.createProject(this.projectForm.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeCreateModal();
        this.loadProjects();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Unable to create project.');
      }
    });
  }

  deleteProject(project: Project): void {
    const confirmed = confirm(`Delete project "${project.name}"?`);

    if (!confirmed) return;

    this.projectService.deleteProject(String(project.id)).subscribe({
      next: () => {
        this.projects.update(items => items.filter(item => item.id !== project.id));
      },
      error: () => {
        this.error.set('Unable to delete project.');
      }
    });
  }

  setSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  setStatus(status: 'All' | ProjectStatus): void {
    this.selectedStatus.set(status);
  }

  toDisplayStatus(status: string): ProjectStatus {
    const map: Record<string, ProjectStatus> = {
      NOT_STARTED: 'Planning',
      IN_PROGRESS: 'In Progress',
      ON_HOLD: 'At Risk',
      COMPLETED: 'Completed',
      Planning: 'Planning',
      'In Progress': 'In Progress',
      'At Risk': 'At Risk',
      Completed: 'Completed'
    };

    return map[status] || 'Planning';
  }

  getStatusClass(status: string): string {
    const displayStatus = this.toDisplayStatus(status);

    const classes: Record<ProjectStatus, string> = {
      Planning: 'bg-slate-100 text-slate-700 ring-slate-600/20',
      'In Progress': 'bg-teal-50 text-teal-700 ring-teal-600/20',
      'At Risk': 'bg-orange-50 text-orange-700 ring-orange-600/20',
      Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    };

    return classes[displayStatus];
  }

  getPriorityClass(priority?: string): string {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 ring-red-600/20';

      case 'HIGH':
        return 'bg-orange-50 text-orange-700 ring-orange-600/20';

      case 'MEDIUM':
        return 'bg-teal-50 text-teal-700 ring-teal-600/20';

      case 'LOW':
        return 'bg-slate-100 text-slate-700 ring-slate-600/20';

      default:
        return 'bg-slate-100 text-slate-700 ring-slate-600/20';
    }
  }
}
