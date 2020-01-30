import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-set-operation-amount',
  templateUrl: './set-operation-amount.component.html',
  styleUrls: ['./set-operation-amount.component.scss']
})
export class SetOperationAmountComponent implements OnInit {
  @Output() next = new EventEmitter<number>();
  @Output() showSolde = new EventEmitter<number>();
  @Input() amount;
  @Input() currentBalance;
  @Input() hideUserSolde = true;
  @Input() omBalance;
  hasError: boolean;
  checkingBalance: boolean;
  omPhoneNumber: string;

  constructor(private orangeMoneyService: OrangeMoneyService) {}

  ngOnInit() {
    this.getOmPhoneNumber();
  }

  getOmPhoneNumber() {
    this.orangeMoneyService.getOmMsisdn().subscribe(msisdn => {
      this.omPhoneNumber = msisdn;
    });
  }

  nextStep() {
    this.hasError = false;
    const amount = +this.amount;
    if (amount > 0) {
      this.checkingBalance = true;
      const msisdn = this.omPhoneNumber;
      const checkBalanceSufficiencyPayload = { amount, msisdn };
      this.orangeMoneyService
        .checkBalanceSufficiency(checkBalanceSufficiencyPayload)
        .subscribe(
          (hasEnoughBalance: boolean) => {
            this.checkingBalance = false;
            if (hasEnoughBalance) {
              this.next.emit(amount);
            } else {
              this.hasError = true;
            }
          },
          err => {
            this.checkingBalance = false;
            this.next.emit(amount);
          }
        );
    } else {
      alert('Montant doit être supérieur à 0');
    }
  }

  showOmSolde() {
    this.showSolde.emit();
  }

  hideTheSolde() {
    this.hideUserSolde = true;
  }
}
