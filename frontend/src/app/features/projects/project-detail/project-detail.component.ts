import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Briefcase, Users, CheckSquare, Clock, FileText, Activity } from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div *ngIf="project" class="space-y-6">
      <div class="flex items-center space-x-4">
        <a routerLink="/projects" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm">
          <lucide-icon [name]="BackIcon" class="w-5 h-5"></lucide-icon>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ project.name }}</h1>
          <div class="flex items-center mt-1 space-x-3 text-sm">
            <span [class]="'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + getStatusClass(project.status)">
              {{ project.status.replace('_', ' ') }}
            </span>
            <span class="text-slate-500">Created {{ project.createdAt | date }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center space-x-1 border-b border-slate-200">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab.id"
          [class]="'px-4 py-2 text-sm font-medium border-b-2 transition-colors ' + (activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')">
          <div class="flex items-center space-x-2">
            <lucide-icon [name]="tab.icon" class="w-4 h-4"></lucide-icon>
            <span>{{ tab.label }}</span>
          </div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- Overview Tab -->
          <div *ngIf="activeTab === 'overview'" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
            <section>
              <h3 class="text-lg font-bold text-slate-900 mb-3">Description</h3>
              <p class="text-slate-600 leading-relaxed">{{ project.description || 'No description provided.' }}</p>
            </section>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Project Info</h3>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Client</span>
                    <span class="font-medium text-slate-900">{{ project.clientName || 'Internal' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Manager</span>
                    <span class="font-medium text-slate-900">{{ project.owner?.name }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Priority</span>
                    <span [class]="'font-bold ' + getPriorityColor(project.priority)">{{ project.priority }}</span>
                  </div>
                </div>
              </section>
              <section>
                <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Timeline</h3>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Start Date</span>
                    <span class="font-medium text-slate-900">{{ project.startDate | date }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Target End Date</span>
                    <span class="font-medium text-slate-900">{{ project.endDate | date }}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Tasks Tab (Simple list) -->
          <div *ngIf="activeTab === 'tasks'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Task</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Assigned</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Due</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr *ngFor="let task of project.tasks" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-slate-900">{{ task.title }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 mr-2">
                        {{ task.assignedTo?.name?.charAt(0) }}
                      </div>
                      <span class="text-sm text-slate-600">{{ task.assignedTo?.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ task.dueDate | date:'shortDate' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + getTaskStatusClass(task.status)">
                      {{ task.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Team Tab -->
          <div *ngIf="activeTab === 'team'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let member of project.members" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {{ member.user?.name?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">{{ member.user?.name }}</p>
                <p class="text-xs text-blue-600 font-medium">{{ member.roleInProject }}</p>
                <p class="text-xs text-slate-500 mt-1 truncate">{{ member.responsibility }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-slate-900">{{ member.allocation }}%</p>
                <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Allocated</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Quick Stats -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Progress</h3>
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between text-xs">
                <span class="font-semibold inline-block text-blue-600">Overall Completion</span>
                <span class="font-semibold inline-block text-blue-600">65%</span>
              </div>
              <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div style="width:65%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="text-center p-3 bg-slate-50 rounded-lg">
                <p class="text-2xl font-bold text-slate-900">{{ getPendingTasksCount() }}</p>
                <p class="text-[10px] text-slate-500 uppercase font-bold">Pending Tasks</p>
              </div>
              <div class="text-center p-3 bg-slate-50 rounded-lg">
                <p class="text-2xl font-bold text-slate-900">{{ getCompletedTasksCount() }}</p>
                <p class="text-[10px] text-slate-500 uppercase font-bold">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  activeTab = 'overview';

  readonly BackIcon = ChevronLeft;
  
  tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProject(id).subscribe(project => {
        this.project = project;
      });
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'ON_HOLD': return 'bg-amber-100 text-amber-700';
      case 'NOT_STARTED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-blue-600';
      case 'LOW': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  }

  getTaskStatusClass(status: string) {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'BLOCKED': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getPendingTasksCount() {
    return this.project?.tasks?.filter(t => t.status !== 'DONE').length || 0;
  }

  getCompletedTasksCount() {
    return this.project?.tasks?.filter(t => t.status === 'DONE').length || 0;
  }
}
