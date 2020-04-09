import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SetPaymentChannelModalPage } from '../set-payment-channel-modal/set-payment-channel-modal.page';

@Component({
  selector: 'app-operation-recap',
  templateUrl: './operation-recap.page.html',
  styleUrls: ['./operation-recap.page.scss'],
})
export class OperationRecapPage implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  presentModal() {
    this.modalController
      .create({
        component: SetPaymentChannelModalPage,
        animated: true,
        // cssClass: 'payment-mod-modal',
      })
      .then((modal) => {
        modal.present();
      });
  }
}
