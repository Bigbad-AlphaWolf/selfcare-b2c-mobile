import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { getPageTitle } from "src/app/utils/title.util";
import { NavController } from "@ionic/angular";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { FeeModel } from "src/app/services/orange-money-service";
import { CounterService } from "src/app/services/counter/counter.service";

@Component({
  selector: "app-bill-amount",
  templateUrl: "./bill-amount.page.html",
  styleUrls: ["./bill-amount.page.scss"],
})
export class BillAmountPage implements OnInit {
  static ROUTE_PATH: string = "/bill-amount";
  amounts: string[] = ["2000", "5000", "10000", "15000", "20000", "30000"];

  title: string;
  opXtras: OperationExtras = {};
  initialAmount: number;
  inputAmount: any;
  fee: any = 0;
  includeFees: any;
  totalAmount: any;
  isFee: boolean = true;

  constructor(
    private navController: NavController,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.opXtras = history.state;
    this.title = getPageTitle(this.opXtras.purchaseType).title;
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
    this.navController.navigateForward(["/operation-recap"], navExtras);
  }

  inputAmountIsValid(amount: number) {
    return amount && amount >= 1000 && amount <= 2000000;
  }

  toogleFee($event) {
    this.isFee = $event.detail.checked;
    this.updateAmount(this.inputAmount);
  }

  updateAmount(amount: number) {
    this.fee = this.opXtras.fee = 0;
    if (!this.inputAmountIsValid(amount)) {
      this.totalAmount = this.opXtras.amount = 0;
      return;
    }
    if (this.isFee) {
      this.fee = this.opXtras.fee = this.counterService.findAmountFee(amount);
      this.totalAmount = this.opXtras.amount = amount + this.fee;
      return;
    }

    if (!this.isFee) this.totalAmount = this.opXtras.amount = amount;
  }

  goBack() {
    this.navController.pop();
  }
}
