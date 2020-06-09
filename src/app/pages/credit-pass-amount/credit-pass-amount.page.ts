import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { getPageTitle } from 'src/app/utils/title.util';

@Component({
  selector: "app-credit-pass-amount",
  templateUrl: "./credit-pass-amount.page.html",
  styleUrls: ["./credit-pass-amount.page.scss"],
})
export class CreditPassAmountPage implements OnInit {
  public static readonly PATH: string = "/credit-pass-amount";

  title: string;
  opXtras: OperationExtras = {};
  initialAmount : number ;
  inputAmount : any ;

  constructor(
    private navController: NavController,
    private refChangeDetector : ChangeDetectorRef,
  ) {}


  ngOnInit() {
    this.opXtras = history.state;
    this.title = (getPageTitle(this.opXtras.purchaseType)).title;
  }

  ionViewWillEnter(){
    this.opXtras.amount = this.inputAmount;
  }

  onAmountSelected(amount: string) {
    this.opXtras.amount = amount;
    this.onContinue();
  }

  onInputSelected(amount: string) {
    this.inputAmount = amount;
    this.opXtras.amount = amount;
  }

  onContinue() {
    const navExtras: NavigationExtras = { state: this.opXtras };
    this.navController.navigateForward(["/operation-recap"], navExtras);
  }

  goBack() {
    this.navController.pop();
  }
}
