import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BALANCE_INSUFFICIENT_ERROR, OPERATION_ABONNEMENT_WIDO } from 'src/shared';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { UserConsoService } from '../services/user-cunsommation-service/user-conso.service';
@Component({
  selector: 'set-payment-channel-modal',
  templateUrl: './set-payment-channel-modal.page.html',
  styleUrls: ['./set-payment-channel-modal.page.scss'],
})
export class SetPaymentChannelModalPage implements OnInit {
  @Input() pass;
  @Input() purchaseType;
  @Input() passIlliflex;
  selectedPaymentChannel: 'CREDIT' | 'ORANGE_MONEY';
  soldeCredit = UserConsoService.lastRechargementCompteurValue;
	checkingAmount: boolean;
	errorMsg: string;
  constructor(
    public modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService  ) {}

  ngOnInit() {
    this.getUserConsommationsAndOmInfos();
  }

  setPaymentChannel(channel: 'CREDIT' | 'ORANGE_MONEY') {
    this.selectedPaymentChannel = channel;
  }

  async validateChannel() {
    this.modalController.dismiss({
      paymentMod: this.selectedPaymentChannel,
    });
  }

	canBuyByOMoney() {
		return this.orangeMoneyService.checkBalanceSufficiency(this.pass.tarif).pipe(
			catchError(() => {
				this.checkingAmount = false;
				return of(true);
			}),
      tap(hasEnoughBalance => {
        this.checkingAmount = false;
        if (!hasEnoughBalance) {
          this.errorMsg = BALANCE_INSUFFICIENT_ERROR;
        }
      })
    ).subscribe();
	}

  async getUserConsommationsAndOmInfos() {
		if(this.purchaseType === OPERATION_ABONNEMENT_WIDO) {
			this.canBuyByOMoney();
		}
  }
}
