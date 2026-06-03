import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Plus, Search, Filter, MoreVertical, Briefcase, Calendar, User } from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Projects</h1>
          <p class="text-slate-500 text-sm">Manage and track all your active projects</p>
        </div>
        <button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <lucide-icon [name]="PlusIcon" class="w-4 h-4 mr-2"></lucide-icon>
          <span>Create Project</span>
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <lucide-icon [name]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
          <input type="text" placeholder="Search projects..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div class="flex gap-2">
          <select class="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <select class="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <!-- Project Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let project of projects" 
          class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div class="p-5 flex-1">
            <div class="flex items-start justify-between mb-4">
              <div [class]="'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ' + getStatusClass(project.status)">
                {{ project.status.replace('_', ' ') }}
              </div>
              <button class="text-slate-400 hover:text-slate-600">
                <lucide-icon [name]="MoreIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <a [routerLink]="['/projects', project.id]" class="block group">
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{{ project.name }}</h3>
              <p class="text-slate-600 text-sm line-clamp-2 mb-4">{{ project.description }}</p>
            </a>
            
            <div class="space-y-3">
              <div class="flex items-center text-sm text-slate-500">
                <lucide-icon [name]="UserIcon" class="w-4 h-4 mr-2"></lucide-icon>
                <span>Owner: {{ project.owner?.name }}</span>
              </div>
              <div class="flex items-center text-sm text-slate-500">
                <lucide-icon [name]="CalendarIcon" class="w-4 h-4 mr-2"></lucide-icon>
                <span>Due: {{ project.endDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
          
          <div class="px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
            <div class="flex -space-x-2">
              <div *ngFor="let member of project.members?.slice(0, 4)" 
                class="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                {{ member.user?.name?.charAt(0) }}
              </div>
              <div *ngIf="(project.members?.length || 0) > 4" 
                class="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                +{{ (project.members?.length || 0) - 4 }}
              </div>
            </div>
            <div class="flex items-center text-sm font-medium text-slate-600">
              <span class="mr-2">{{ project._count?.tasks }} Tasks</span>
              <div [class]="'w-2 h-2 rounded-full ' + getPriorityClass(project.priority)"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="projects.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <lucide-icon [name]="ProjectIcon" class="w-8 h-8 text-slate-400"></lucide-icon>
        </div>
        <h3 class="text-lg font-bold text-slate-900">No projects found</h3>
        <p class="text-slate-500 mt-1">Get started by creating your first project.</p>
        <button class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Create Project
        </button>
      </div>
    </div>
  `
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly MoreIcon = MoreVertical;
  readonly CalendarIcon = Calendar;
  readonly UserIcon = User;
  readonly ProjectIcon = Briefcase;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
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

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-blue-500';
      case 'LOW': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  }
}
