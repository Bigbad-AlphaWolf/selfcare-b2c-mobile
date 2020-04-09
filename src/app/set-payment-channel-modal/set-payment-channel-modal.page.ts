import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'set-payment-channel-modal',
  templateUrl: './set-payment-channel-modal.page.html',
  styleUrls: ['./set-payment-channel-modal.page.scss'],
})
export class SetPaymentChannelModalPage implements OnInit {
  selectedPaymentChannel: 'credit' | 'om';

  constructor() {}

  ngOnInit() {}

  setPaymentChannel(channel: 'credit' | 'om') {
    this.selectedPaymentChannel = channel;
  }
}
