import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { getPageHeader } from 'src/app/utils/title.util';
import { NavController } from '@ionic/angular';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { FeeModel } from 'src/app/services/orange-money-service';
import { CounterService } from 'src/app/services/counter/counter.service';

@Component({
  selector: 'app-bill-amount',
  templateUrl: './bill-amount.page.html',
  styleUrls: ['./bill-amount.page.scss'],
})
export class BillAmountPage implements OnInit {
  static ROUTE_PATH: string = '/bill-amount';
  amounts: string[] = ['2000', '5000', '10000', '15000', '20000', '30000'];

  title: string;
  opXtras: OperationExtras = {};
  initialAmount: number;
  inputAmount: any;
  fee: any = 0;
  includeFees: any;
  totalAmount: any;
  isFee: boolean = true;
  minimalAmount = 1000;
  amountIsValid: boolean = false;

  constructor(
    private navController: NavController,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.opXtras = history.state;
    this.title = getPageHeader(this.opXtras.purchaseType).title;
    this.minimalAmount = this.counterService.fees[0].montant_min;
  }

  ionViewWillEnter() {
    this.opXtras.amount = this.inputAmount;
    this.updateAmount(this.inputAmount);
  }

  onAmountSelected(amount: string) {
    this.opXtras.amount = amount;
    this.updateAmount(parseInt(amount));
    this.onContinue();
  }

  onInputSelected(amount: string) {
    this.inputAmount = parseInt(amount);
    this.updateAmount(this.inputAmount);
  }

  onContinue() {
    const navExtras: NavigationExtras = { state: this.opXtras };
    this.navController.navigateForward(['/operation-recap'], navExtras);
  }

  inputAmountIsValid(amount: number) {
    if (!amount) return false;

    let includefeeAmountIsValid =
      amount >= this.counterService.feesIncludes[0].montant_min &&
      amount <=
        this.counterService.feesIncludes[
          this.counterService.feesIncludes.length - 1
        ].montant_max;
    let amountIsValid =
      amount >= this.counterService.fees[0].montant_min &&
      amount <=
        this.counterService.fees[this.counterService.fees.length - 1]
          .montant_max;

    return this.isFee ? amountIsValid : includefeeAmountIsValid;
  }

  toogleFee($event) {
    this.isFee = $event.detail.checked;
    this.updateAmount(this.inputAmount);
  }

  updateAmount(amount: number) {
    this.fee = this.opXtras.fee = 0;
    if (!this.inputAmountIsValid(amount)) {
      this.totalAmount = this.opXtras.amount = 0;
      this.amountIsValid = false;
      return;
    }

    this.amountIsValid = true;
    if (this.isFee) {
      this.fee = this.opXtras.fee = this.counterService.findAmountFee(
        amount,
        false
      );
      this.opXtras.amount = amount;
      this.totalAmount = this.opXtras.amount + this.opXtras.fee;
    } else {
      this.fee = this.opXtras.fee = this.counterService.findAmountFee(
        amount,
        true
      );
      this.opXtras.amount = amount - this.opXtras.fee;
      this.totalAmount = this.opXtras.amount;
    }
  }

  goBack() {
    this.navController.pop();
  }
}
