import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  SubscriptionModel,
} from 'src/shared';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OmSession } from 'src/app/models/om-session.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';
import { of, Observable } from 'rxjs';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { catchError, share, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'oem-number-selection',
  templateUrl: './number-selection.component.html',
  styleUrls: ['./number-selection.component.scss'],
})
export class NumberSelectionComponent implements OnInit {
  numbers$: Observable<string[]>;

  numberSelected: string = '';
  numberFromInput: string = '';

  isProcessing: boolean;
  showInput: boolean = true;
  phoneIsNotValid: boolean = false;

  omSession: OmSession = {};
  opXtras: OperationExtras = {};
  isErrorProcessing: boolean = false;
  canNotRecieve: boolean;
  canNotRecieveError: boolean = false;
  @Input() data;
  constructor(
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private router: Router,
    private followAnalytics: FollowAnalyticsService,
    private dashbServ: DashboardService,
    private authService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.numbers$ = this.dashbServ.fetchOemNumbers().pipe(
      tap((numbers)=>{
        if(numbers && numbers.length)
          this.opXtras.recipientMsisdn = numbers[0];
      }),
      share()
      );
    this.checkOmAccountSession();
  }

  async onContinue() {
    if (!REGEX_NUMBER_OM.test(this.opXtras.recipientMsisdn)) {
      this.phoneIsNotValid = true;
      return;
    }

    this.opXtras.recipientMsisdn = formatPhoneNumber(
      this.opXtras.recipientMsisdn
    );
    this.opXtras.forSelf = !this.showInput;

    if (!(await this.canRecieveCredit())) {
      this.canNotRecieve = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.disMissBottomSheet();
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

  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe(
      (omSession: any) => {
        this.omSession = omSession;
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();

        if (
          omSession.msisdn === 'error' ||
          !omSession.hasApiKey ||
          !omSession.accessToken ||
          omSession.loginExpired
        ) {
          this.modalController.dismiss();
          this.openPinpad();
        }

        if (omSession.msisdn !== 'error')
          this.opXtras.senderMsisdn = omSession.msisdn;
      },
      (error) => {
        this.modalController.dismiss();

        this.isErrorProcessing = true;
      }
    );
  }

  async canRecieveCredit() {
    if (this.opXtras.forSelf) return true;
    this.isProcessing = true;
    let canRecieve = await this.authService
      .canRecieveCredit(this.opXtras.recipientMsisdn)
      .pipe(
        catchError((er: HttpErrorResponse) => {
          if (er.status === 401) this.modalController.dismiss();
          return of(false);
        })
      )
      .toPromise();
    this.isProcessing = false;
    return canRecieve;
  }

  disMissBottomSheet() {
    this.modalController.dismiss(this.opXtras);
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
