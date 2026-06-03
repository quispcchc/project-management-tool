import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(projectId?: string) {
    const params = projectId ? { projectId } : {};
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  createTask(task: any) {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: any) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addComment(taskId: string, content: string) {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, { content });
  }
}
