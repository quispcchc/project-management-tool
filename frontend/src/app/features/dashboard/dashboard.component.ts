import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Briefcase, CheckSquare, Clock, AlertTriangle, CheckCircle2 } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { DashboardStats, ActivityLog } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div class="text-sm text-slate-500">Welcome back, manager!</div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div *ngFor="let stat of statsCards" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div [class]="'p-2 rounded-lg ' + stat.bgClass">
              <lucide-icon [name]="stat.icon" [class]="'w-5 h-5 ' + stat.iconClass"></lucide-icon>
            </div>
          </div>
          <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
          <div class="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button class="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div class="divide-y divide-slate-100">
            <div *ngFor="let log of activityLogs" class="p-4 flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-slate-600">{{ log.user.name.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-900">
                  <span class="font-bold">{{ log.user.name }}</span>
                  <span class="text-slate-600"> {{ log.details }}</span>
                </p>
                <div class="flex items-center mt-1 space-x-2">
                  <span class="text-xs text-slate-400">{{ log.createdAt | date:'short' }}</span>
                  <span *ngIf="log.project" class="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                    {{ log.project.name }}
                  </span>
                </div>
              </div>
            </div>
            <div *ngIf="activityLogs.length === 0" class="p-8 text-center text-slate-500">
              No recent activity found.
            </div>
          </div>
        </div>

        <!-- Projects Needing Attention -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">Attention Needed</h2>
          </div>
          <div class="p-5 space-y-4">
            <div class="p-4 bg-red-50 border border-red-100 rounded-lg">
              <div class="flex items-center space-x-2 text-red-700 mb-1">
                <lucide-icon [name]="AlertIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-sm font-bold">3 Overdue Tasks</span>
              </div>
              <p class="text-xs text-red-600">Review ASAP to avoid project delays.</p>
            </div>
            <div class="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <div class="flex items-center space-x-2 text-amber-700 mb-1">
                <lucide-icon [name]="ClockIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-sm font-bold">2 Deadlines Today</span>
              </div>
              <p class="text-xs text-amber-600">Project Beta and Team Sync.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  activityLogs: ActivityLog[] = [];

  readonly AlertIcon = AlertTriangle;
  readonly ClockIcon = Clock;

  statsCards: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadStats();
    this.loadActivity();
  }

  loadStats() {
    this.userService.getStats().subscribe(stats => {
      this.stats = stats;
      this.updateStatsCards();
    });
  }

  loadActivity() {
    this.userService.getActivityLogs().subscribe(logs => {
      this.activityLogs = logs;
    });
  }

  updateStatsCards() {
    if (!this.stats) return;
    this.statsCards = [
      { label: 'Total Projects', value: this.stats.totalProjects, icon: Briefcase, bgClass: 'bg-blue-50', iconClass: 'text-blue-600' },
      { label: 'Active', value: this.stats.activeProjects, icon: CheckCircle2, bgClass: 'bg-green-50', iconClass: 'text-green-600' },
      { label: 'Completed', value: this.stats.completedProjects, icon: CheckCircle2, bgClass: 'bg-indigo-50', iconClass: 'text-indigo-600' },
      { label: 'Pending Tasks', value: this.stats.pendingTasks, icon: CheckSquare, bgClass: 'bg-amber-50', iconClass: 'text-amber-600' },
      { label: 'Overdue', value: this.stats.overdueTasks, icon: AlertTriangle, bgClass: 'bg-red-50', iconClass: 'text-red-600' },
      { label: 'Done this week', value: this.stats.completedThisWeek, icon: Clock, bgClass: 'bg-teal-50', iconClass: 'text-teal-600' }
    ];
  }
}
