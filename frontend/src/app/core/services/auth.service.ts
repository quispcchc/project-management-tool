import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any) {
    return this.http.post<{ token: string, user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }
}
