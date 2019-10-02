import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-choose-payment-mod',
  templateUrl: './choose-payment-mod.component.html',
  styleUrls: ['./choose-payment-mod.component.scss']
})
export class ChoosePaymentModComponent implements OnInit {
  @Output() paymentMod = new EventEmitter();
  @Output() chooseFavoris = new EventEmitter();
  @Input() illimix: boolean;
  payment = '';
  PASS_INTERNET_FAVORIS = [];

  constructor() {}

  ngOnInit() {}

  setCreditPaymentMod() {
    this.payment = 'CREDIT';
    this.goToNext();
  }

  setOMPaymentMod() {
    this.payment = 'ORANGE_MONEY';
    this.goToNext();
  }

  goToNext() {
    this.paymentMod.emit(this.payment);
  }

  goToValidation(pass: any) {
    this.chooseFavoris.emit(pass);
  }
}
