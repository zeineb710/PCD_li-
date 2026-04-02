import { User } from './user.model';

// export interface Infraction {
//   id: number;
//   type: string;
//   description: string;

//   status: 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';

//   dateInfraction: Date;

//   etudiant: User;

//   preuveUrl?: string;     // image ou vidéo
//   punition?: string;      // punition écologique
// }
export interface Infraction {
  id: number;
  etudiantNom: string;       // vient du DTO Java
  etudiantEmail: string;     // vient du DTO Java
  date: string;              // LocalDateTime → string en JSON
  status: 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';
  preuves?: any[];
  punitionDescription?: string;
  punitionStatut?: string;
}