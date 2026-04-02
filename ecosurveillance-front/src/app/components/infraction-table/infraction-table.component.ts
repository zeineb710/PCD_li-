import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infraction-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infraction-table.component.html',
  styleUrls: ['./infraction-table.component.css']
})
export class InfractionTableComponent {
  @Input() infractions: any[] = [];
  @Input() readOnly: boolean = false; // ← ajouté ici

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  onEdit(infraction: any) {
    if (!this.readOnly) { // bloque l’édition si readOnly=true
      this.edit.emit(infraction);
    }
  }

  onDelete(id: number) {
    if (!this.readOnly) { // bloque la suppression si readOnly=true
      this.delete.emit(id);
    }
  }
}
