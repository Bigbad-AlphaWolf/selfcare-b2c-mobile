import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-card-rapido-name-modal',
  templateUrl: './card-rapido-name-modal.component.html',
  styleUrls: ['./card-rapido-name-modal.component.scss'],
})
export class CardRapidoNameModalComponent implements OnInit {
  @Input() counter: string;
  labelCardRapido: string;
  hasError: boolean;
  isInputValid: boolean;
  msgError: string;
  constructor(private modCtr: ModalController) { }

  ngOnInit() {}

  isValid() {
    this.isInputValid =  this.labelCardRapido.length >= 3
  }

  closeModal() {
    this.modCtr.dismiss({
      label_carte: this.labelCardRapido
    })
  }
}
