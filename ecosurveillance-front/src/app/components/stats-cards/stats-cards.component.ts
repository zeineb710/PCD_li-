import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {

  @Input() stats: any = {
    totalInfractions: 0,
    totalPunitions: 0,
    infractionsParType: {}
  };

}
