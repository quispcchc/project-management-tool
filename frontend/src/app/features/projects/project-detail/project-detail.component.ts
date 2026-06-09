import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  ArrowLeft,
  CalendarDays,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  X
} from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

type ProjectMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  roleInProject: string;
  responsibility?: string;
  allocation?: number;
};

type ProjectTask = {
  id: string;
  title: string;
  assignee?: string;
  status: string;
  priority: string;
  dueDate?: string;
};

type ProjectDetail = {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  requirements?: string;
  status: string;
  displayStatus?: string;
  priority?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  members: ProjectMember[];
  tasks: ProjectTask[];
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  readonly ArrowLeftIcon = ArrowLeft;
  readonly CalendarIcon = CalendarDays;
  readonly UsersIcon = Users;
  readonly CheckIcon = CheckCircle2;
  readonly AlertIcon = AlertTriangle;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly XIcon = X;

  loading = signal(false);
  error = signal('');
  project = signal<ProjectDetail | null>(null);
  users = signal<User[]>([]);
  isMemberModalOpen = signal(false);
  savingMember = signal(false);

  memberForm = this.fb.group({
    userId: ['', Validators.required],
    roleInProject: ['', Validators.required],
    responsibility: [''],
    allocation: [100, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  ngOnInit(): void {
    this.loadProject();
    this.loadUsers();
  }

  loadProject(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Project id is missing.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.projectService.getProject(id).subscribe({
      next: project => {
        this.project.set(project as unknown as ProjectDetail);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load project.');
        this.loading.set(false);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: users => this.users.set(users),
      error: () => this.error.set('Unable to load users.')
    });
  }

  openMemberModal(): void {
    this.memberForm.reset({
      userId: '',
      roleInProject: '',
      responsibility: '',
      allocation: 100
    });

    this.isMemberModalOpen.set(true);
  }

  closeMemberModal(): void {
    this.isMemberModalOpen.set(false);
  }

  addMember(): void {
    const project = this.project();

    if (!project) return;

    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    this.savingMember.set(true);

    this.projectService.addMember(project.id, this.memberForm.value).subscribe({
      next: () => {
        this.savingMember.set(false);
        this.closeMemberModal();
        this.loadProject();
      },
      error: () => {
        this.savingMember.set(false);
        this.error.set('Unable to add member.');
      }
    });
  }

  removeMember(member: ProjectMember): void {
    const project = this.project();

    if (!project) return;

    const confirmed = confirm(`Remove ${member.name} from this project?`);
    if (!confirmed) return;

    this.projectService.removeMember(project.id, member.id).subscribe({
      next: () => this.loadProject(),
      error: () => this.error.set('Unable to remove member.')
    });
  }

  getInitials(name?: string): string {
    if (!name) return 'U';

    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getTaskStatusClass(status: string): string {
    const classes: Record<string, string> = {
      TODO: 'bg-slate-100 text-slate-700',
      IN_PROGRESS: 'bg-teal-50 text-teal-700',
      REVIEW: 'bg-orange-50 text-orange-700',
      DONE: 'bg-emerald-50 text-emerald-700',
      BLOCKED: 'bg-red-50 text-red-700'
    };

    return classes[status] || 'bg-slate-100 text-slate-700';
  }

  getPriorityClass(priority?: string): string {
    const normalizedPriority = priority || 'LOW';

    const classes: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-50 text-orange-700',
      MEDIUM: 'bg-teal-50 text-teal-700',
      LOW: 'bg-slate-100 text-slate-700'
    };

    return classes[normalizedPriority] || classes['LOW'];
  }
}
