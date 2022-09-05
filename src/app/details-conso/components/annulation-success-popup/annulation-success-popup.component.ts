import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-annulation-success-popup',
  templateUrl: './annulation-success-popup.component.html',
  styleUrls: ['./annulation-success-popup.component.scss'],
})
export class AnnulationSuccessPopupComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

	close() {
    this.modalController.dismiss();
  }
}
