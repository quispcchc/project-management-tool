import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: string) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: any) {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: string, project: any) {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addMember(projectId: string, member: any) {
    return this.http.post(`${this.apiUrl}/${projectId}/members`, member);
  }

  removeMember(projectId: string, memberId: string) {
    return this.http.delete(`${this.apiUrl}/${projectId}/members/${memberId}`);
  }
}
