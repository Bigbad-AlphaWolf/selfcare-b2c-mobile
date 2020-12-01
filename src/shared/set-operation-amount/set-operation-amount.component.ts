import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { Router } from '@angular/router';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-set-operation-amount',
  templateUrl: './set-operation-amount.component.html',
  styleUrls: ['./set-operation-amount.component.scss'],
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

  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getOmPhoneNumber();
  }

  getOmPhoneNumber() {
    this.orangeMoneyService.getOmMsisdn().subscribe((msisdn) => {
      if (msisdn !== 'error') {
        this.omPhoneNumber = msisdn;
      } else {
        this.router.navigate(['/see-solde-om']);
      }
    });
  }

  nextStep() {
    this.hasError = false;
    const amount = +this.amount;
    if (amount > 0) {
      this.checkingBalance = true;
      this.orangeMoneyService.checkBalanceSufficiency(amount).subscribe(
        (hasEnoughBalance: boolean) => {
          this.checkingBalance = false;
          if (hasEnoughBalance) {
            this.next.emit(amount);
          } else {
            this.hasError = true;
          }
        },
        (err) => {
          this.checkingBalance = false;
          this.next.emit(amount);
        }
      );
    } else {
      alert('Montant doit être supérieur à 0');
    }
  }

  showOmSolde() {
    this.openPinpad();
  }

  hideTheSolde() {
    this.hideUserSolde = true;
  }

  async openPinpad(purchaseType?: string) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: "pin-pad-modal",
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {      
      if(response && response.data ) {
        this.hideUserSolde = false;
        this.omBalance = response.data.balance;
      }
      
    });
    return await modal.present();
  }
}
