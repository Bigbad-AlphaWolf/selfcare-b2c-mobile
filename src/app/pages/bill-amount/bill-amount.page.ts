import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { getPageHeader } from 'src/app/utils/title.util';
import { NavController } from '@ionic/angular';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { FeeModel } from 'src/app/services/orange-money-service';
import { FeesService } from 'src/app/services/fees/fees.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';

@Component({
  selector: 'app-bill-amount',
  templateUrl: './bill-amount.page.html',
  styleUrls: ['./bill-amount.page.scss'],
})
export class BillAmountPage implements OnInit {
  static ROUTE_PATH: string = '/bill-amount';
  amounts: string[] = ['1000', '2000', '5000', '10000', '15000', '20000'];

  title: string;
  opXtras: OperationExtras = {};
  initialAmount: number;
  inputAmount: any;
  fee: any = 0;
  includeFees: any;
  totalAmount: any;
  isFee: boolean = true;
  minimalAmount: number;
  maximalAmount: number;
  amountIsValid: boolean = false;
  service: string;
  feesArray: FeeModel[];
  firstFees: FeeModel;
  lastFees: FeeModel;
  hasErrorOnRequest: boolean;
  isLoadingFees: boolean;
  constructor(
    private navController: NavController,
    private feeService: FeesService
  ) {}

  ngOnInit() {
    this.opXtras = history.state;
    if (
      this.opXtras &&
      this.opXtras.billData &&
      this.opXtras.billData.company &&
      this.opXtras.billData.company.codeOM
    )
      this.service = this.opXtras.billData.company.codeOM.toLowerCase();
    console.log(this.service);

    this.title = getPageHeader(this.opXtras.purchaseType).title;
    this.queryFees();
  }

  queryFees() {
    this.hasErrorOnRequest = false;
    this.isLoadingFees = true;
    this.feeService
      .getFeesByOMService(this.service)
      .pipe(
        tap((res: FeeModel[]) => {
          this.feesArray = res;
          this.isLoadingFees = false;
          if (res.length) {
            this.firstFees = this.feesArray[0];
            this.lastFees = this.feesArray[this.feesArray.length - 1];
            this.minimalAmount =
              this.opXtras.billData.company.code === OPERATION_WOYOFAL
                ? 1000
                : this.firstFees.min;
            this.maximalAmount = this.lastFees.max;
          } else {
            this.hasErrorOnRequest = true;
          }
        }),
        catchError((err) => {
          this.hasErrorOnRequest = true;
          this.isLoadingFees = false;
          return of(err);
        })
      )
      .subscribe();
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
    if (this.opXtras.billData.company.code === OPERATION_WOYOFAL) {
      return amount >= 1000;
    }
    return this.isFee
      ? this.amountExcludeFeeIsValid(amount)
      : this.amountIncludeFeeIsValid(amount);
  }

  amountIncludeFeeIsValid(amount: number) {
    const feeInclude = true;
    let feesIncludes = this.feeService.extractFees(
      this.feesArray,
      amount,
      feeInclude
    );
    this.amountIsValid = !!feesIncludes;
    return amount >= this.firstFees.min && amount <= this.lastFees.max;
  }

  amountExcludeFeeIsValid(amount: number) {
    return amount >= this.firstFees.min && amount <= this.lastFees.max;
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
      const fee = this.feeService.extractFees(this.feesArray, amount);
      if (!fee) {
        this.amountIsValid = false;
        return;
      }
      this.fee = this.opXtras.fee = fee.effective_fees;
      this.opXtras.amount = amount;
      this.totalAmount = this.opXtras.amount + this.opXtras.fee;
    } else {
      const fee = this.feeService.extractFees(this.feesArray, amount);
      if (!fee) {
        this.amountIsValid = false;
        return;
      }
      this.fee = this.opXtras.fee = fee.effective_fees;
      this.opXtras.amount = amount - this.opXtras.fee;
      this.totalAmount = this.opXtras.amount;
    }
  }

  goBack() {
    this.navController.pop();
  }
}
