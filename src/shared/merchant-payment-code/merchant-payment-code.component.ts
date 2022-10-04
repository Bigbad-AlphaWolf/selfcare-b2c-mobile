import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OPERATION_TYPE_MERCHANT_PAYMENT, REGEX_IS_DIGIT } from '..';
import { ModalController } from '@ionic/angular';
import { MarchandOem } from 'src/app/models/marchand-oem.model';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { FavoriteMerchantComponent } from 'src/app/components/favorite-merchant/favorite-merchant.component';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

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
  loadingRecents: boolean;
  @Input() omMsisdn: string;
  constructor(
    private fb: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private applicationRoutingService: ApplicationRoutingService,
    private ref: ChangeDetectorRef,
    private bsService: BottomSheetService,
    private recentsService: RecentsService,
    private modalController: ModalController,
    private followAnalyticService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getRecentMerchants();
    this.merchantCodeForm = this.fb.group({
      merchantCode: ['', [Validators.required]],
    });
  }

  checkMerchant() {
    this.hasErrorOnCheckMerchant = false;
    this.chekingMerchant = true;
    const code = this.merchantCodeForm.value.merchantCode;
    this.orangeMoneyService.getMerchantByCode(code).subscribe(
      (response: any) => {
        this.chekingMerchant = false;

        if (
          response &&
          response.status_code &&
          (response.status_code.match('Success') ||
            response.status_code.match('Erreur-601'))
        ) {
          const payload = {
            purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
            merchant: {
              name: response.content.data.nom_marchand,
              merchantCode: code,
            },
          };
          const infos = {
            sender: this.omMsisdn,
            receiver: code,
            operation: OPERATION_TYPE_MERCHANT_PAYMENT,
          };
          this.loginfosFollow('event', infos);
          this.applicationRoutingService.goSetAmountPage(payload);
          this.modalController.dismiss();
        } else {
          const infos = {
            sender: this.omMsisdn,
            receiver: code,
            operation: OPERATION_TYPE_MERCHANT_PAYMENT,
            error: response.status_wording,
          };
          this.loginfosFollow('error', infos);
          this.onCheckingMerchantError(response.status_wording);
        }
      },
      (err) => {
        const infos = {
          sender: this.omMsisdn,
          receiver: code,
          operation: OPERATION_TYPE_MERCHANT_PAYMENT,
          error: err.status,
        };
        this.loginfosFollow('error', infos);
        this.chekingMerchant = false;
        if (err.error.name) return;
        err && err.msg
          ? this.onCheckingMerchantError(err.msg)
          : this.onCheckingMerchantError();
      }
    );
  }

  onMyFavorites() {
    this.modalController.dismiss();
    this.bsService.openModal(FavoriteMerchantComponent);
  }

  onCheckingMerchantError(msg?: string) {
    this.hasErrorOnCheckMerchant = true;
    this.errorMsg = msg ? msg : 'Une erreur est survenue';
    this.ref.detectChanges();
  }

  onRecentMerchantSelected(merchant: any) {
    const payload = {
      purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
      merchant: merchant,
    };
    this.loginfosFollow('event', {
      sender: this.omMsisdn,
      receiver: merchant.merchantCode,
      operation: OPERATION_TYPE_MERCHANT_PAYMENT,
    });
    this.applicationRoutingService.goSetAmountPage(payload);
    this.modalController.dismiss();
  }

  getRecentMerchants() {
    this.loadingRecents = true;
    this.recentMerchants$ = this.recentsService
      .fetchRecents(OPERATION_TYPE_MERCHANT_PAYMENT, 3)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results = [];
          recents.forEach((el) => {
            results.push({
              name: JSON.parse(el.payload).nom_marchand,
              merchantCode: el.destinataire,
            });
          });
          return results;
        }),
        catchError((err) => {
          this.loadingRecents = false;
          return of([]);
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

  loginfosFollow(typeEvent: 'event' | 'error', infos: any) {
    if (typeEvent === 'event') {
      const follow = 'OM_Paiement_Marchand_Select_Recipient_success';
      console.log('follow', follow, 'infos', infos);

      this.followAnalyticService.registerEventFollow(follow, typeEvent, infos);
    } else {
      const follow = 'OM_Paiement_Marchand_Select_Recipient_error';
      console.log('followErr', follow, 'infos', infos);

      this.followAnalyticService.registerEventFollow(follow, 'error', infos);
    }
  }
}
