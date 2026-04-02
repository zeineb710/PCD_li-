// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ProofViewerComponent } from '../../../components/proof-viewer/proof-viewer.component';
// import { RouterModule, Router } from '@angular/router'; // Ajout de Router

// @Component({
//   selector: 'app-history',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ProofViewerComponent],
//   templateUrl: './history.component.html',
//   styleUrls: ['./history.component.css']
// })
// export class HistoryComponent {

//   infractions = [
//     { id: 1, description: '-', date: new Date('2025-12-15'), punition: '-', status: 'Terminé' },
//     { id: 2, description: '-', date: new Date('2025-11-01'), punition: '-', status: 'Terminé' },
//   ];

//   showModal = false;
//   selectedInfractionId: number | null = null;

//   // Injection du Router dans le constructeur
//   constructor(private router: Router) {}

//   /**
//    * Logique de déconnexion pour le footer de la sidebar
//    */
//   onLogout(): void {
//     // Nettoyage de la session
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     sessionStorage.clear();

//     // Redirection vers l'écran de connexion
//     this.router.navigate(['/login']);
//     console.log('Déconnexion réussie depuis l\'historique');
//   }

//   openProofs(id: number) {
//     this.selectedInfractionId = id;
//     this.showModal = true;
//   }

//   closeModal() {
//     this.showModal = false;
//     this.selectedInfractionId = null;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProofViewerComponent } from '../../../components/proof-viewer/proof-viewer.component';
import { RouterModule, Router } from '@angular/router';
import { InfractionService } from '../../../services/infraction.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ProofViewerComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  infractions: any[] = [];
  user: any;

  // Stats calculées
  totalInfractions = 0;
  terminees = 0;
  enAttente = 0;
  prochainePunition: string = '-';

  showModal = false;
  selectedInfractionId: number | null = null;

  constructor(
    private router: Router,
    private infractionService: InfractionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadInfractions();
  }

  loadInfractions(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.infractionService.getInfractionsByEtudiant(user.id).subscribe((res: any[]) => {
      this.infractions = res;
      this.totalInfractions = res.length;
      this.terminees = res.filter(i => i.status === 'TERMINEE').length;
      this.enAttente = res.filter(i => i.status === 'EN_ATTENTE').length;

      // Date la plus proche parmi les infractions en attente
      const dates = res
        .filter(i => i.status === 'EN_ATTENTE' && i.infractionDate)
        .map(i => new Date(i.infractionDate))
        .sort((a, b) => a.getTime() - b.getTime());

      this.prochainePunition = dates.length > 0
        ? dates[0].toLocaleDateString('fr-FR')
        : '-';
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  openProofs(id: number) {
    this.selectedInfractionId = id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedInfractionId = null;
  }
}