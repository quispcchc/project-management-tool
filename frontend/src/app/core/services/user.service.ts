import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, ActivityLog, DashboardStats } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getActivityLogs() {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/activity`);
  }

  getStats() {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
