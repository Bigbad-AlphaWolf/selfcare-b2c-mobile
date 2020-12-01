import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { getPageHeader } from 'src/app/utils/title.util';
import { NavController } from '@ionic/angular';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { FeeModel } from 'src/app/services/orange-money-service';
import { WoyofalService } from 'src/app/services/woyofal/woyofal.service';
import { FeesService } from 'src/app/services/fees/fees.service';

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
  service: string;

  constructor(
    private navController: NavController,
    private feeService: FeesService
  ) {}

  ngOnInit() {
    this.opXtras = history.state;
    this.service = this.opXtras.billData.company.code.toLowerCase();
    console.log(this.service);

    this.title = getPageHeader(this.opXtras.purchaseType).title;
    this.minimalAmount = this.feeService.fees[this.service][0].montant_min;
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

    return this.isFee
      ? this.amountExcludeFeeIsValid(amount)
      : this.amountIncludeFeeIsValid(amount);
  }

  amountIncludeFeeIsValid(amount: number) {
    let feesIncludes = this.feeService.feesIncludes[this.service];
    return (
      amount >= feesIncludes[0].montant_min &&
      amount <= feesIncludes[feesIncludes.length - 1].montant_max
    );
  }

  
  amountExcludeFeeIsValid(amount: number) {
    let fees = this.feeService.fees[this.service];
    return (
      amount >= fees[0].montant_min &&
      amount <= fees[fees.length - 1].montant_max
    );
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
      this.fee = this.opXtras.fee = this.feeService.findAmountFee(
        amount,
        this.service,
        false
      );
      this.opXtras.amount = amount;
      this.totalAmount = this.opXtras.amount + this.opXtras.fee;
    } else {
      this.fee = this.opXtras.fee = this.feeService.findAmountFee(
        amount,
        this.service,
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
