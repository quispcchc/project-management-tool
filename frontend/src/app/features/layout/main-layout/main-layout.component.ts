import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import {
  LucideAngularModule,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  KanbanSquare
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

type NavItem = {
  label: string;
  path: string;
  icon: any;
};

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = signal(false);
  currentUrl = signal(this.router.url);

  user = this.authService.currentUser;

  readonly AppIcon = KanbanSquare;
  readonly XIcon = X;
  readonly MenuIcon = Menu;
  readonly LogOutIcon = LogOut;
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  pageTitle = computed(() => {
    const url = this.currentUrl();

    if (url.startsWith('/projects')) return 'Projects';
    if (url.startsWith('/tasks')) return 'Tasks';
    if (url.startsWith('/team')) return 'Team';
    if (url.startsWith('/reports')) return 'Reports';
    if (url.startsWith('/settings')) return 'Settings';

    return 'Dashboard';
  });

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.isSidebarOpen.set(false);
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
