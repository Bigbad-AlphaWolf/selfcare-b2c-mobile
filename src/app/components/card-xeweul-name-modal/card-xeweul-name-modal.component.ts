import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-card-xeweul-name-modal',
  templateUrl: './card-xeweul-name-modal.component.html',
  styleUrls: ['./card-xeweul-name-modal.component.scss'],
})
export class CardXeweulNameModalComponent implements OnInit {
  @Input() counter: string;
  labelCardXeweul: string;
  hasError: boolean;
  isInputValid: boolean;
  msgError: string;
  constructor(private modCtr: ModalController) { }

  ngOnInit() {}

  isValid() {
    this.isInputValid =  this.labelCardXeweul.length >= 3;
  }

  closeModal() {
    this.modCtr.dismiss({
      label_carte: this.labelCardXeweul
    });
  }
}
