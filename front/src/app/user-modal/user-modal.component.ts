// user-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  @Input() userData: any; // Propriété pour recevoir les données de l'utilisateur
  @Output() closeModal = new EventEmitter<void>(); // Événement pour fermer la modale

  // Méthode pour fermer la modale
  close() {
    this.closeModal.emit();
  }
}
