import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Briefcase, CheckSquare, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside [class.hidden]="!isSidebarOpen()" class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-all duration-300 lg:static lg:block">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between h-16 px-6 bg-slate-950">
            <span class="text-xl font-bold tracking-wider text-blue-400">PM TOOL</span>
            <button (click)="toggleSidebar()" class="lg:hidden">
              <lucide-icon [name]="XIcon" class="w-6 h-6"></lucide-icon>
            </button>
          </div>
          <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <a *ngFor="let item of navItems" [routerLink]="item.path" routerLinkActive="bg-blue-600 text-white"
               class="flex items-center px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group">
              <lucide-icon [name]="item.icon" class="w-5 h-5 mr-3"></lucide-icon>
              <span class="font-medium">{{ item.label }}</span>
            </a>
          </nav>
          <div class="p-4 mt-auto border-t border-slate-800">
            <button (click)="logout()" class="flex items-center w-full px-4 py-3 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <lucide-icon [name]="LogOutIcon" class="w-5 h-5 mr-3"></lucide-icon>
              <span class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button (click)="toggleSidebar()" class="lg:hidden p-2 text-slate-600">
            <lucide-icon [name]="MenuIcon" class="w-6 h-6"></lucide-icon>
          </button>
          <div class="flex items-center space-x-4 ml-auto">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-slate-900">{{ user()?.name }}</p>
              <p class="text-xs text-slate-500 capitalize">{{ user()?.role?.toLowerCase() }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {{ user()?.name?.charAt(0) }}
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = signal(true);
  user = this.authService.currentUser;

  readonly XIcon = X;
  readonly MenuIcon = Menu;
  readonly LogOutIcon = LogOut;

  navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
