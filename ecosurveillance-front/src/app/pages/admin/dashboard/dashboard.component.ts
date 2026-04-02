import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';

Chart.register(...registerables);

interface LocalDashboardStats {
  totalInfractions: number;
  totalEtudiants: number;
  infractionsEnAttente: number;
  infractionsAujourdhui: number;
  infractionsValidees: number;
  camerasActives: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: any = null;

  stats: LocalDashboardStats = {
    totalInfractions: 0,
    totalEtudiants: 0,
    infractionsEnAttente: 0,
    infractionsAujourdhui: 0,
    infractionsValidees: 0,
    camerasActives: 0
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: true } },
      x: { grid: { display: false } }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: '#3b82f6', borderRadius: 5 }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } }
    }
  };

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#a855f7']
    }]
  };

  loading: boolean = false;
  error: string = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
    this.loadEvolution();
    this.loadStatsByStatus();
  }

  loadStats(): void {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.totalInfractions      = data.totalInfractions      ?? 0;
        this.stats.totalEtudiants        = data.totalEtudiants        ?? 0;
        this.stats.infractionsEnAttente  = data.infractionsAujourdhui ?? 0;
        this.stats.infractionsAujourdhui = data.infractionsAujourdhui ?? 0;
        this.stats.camerasActives        = data.camerasActives        ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement stats', err);
        this.error = 'Impossible de charger les statistiques';
        this.loading = false;
      }
    });
  }

  loadEvolution(): void {
    this.dashboardService.getEvolution().subscribe({
      next: (data) => {
        this.barChartData = {
          labels: data.map(d => d.mois),
          datasets: [{ data: data.map(d => d.total), backgroundColor: '#3b82f6', borderRadius: 5 }]
        };
      },
      error: (err) => console.error('Erreur chargement évolution', err)
    });
  }

  loadStatsByStatus(): void {
    this.dashboardService.getStatsByStatus().subscribe({
      next: (data) => {
        const labels = Object.keys(data).map(k =>
          k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        );
        this.pieChartData = {
          labels,
          datasets: [{
            data: Object.values(data),
            backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#a855f7']
          }]
        };
      },
      error: (err) => console.error('Erreur chargement statuts', err)
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}