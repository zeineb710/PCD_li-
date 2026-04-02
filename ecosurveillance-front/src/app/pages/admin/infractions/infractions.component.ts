import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Ajout de Router ici
import { InfractionService } from '../../../services/infraction.service';
import { InfractionTableComponent } from '../../../components/infraction-table/infraction-table.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-infractions',
  standalone: true,
  imports: [CommonModule, RouterModule, InfractionTableComponent],
  templateUrl: './infractions.component.html',
  styleUrls: ['./infractions.component.css']
})
export class InfractionsComponent implements OnInit {
  infractions: any[] = [];
  loading = true;
  error: string | null = null;
  currentUser: any = null;

  // Correction de la syntaxe du constructeur
  constructor(
    private infractionService: InfractionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simulation de données
    // this.infractions = [
    //   { id: 1, etudiantNom: 'Foulen ben Foulen', date: '2025-05-01', status: 'TERMINE', punitionDescription: '-' },
    //   { id: 2, etudiantNom: 'Foulen ben Foulen', date: '2025-08-02', status: 'EN_ATTENTE', punitionDescription: '-' }
    // ];
    // this.loading = false;
    // this.error = null;

    // Si vous voulez charger les vraies données au démarrage, décommentez la ligne suivante :
    this.currentUser = this.authService.getCurrentUser();
    this.loadInfractions();
  }

  loadInfractions() {
    this.loading = true;
    this.error = null;
    this.infractionService.getInfractions().subscribe({
      next: (res: any[]) => {
        this.infractions = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Impossible de charger les infractions';
        this.loading = false;
      }
    });
  }

  editInfraction(infraction: any) {
    console.log('Edit', infraction);
  }

  deleteInfraction(id: number) {
    if (confirm('Supprimer cette infraction ?')) {
      this.infractionService.deleteInfraction(id).subscribe(() => {
        this.infractions = this.infractions.filter(i => i.id !== id);
      });
    }
  }

  /**
   * Logique de déconnexion
   */
  onLogout(): void {
    // Nettoyage du stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Redirection vers le login
    this.router.navigate(['/login']);
  }
}