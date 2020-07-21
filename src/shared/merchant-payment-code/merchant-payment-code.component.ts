import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OPERATION_TYPE_MERCHANT_PAYMENT, REGEX_IS_DIGIT } from '..';
import { ModalController } from '@ionic/angular';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { HttpErrorResponse } from '@angular/common/http';
import { MarchandOem } from 'src/app/models/marchand-oem.model';
import { BsBillsHubService } from 'src/app/services/bottom-sheet/bs-bills-hub.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { FavoriteMerchantComponent } from 'src/app/components/favorite-merchant/favorite-merchant.component';
import { RecentsOem } from 'src/app/models/recents-oem.model';

@Component({
  selector: 'app-merchant-payment-code',
  templateUrl: './merchant-payment-code.component.html',
  styleUrls: ['./merchant-payment-code.component.scss'],
})
export class MerchantPaymentCodeComponent implements OnInit {
  chekingMerchant: boolean;
  merchantCodeForm: FormGroup;
  hasErrorOnCheckMerchant: boolean;
  errorMsg: string;
  recentMerchants$: Observable<MarchandOem[]>;

  constructor(
    private fb: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private applicationRoutingService: ApplicationRoutingService,
    private ref: ChangeDetectorRef,
    private bsBillsHubService: BsBillsHubService,
    private recentsService: RecentsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getRecentMerchants();
    this.merchantCodeForm = this.fb.group({
      merchantCode: ['', [Validators.required]],
    });
    this.bsBillsHubService.bsRef.subscribe((ref) => {
      ref.afterDismissed().subscribe((result: any) => {
        if (result && result.TYPE_BS === 'FAVORIES' && result.ACTION === 'BACK')
          this.bsBillsHubService.openBSCounterSelection(
            MerchantPaymentCodeComponent
          );

        if (result && result.ACTION === 'FORWARD') {
          const payload = {
            purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
            merchantCode: result.merchant.merchantCode,
            merchantName: result.merchant.name,
          };
          this.applicationRoutingService.goSetAmountPage(payload);
        }
      });
    });
  }

  checkMerchant() {
    this.hasErrorOnCheckMerchant = false;
    this.chekingMerchant = true;
    const code = this.merchantCodeForm.value.merchantCode;
    this.orangeMoneyService.getMerchantByCode(code).subscribe(
      (response: any) => {
        this.chekingMerchant = false;
        const payload = {
          purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
          merchantCode: code,
          merchantName: response.content.data.nom_marchand,
        };
        if (
          response &&
          response.status_code &&
          (response.status_code.match('Success') ||
            response.status_code.match('Erreur-601'))
        ) {
          this.applicationRoutingService.goSetAmountPage(payload);
          this.modalController.dismiss();
        } else {
          this.onCheckingMerchantError(response.status_wording);
        }
      },
      (err) => {
        this.chekingMerchant = false;
        if (err.error.name) return;
        err && err.msg
          ? this.onCheckingMerchantError(err.msg)
          : this.onCheckingMerchantError();
      }
    );
  }

  async resetOmToken(err) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    if (result && result.data && result.data.success) return of(err);
    throw new HttpErrorResponse({
      error: { title: 'Pinpad cancled', name: 'pinpadDismissed' },
      status: 401,
    });
  }

  onMyFavorites() {
    this.bsBillsHubService.openBSFavoriteCounters(FavoriteMerchantComponent);
  }

  onCheckingMerchantError(msg?: string) {
    this.hasErrorOnCheckMerchant = true;
    this.errorMsg = msg ? msg : 'Une erreur est survenue';
    this.ref.detectChanges();
  }

  onRecentMerchantSelected(merchant: any) {
    const payload = {
      purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
      merchantCode: merchant.merchantCode,
      merchantName: merchant.name,
    };
    this.applicationRoutingService.goSetAmountPage(payload);
    this.modalController.dismiss();
  }

  getRecentMerchants() {
    const recentType = 'paiement_marchand';
    this.recentMerchants$ = this.recentsService.fetchRecents(recentType).pipe(
      map((recents: RecentsOem[]) => {
        let results = [];
        recents.forEach((el) => {
          results.push({
            name: JSON.parse(el.payload).nom_marchand,
            merchantCode: el.destinataire,
          });
        });
        return results;
      })
    );
  }

  numberOnly(event) {
    if (!REGEX_IS_DIGIT.test(event.data)) {
      const value = event.target.value;
      event.target.value = 0;
      event.target.value = value;
    }
  }
}
