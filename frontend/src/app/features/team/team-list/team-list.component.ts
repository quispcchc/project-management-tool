import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, UserPlus, Mail, Phone, MoreHorizontal } from 'lucide-angular';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Team Members</h1>
          <p class="text-slate-500 text-sm">Manage your team and their roles across projects</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center">
          <lucide-icon [name]="PlusIcon" class="w-4 h-4 mr-2"></lucide-icon>
          <span>Add Member</span>
        </button>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center space-x-4">
          <div class="relative flex-1">
            <lucide-icon [name]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
            <input type="text" placeholder="Search members..." 
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          </div>
        </div>
        
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Member</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Projects</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let member of members" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 border-2 border-white shadow-sm">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900">{{ member.name }}</div>
                    <div class="text-xs text-slate-500">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                  {{ member.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span class="text-xs text-slate-600">Active</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-600">3 Active</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-slate-600">
                  <lucide-icon [name]="MoreIcon" class="w-5 h-5"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TeamListComponent implements OnInit {
  members: User[] = [];

  readonly PlusIcon = UserPlus;
  readonly SearchIcon = Search;
  readonly MoreIcon = MoreHorizontal;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.members = users;
    });
  }
}
