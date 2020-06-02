import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import {
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_RECHARGE_CREDIT,
} from "src/shared";
import { OperationExtras } from "src/app/models/operation-extras.model";

@Component({
  selector: "app-credit-pass-amount",
  templateUrl: "./credit-pass-amount.page.html",
  styleUrls: ["./credit-pass-amount.page.scss"],
})
export class CreditPassAmountPage implements OnInit {
  public static readonly PATH: string = "/credit-pass-amount";

  title: string;
  opXtras: OperationExtras = {};

  constructor(
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.opXtras = history.state;
    this.changePageTitle();
  }

  onAmountSelected(amount: string) {
    this.opXtras.amount = amount;
  }

  onContinue() {
    const navExtras: NavigationExtras = { state: this.opXtras };
    this.router.navigate(["/operation-recap"], navExtras);
  }

  changePageTitle() {
    switch (this.opXtras.purchaseType) {
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.title = "Transfert de Crédit";
        break;
      case OPERATION_TYPE_SEDDO_BONUS:
        this.title = "Transfert de Bonus";
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.title = "Achat de Crédit";
        break;

      default:
        break;
    }
  }

  goBack() {
    this.navController.pop();
  }
}
