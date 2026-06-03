import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, PieChart, TrendingUp, Download } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Project Reports</h1>
          <p class="text-slate-500 text-sm">Visual insights into your team's performance</p>
        </div>
        <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center">
          <lucide-icon [name]="DownloadIcon" class="w-4 h-4 mr-2"></lucide-icon>
          <span>Export PDF</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tasks by Status -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <lucide-icon [name]="PieIcon" class="w-5 h-5 mr-2 text-blue-600"></lucide-icon>
            Tasks by Status
          </h3>
          <div class="h-64 flex items-center justify-center">
             <canvas baseChart 
              [data]="pieChartData" 
              [options]="pieChartOptions" 
              [type]="'pie'">
            </canvas>
          </div>
        </div>

        <!-- Productivity Trend -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <lucide-icon [name]="TrendIcon" class="w-5 h-5 mr-2 text-green-600"></lucide-icon>
            Completed Tasks Trend
          </h3>
          <div class="h-64 flex items-center justify-center">
            <canvas baseChart 
              [data]="lineChartData" 
              [options]="lineChartOptions" 
              [type]="'line'">
            </canvas>
          </div>
        </div>
      </div>

      <!-- Projects Performance Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-900">Project Performance</h3>
        </div>
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Project</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Completion</th>
              <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Velocity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let i of [1,2,3,4]" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-bold text-slate-900 text-sm">Project Alpha {{ i }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">In Progress</span>
              </td>
              <td class="px-6 py-4">
                <div class="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px]">
                  <div class="bg-blue-600 h-1.5 rounded-full" [style.width.%]="75"></div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-green-600 font-bold">+12%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  readonly DownloadIcon = Download;
  readonly PieIcon = PieChart;
  readonly TrendIcon = TrendingUp;

  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['To Do', 'In Progress', 'Done', 'Blocked'],
    datasets: [{
      data: [300, 500, 100, 40],
      backgroundColor: ['#cbd5e1', '#3b82f6', '#22c55e', '#ef4444']
    }]
  };

  // Line Chart
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };
  public lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3, 9],
        label: 'Completed Tasks',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  ngOnInit() {}
}
