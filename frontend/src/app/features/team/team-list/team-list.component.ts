import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Plus,
  Search,
  Mail,
  Briefcase,
  ShieldCheck
} from 'lucide-angular';

type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  activeProjects: number;
  status: 'Active' | 'Away' | 'Inactive';
  initials: string;
};

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './team-list.component.html'
})
export class TeamListComponent {
  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly MailIcon = Mail;
  readonly BriefcaseIcon = Briefcase;
  readonly ShieldIcon = ShieldCheck;

  searchTerm = signal('');

  members = signal<TeamMember[]>([
    {
      id: 1,
      name: 'Al Haq',
      email: 'alhaq@example.com',
      role: 'Project Manager',
      department: 'Management',
      activeProjects: 4,
      status: 'Active',
      initials: 'AH'
    },
    {
      id: 2,
      name: 'Sindhura',
      email: 'sindhura@example.com',
      role: 'Frontend Developer',
      department: 'Engineering',
      activeProjects: 3,
      status: 'Active',
      initials: 'SI'
    },
    {
      id: 3,
      name: 'Naveen',
      email: 'naveen@example.com',
      role: 'Backend Developer',
      department: 'Engineering',
      activeProjects: 2,
      status: 'Away',
      initials: 'NA'
    },
    {
      id: 4,
      name: 'Priya',
      email: 'priya@example.com',
      role: 'QA Analyst',
      department: 'Quality',
      activeProjects: 2,
      status: 'Active',
      initials: 'PR'
    }
  ]);

  filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    return this.members().filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      member.department.toLowerCase().includes(term)
    );
  });

  setSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getStatusClass(status: TeamMember['status']): string {
    const classes = {
      Active: 'bg-teal-50 text-teal-700',
      Away: 'bg-orange-50 text-orange-700',
      Inactive: 'bg-slate-100 text-slate-700'
    };

    return classes[status];
  }
}
