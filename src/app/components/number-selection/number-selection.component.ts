import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  SubscriptionModel,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
} from 'src/shared';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OmSession } from 'src/app/models/om-session.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { of, Observable } from 'rxjs';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { catchError, share, tap, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';

@Component({
  selector: 'oem-number-selection',
  templateUrl: './number-selection.component.html',
  styleUrls: ['./number-selection.component.scss'],
})
export class NumberSelectionComponent implements OnInit {
  numbers$: Observable<string[]> = of(['782363572', '776148081', '776148080']);
  recentsRecipients$: Observable<any[]>;

  numberSelected: string = '';
  numberFromInput: string = '';

  isProcessing: boolean;
  showInput: boolean = false;
  phoneIsNotValid: boolean = false;

  omSession: OmSession = {};
  opXtras: OperationExtras = {};
  isErrorProcessing: boolean = false;
  canNotRecieve: boolean;
  canNotRecieveError: boolean = false;
  option: NumberSelectionOption = NumberSelectionOption.WITH_MY_PHONES;
  @Input() data;

  constructor(
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private dashbServ: DashboardService,
    private authService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef,
    private recentsService: RecentsService
  ) {}

  ngOnInit() {
    this.option = this.data.option;
    this.showInput = this.option === NumberSelectionOption.NONE;
    this.numbers$ = this.dashbServ.fetchOemNumbers().pipe(
      tap((numbers) => {
        if (numbers && numbers.length)
          this.opXtras.recipientMsisdn = numbers[0];
      }),
      share()
    );
    this.opXtras.senderMsisdn = SessionOem.PHONE;
    this.checkOmAccount();
  }

  getRecents() {
    this.recentsRecipients$ = this.recentsService
      .fetchRecents(this.data.purchaseType)
      .pipe(
        map((recents: RecentsOem[]) => {
          let results = [];
          recents = recents.slice(0, 2);
          recents.forEach((el) => {
            results.push({
              name: el.destinataire,
              msisdn: el.destinataire,
            });
          });
          return results;
        })
      );
  }

  onRecentSelected(recent) {}

  async onContinue(recent?: string) {
    if (!REGEX_NUMBER_OM.test(this.opXtras.recipientMsisdn)) {
      this.phoneIsNotValid = true;
      return;
    }

    this.opXtras.destinataire = this.opXtras.recipientMsisdn = formatPhoneNumber(
      this.opXtras.recipientMsisdn
    );
    if (recent) {
      this.opXtras.destinataire = this.opXtras.recipientMsisdn = formatPhoneNumber(
        recent
      );
    }
    this.opXtras.forSelf = !this.showInput;

    if (!(await this.canRecieveCredit())) {
      this.canNotRecieve = true;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.dismissBottomSheet();
  }

  dismissBottomSheet() {
    this.isProcessing = true;
    this.authService.getSubscriptionForTiers(this.opXtras.recipientMsisdn).subscribe(
      (res: SubscriptionModel) => {
        this.isProcessing = false;
        this.opXtras.code = res.code;
        this.opXtras.profil = res.profil;
        this.modalController.dismiss(this.opXtras);
        // this.bottomSheetRef.dismiss(this.opXtras);
      },
      (err: any) => {
        this.isProcessing = false;
        this.modalController.dismiss();
        // this.bottomSheetRef.dismiss();
      }
    );
  }

  onPhoneSelected(opContacts: OperationExtras) {
    this.opXtras = opContacts;
    this.numberFromInput = opContacts.recipientMsisdn;
    this.disableErrorMessages();
  }

  onOptionChange(value: string) {
    this.showInput = value === 'AUTRE';
    this.opXtras.recipientMsisdn = this.showInput
      ? this.numberFromInput
      : value;
    this.disableErrorMessages();
  }
  disableErrorMessages() {
    this.phoneIsNotValid = false;
    this.canNotRecieve = false;
  }

  checkOmAccount() {
    this.isProcessing = true;
    this.omService.getOmMsisdn().subscribe(
      (msisdn: any) => {
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();

        if (
          msisdn === 'error' &&
          this.data.purchaseType === OPERATION_TYPE_RECHARGE_CREDIT
        ) {//force user to have om account
          this.modalController.dismiss();
          this.openPinpad();
        }

        if (msisdn !== 'error') {
          this.opXtras.senderMsisdn = msisdn;
          this.getRecents();
        }
      },
      () => {
        this.modalController.dismiss();
        this.isErrorProcessing = true;
      }
    );
  }

  async canRecieveCredit() {
    if (this.opXtras.forSelf) return true;

    let canRecieve = await this.authService
      .canRecieveCredit(this.opXtras.recipientMsisdn)
      .pipe(
        catchError((er: HttpErrorResponse) => {
          if (er.status === 401) this.modalController.dismiss();
          return of(false);
        })
      )
      .toPromise();
    return canRecieve;
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.omSession.loginExpired = false;
      }
    });
    return await modal.present();
  }
}
