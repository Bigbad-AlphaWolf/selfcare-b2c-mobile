import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'set-payment-channel-modal',
  templateUrl: './set-payment-channel-modal.page.html',
  styleUrls: ['./set-payment-channel-modal.page.scss'],
})
export class SetPaymentChannelModalPage implements OnInit {
  @Input() price;
  selectedPaymentChannel: 'CREDIT' | 'ORANGE_MONEY';

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  setPaymentChannel(channel: 'CREDIT' | 'ORANGE_MONEY') {
    this.selectedPaymentChannel = channel;
  }

  validateChannel() {
    this.modalController.dismiss({
      paymentMod: this.selectedPaymentChannel,
    });
  }
}
