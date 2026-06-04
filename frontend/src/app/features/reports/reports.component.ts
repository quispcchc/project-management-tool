import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock3,
  AlertTriangle
} from 'lucide-angular';

type ReportMetric = {
  label: string;
  value: string;
  helper: string;
  icon: any;
};

type Workload = {
  name: string;
  assigned: number;
  completed: number;
};

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  readonly TrendingIcon = TrendingUp;

  metrics: ReportMetric[] = [
    {
      label: 'Project Completion',
      value: '68%',
      helper: 'Across all active projects',
      icon: TrendingUp
    },
    {
      label: 'Active Projects',
      value: '8',
      helper: '4 due this month',
      icon: Briefcase
    },
    {
      label: 'Completed Tasks',
      value: '86',
      helper: '18 completed this week',
      icon: CheckCircle2
    },
    {
      label: 'Overdue Tasks',
      value: '5',
      helper: 'Needs attention',
      icon: AlertTriangle
    }
  ];

  projectHealth = [
    { label: 'On Track', value: 5, class: 'bg-emerald-500' },
    { label: 'At Risk', value: 2, class: 'bg-amber-500' },
    { label: 'Delayed', value: 1, class: 'bg-red-500' }
  ];

  workload: Workload[] = [
    { name: 'Al Haq', assigned: 12, completed: 9 },
    { name: 'Sindhura', assigned: 15, completed: 11 },
    { name: 'Naveen', assigned: 10, completed: 6 },
    { name: 'Priya', assigned: 8, completed: 7 }
  ];

  calculatePercent(completed: number, assigned: number): number {
    if (!assigned) return 0;
    return Math.round((completed / assigned) * 100);
  }
}
