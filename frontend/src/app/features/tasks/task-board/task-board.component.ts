import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Plus,
  Search,
  CalendarDays,
  User,
  MoreHorizontal
} from 'lucide-angular';

type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
type Priority = 'High' | 'Medium' | 'Low';

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
};

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './task-board.component.html'
})
export class TaskBoardComponent {
  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly CalendarIcon = CalendarDays;
  readonly UserIcon = User;
  readonly MoreIcon = MoreHorizontal;

  searchTerm = signal('');

  columns: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

  tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Design dashboard UI',
      description: 'Create modern responsive dashboard for project overview.',
      project: 'ProjectFlow',
      assignee: 'Sindhura',
      status: 'Done',
      priority: 'High',
      dueDate: 'Today'
    },
    {
      id: 2,
      title: 'Create task board',
      description: 'Build Kanban style task board with status columns.',
      project: 'ProjectFlow',
      assignee: 'Al Haq',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Tomorrow'
    },
    {
      id: 3,
      title: 'Connect project API',
      description: 'Integrate frontend project list with backend service.',
      project: 'ProjectFlow',
      assignee: 'Backend Team',
      status: 'Todo',
      priority: 'Medium',
      dueDate: 'This week'
    },
    {
      id: 4,
      title: 'Review mobile layout',
      description: 'Test pages on mobile and tablet screen sizes.',
      project: 'ProjectFlow',
      assignee: 'QA Team',
      status: 'Review',
      priority: 'Low',
      dueDate: 'Jun 25'
    }
  ]);

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    return this.tasks().filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.project.toLowerCase().includes(term) ||
      task.assignee.toLowerCase().includes(term)
    );
  });

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.filteredTasks().filter(task => task.status === status);
  }

  setSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getPriorityClass(priority: Priority): string {
    const classes: Record<Priority, string> = {
      High: 'bg-red-50 text-red-700',
      Medium: 'bg-amber-50 text-amber-700',
      Low: 'bg-slate-100 text-slate-700'
    };

    return classes[priority];
  }
}
