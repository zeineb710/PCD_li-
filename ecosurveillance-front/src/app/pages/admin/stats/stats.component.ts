import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, AfterViewInit {

  barChart: any;
  lineChart: any;
  currentUser: any = null;
  private chartsReady = false;
  private dataReady = false;
  private statusData: any = null;
  private evolutionData: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.chartsReady = true;
    this.tryRenderCharts();
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  loadStats(): void {
    forkJoin({
      status: this.dashboardService.getInfractionsByStatus(),
      evolution: this.dashboardService.getInfractionsEvolution()
    }).subscribe({
      next: ({ status, evolution }) => {
        this.statusData = status;
        this.evolutionData = evolution;
        this.dataReady = true;
        this.tryRenderCharts();
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
      }
    });
  }

  private tryRenderCharts(): void {
    if (this.chartsReady && this.dataReady) {
      this.initBarChart();
      this.initLineChart();
    }
  }

  private initBarChart(): void {
    const barCanvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!barCanvas) return;

    if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['En attente', 'Terminée'],
        datasets: [{
          label: 'Infractions',
          data: [
            this.statusData?.en_attente ?? 0,
            this.statusData?.terminee ?? 0
          ],
          backgroundColor: ['#4285F4', '#0F9D58']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  private initLineChart(): void {
    const lineCanvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!lineCanvas) return;

    if (this.lineChart) this.lineChart.destroy();

    this.lineChart = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: this.evolutionData.map(d => d.mois),
        datasets: [{
          label: 'Infractions',
          data: this.evolutionData.map(d => d.total),
          borderColor: '#4285F4',
          backgroundColor: 'rgba(66,133,244,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}