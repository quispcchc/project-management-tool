import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, MoreHorizontal, Clock, MessageSquare, Paperclip } from 'lucide-angular';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DragDropModule],
  template: `
    <div class="h-full flex flex-col space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Task Board</h1>
          <p class="text-slate-500 text-sm">Drag and drop tasks to update status</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center">
          <lucide-icon [name]="PlusIcon" class="w-4 h-4 mr-2"></lucide-icon>
          <span>New Task</span>
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto pb-4">
        <div class="flex h-full space-x-6 min-w-max" cdkDropListGroup>
          <!-- Columns -->
          <div *ngFor="let column of columns" class="flex flex-col w-80 bg-slate-100 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4 px-1">
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-slate-700 uppercase tracking-wider text-xs">{{ column.title }}</h3>
                <span class="bg-white text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                  {{ column.tasks.length }}
                </span>
              </div>
              <button class="text-slate-400 hover:text-slate-600">
                <lucide-icon [name]="MoreIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>

            <!-- Task List -->
            <div cdkDropList [cdkDropListData]="column.tasks" (cdkDropListDropped)="drop($event)"
              class="flex-1 space-y-3 min-h-[100px]">
              <div *ngFor="let task of column.tasks" cdkDrag
                class="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group">
                <div class="flex items-start justify-between mb-2">
                  <div [class]="'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ' + getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </div>
                </div>
                <h4 class="text-sm font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600">{{ task.title }}</h4>
                <p class="text-xs text-slate-500 line-clamp-2 mb-4">{{ task.description }}</p>
                
                <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                  <div class="flex items-center space-x-3 text-slate-400">
                    <div class="flex items-center text-[10px]">
                      <lucide-icon [name]="ClockIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      {{ task.dueDate | date:'MMM d' }}
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-white">
                      {{ task.assignedTo?.name?.charAt(0) || '?' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TaskBoardComponent implements OnInit {
  columns: { title: string, status: TaskStatus, tasks: Task[] }[] = [
    { title: 'To Do', status: 'TODO', tasks: [] },
    { title: 'In Progress', status: 'IN_PROGRESS', tasks: [] },
    { title: 'Blocked', status: 'BLOCKED', tasks: [] },
    { title: 'Review', status: 'REVIEW', tasks: [] },
    { title: 'Done', status: 'DONE', tasks: [] }
  ];

  readonly PlusIcon = Plus;
  readonly MoreIcon = MoreHorizontal;
  readonly ClockIcon = Clock;
  readonly CommentIcon = MessageSquare;
  readonly AttachIcon = Paperclip;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.columns.forEach(col => {
        col.tasks = tasks.filter((t: Task) => t.status === col.status);
      });
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.columns.find(c => c.tasks === event.container.data)?.status;
      
      if (newStatus) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        
        this.taskService.updateTask(task.id, { ...task, status: newStatus }).subscribe();
      }
    }
  }

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700';
      case 'LOW': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
