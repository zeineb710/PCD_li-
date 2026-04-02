// import { Injectable } from '@angular/core';
// import { Observable, forkJoin } from 'rxjs';
// import { InfractionService } from './infraction.service';
// import { UserService } from './user.service';
// import { DashboardStats } from '../models/dashboard.model';
// import { map } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment.prod';
// @Injectable({ providedIn: 'root' })
// export class DashboardService {

//     private apiUrl = `${environment.apiUrl}/dashboard`;
  

//   constructor(
//     private http: HttpClient, 
//     private infractionService: InfractionService,
//     private userService: UserService
//   ) {}

//   getDashboardStats(): Observable<DashboardStats> {
//     return forkJoin({
//       totalInfractions: this.infractionService.getInfractionsCount(),
//       totalEtudiants: this.userService.getUsersCount(),
//       infractionsEnAttente: this.infractionService.getInfractionsEnAttente().pipe(
//         // On ne veut que le nombre
//         map(infractions => infractions.length)
//       ),
//       infractionsValidees: this.infractionService.getInfractionsValidees().pipe(
//         map(infractions => infractions.length)
//       )
//     });
//   }
//   getInfractionsByStatus(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/dashboard/stats/status`);
//   }

//   getInfractionsEvolution(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/dashboard/stats/evolution`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStatsDTO {
  totalInfractions: number;
  infractionsAujourdhui: number;
  totalEtudiants: number;
  totalPunitions: number;
  punitionsAujourdhui: number;
  punitionsTerminees: number;
  camerasActives: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8081/api/dashboard';

  constructor(private http: HttpClient) {}

  // Stats principales (cards du dashboard admin)
  getDashboardStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/admin/stats`);
  }

  // Évolution 6 mois → bar chart
  // Utilisé par dashboard.component sous le nom getEvolution()
  getEvolution(): Observable<{ mois: string; total: number }[]> {
    return this.http.get<{ mois: string; total: number }[]>(`${this.apiUrl}/stats/evolution`);
  }

  // Alias utilisé par stats.component.ts → getInfractionsEvolution()
  getInfractionsEvolution(): Observable<{ mois: string; total: number }[]> {
    return this.getEvolution();
  }

  // Répartition par statut → pie chart
  // Utilisé par dashboard.component sous le nom getStatsByStatus()
  getStatsByStatus(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/stats/status`);
  }

  // Alias utilisé par stats.component.ts → getInfractionsByStatus()
  getInfractionsByStatus(): Observable<{ [key: string]: number }> {
    return this.getStatsByStatus();
  }
}