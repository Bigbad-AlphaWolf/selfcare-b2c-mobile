import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {Uid} from '@ionic-native/uid/ngx';
import {NavController, ModalController} from '@ionic/angular';
import {of, Subject, Subscription, timer} from 'rxjs';
import {tap, catchError, takeUntil, finalize, switchMap} from 'rxjs/operators';
import {OMCustomerStatusModel} from 'src/app/models/om-customer-status.model';
import {OmInitOtpModel, OmCheckOtpModel} from 'src/app/models/om-self-operation-otp.model';
import {OperationSuccessFailModalPage} from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import {MSISDN_RECUPERATION_TIMEOUT} from 'src/app/register';
import {
  AuthenticationService,
  ConfirmMsisdnModel
} from 'src/app/services/authentication-service/authentication.service';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {ImageService} from 'src/app/services/image-service/image.service';
import {
  getAge,
  ID_CARD_CARACTERS_MIN_LENGTH,
  SUCCESS_MSG_OM_ACCOUNT_CREATION
} from 'src/app/services/orange-money-service';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {dateValidatorLessThan, parseDate} from 'src/app/utils/utils';
import {HelpModalRegisterOMContent, OPERATION_OPEN_OM_ACCOUNT} from 'src/shared';
import {CommonIssuesComponent} from 'src/shared/common-issues/common-issues.component';
import { ImpliciteAuthenticationModalComponent } from '../../components/implicite-authentication-modal/implicite-authentication-modal.component';
import {TypeOtpModalComponent} from '../../components/type-otp-modal/type-otp-modal.component';

@Component({
  selector: 'app-open-om-account',
  templateUrl: './open-om-account.page.html',
  styleUrls: ['./open-om-account.page.scss']
})
export class OpenOmAccountPage implements OnInit, OnDestroy {
  personalInfosForm: FormGroup = this.formBuilder.group(
    {
      civility: [null, [Validators.required]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      firstname: [null, [Validators.required, Validators.minLength(2)]],
      birthdate: [null, [Validators.required]],
      nIdentity: [null, [Validators.required]],
      identityType: ['CNI', [Validators.required]],
      delivery_date: [null, [Validators.required]],
      expiry_date: [null, [Validators.required]]
    },
    {validators: dateValidatorLessThan('delivery_date', 'expiry_date')}
  );
  rectoFilled: boolean;
  rectoImage: any;
  rectoFileName = 'recto.jpg';
  versoFilled: boolean;
  versoImage: any;
  versoFileName = 'verso.jpg';
  selfieFilled: boolean;
  selfieImage: any;
  selfieFileName = 'selfie.jpg';
  acceptCGU: boolean;
  omMsisdn: string;
  gettingOmNumber: boolean;
  getMsisdnHasError: boolean;
  checkingStatus: boolean;
  userOmStatus: OMCustomerStatusModel;
  checkStatusError: boolean;
  omMessage: string;
  hasErrorsubmit: boolean;
  generatingOtp: boolean;
  userInfos: any;
  msgSubmitError: string;
  maxBirthYearAuthorized = (new Date().getFullYear() - 18).toString();
  isUserAgeInvalid: boolean;
  isUserIDInvalid: boolean;
  selectedNumber: string;
  isSelectedNumberValid = false;
  gettingNumber: boolean;
  authErrorDetected = new Subject<any>();
  newtworkSubscription: Subscription;
  errorGettingNumber: string;
  userAuthImplicitInfos: ConfirmMsisdnModel;
  maxYear = new Date().getFullYear() + 30;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private modalController: ModalController,
    private dashbServ: DashboardService,
    private followAnalyticsServ: FollowAnalyticsService,
    private authServ: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService,
    private network: Network,
    private uid: Uid,
    private ngZone: NgZone,
    private imgServ: ImageService
  ) {
    this.authErrorDetected.subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.openHelpModal(HelpModalRegisterOMContent);
        });
      }
    });
  }

  ngOnInit() {
    this.openAuthenticationImplicitModal();
  }

	ngOnDestroy() {
    if (this.newtworkSubscription) {
      this.newtworkSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getStepImage();
  }

  initPage() {
    this.checkStatus();
    this.setUserInfos();
  }

  setUserInfos() {
    this.dashbServ
      .getCustomerInformations()
      .pipe(
        tap((res: {givenName?: string; familyName?: string; birthDate?: string; gender?: 'MALE' | 'FEMALE'}) => {
          this.personalInfosForm.patchValue({
            civility: res.gender === 'MALE' ? 'MR' : res.gender === 'FEMALE' ? 'MRS' : null
          });
          this.personalInfosForm.patchValue({firstname: res.givenName});
          this.personalInfosForm.patchValue({lastname: res.familyName});
          this.personalInfosForm.patchValue({birthdate: new Date(res.birthDate).toISOString()});
        })
      )
      .subscribe();
  }

  checkStatus() {
    this.checkingStatus = true;
    this.checkStatusError = false;
    this.fetchUserOMStatus(this.selectedNumber).subscribe(
      status => {
        this.omMsisdn = status.omNumber;
        this.userOmStatus = status;
        this.checkingStatus = false;
        if (this.isEligibleToOpenOMAccount(status)) {
          this.followAnalyticsServ.registerEventFollow('open_om_acccount_affichage_formulaire', 'event', {
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.omMsisdn,
            typeDemande: status.operation,
            status: status.operationStatus
          });
        } else if (this.isEligibleToSuiviOpenOMAccount(status)) {
          this.followAnalyticsServ.registerEventFollow('open_om_acccount_affichage_suivi', 'event', {
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.omMsisdn,
            status: status.operationStatus,
            typeDemande: status.operation
          });
        }
      },
      err => {
        this.checkingStatus = false;
        this.followAnalyticsServ.registerEventFollow('open_om_acccount_affichage_error', 'error', {
          userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
          omMsisdn: this.omMsisdn,
          error: err
        });
        this.checkStatusError = true;
      }
    );
  }

  fetchUserOMStatus(msisdn: string) {
    return this.orangeMoneyService.getUserStatus(msisdn);
  }

  getStepImage() {
    const state = history.state;
    const step = state ? state.step : null;
    switch (step) {
      case 'recto':
        this.rectoFilled = true;
        this.rectoImage = this.imgServ.removeBase64Prefix(state.image);
        break;
      case 'verso':
        this.versoFilled = true;
        this.versoImage = this.imgServ.removeBase64Prefix(state.image);
        break;
      case 'selfie':
        this.selfieFilled = true;
        this.selfieImage = this.imgServ.removeBase64Prefix(state.image);
        break;
      default:
        break;
    }
  }

  generateOtp() {
    this.hasErrorsubmit = false;
    if (this.personalInfosForm.valid && this.rectoFilled && this.versoFilled && this.selfieFilled && this.acceptCGU) {
      let otpPayload: OmInitOtpModel = {
        msisdn: this.omMsisdn,
        first_name: this.personalInfosForm.value.firstname,
        last_name: this.personalInfosForm.value.lastname,
        birth_date: parseDate(this.personalInfosForm.value.birthdate),
        civilite: this.personalInfosForm.value.civility,
        cniRectoBase64: this.rectoImage,
        cniVectoBase64: this.versoImage,
        cni_recto: this.rectoImage,
        cni_verso: this.versoImage,
        id_num: this.personalInfosForm.value.nIdentity,
        type_piece: this.personalInfosForm.value.identityType,
        adresse: 'adresse',
        delivery_date: parseDate(this.personalInfosForm.value.delivery_date),
        expiry_date: parseDate(this.personalInfosForm.value.expiry_date),
        hmac2: this.userOmStatus.hmac
      };
      this.generatingOtp = true;
      this.orangeMoneyService.initSelfOperationOtp(otpPayload).subscribe(
        (res: any) => {
          this.generatingOtp = false;
          this.followAnalyticsServ.registerEventFollow('open_om_account_init_otp_success', 'event', {
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.omMsisdn
          });
          this.openTypeOtpModal(otpPayload, res.content.data.hmac);
        },
        err => {
          this.hasErrorsubmit = true;
          this.generatingOtp = false;
          this.followAnalyticsServ.registerEventFollow('open_om_account_init_otp_failed', 'error', {
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.omMsisdn,
            error: err
          });
          this.msgSubmitError = 'Une erreur est survenue';
        }
      );
    } else {
      this.hasErrorsubmit = true;
      this.msgSubmitError = 'Veuillez remplir correctement toutes les infos avant de valider';
    }
  }

  async openTypeOtpModal(initOtpPayload: OmInitOtpModel, hmac?: string) {
    const checkOtpPayload: OmCheckOtpModel = {
      kyc: initOtpPayload,
      channel: 'OeM',
      cniRectoBase64: this.rectoImage,
      cniVersoBase64: this.versoImage,
      imageBase64: this.selfieImage,
      msisdn: this.omMsisdn,
      typeDemande: 'INSCRIPTION',
      hmac
    };
    const modal = await this.modalController.create({
      component: TypeOtpModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {checkOtpPayload}
    });
    modal.onDidDismiss().then(resp => {
      if (resp && resp.data && resp.data.accept) {
        this.openSuccessModal();
      }
    });
    return await modal.present();
  }

  async openAuthenticationImplicitModal() {
    const modal = await this.modalController.create({
      component: ImpliciteAuthenticationModalComponent,
      cssClass: 'select-recipient-modal'
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data) {

				this.userAuthImplicitInfos = resp?.data?.infosAuthImplicit;
				this.selectedNumber = this.userAuthImplicitInfos?.msisdn;
        this.initPage();
      } else {
				this.goBack()
			}
    });
    return await modal.present();
  }

  clearInput() {
    this.personalInfosForm.patchValue({nIdentity: null});
  }

  openSuccessModal() {
    this.showModal({purchaseType: OPERATION_OPEN_OM_ACCOUNT, textMsg: SUCCESS_MSG_OM_ACCOUNT_CREATION});
  }

  goBack() {
    this.navController.pop();
  }

  toggleAcceptCGU() {
    this.acceptCGU = !this.acceptCGU;
  }

  takePicture(step?: 'recto' | 'verso' | 'selfie') {
    this.router.navigate(['om-self-operation/take-picture'], {
      state: {step, operation: 'OUVERTURE_COMPTE'}
    });
  }

  removePicture(step: 'recto' | 'verso' | 'selfie') {
    switch (step) {
      case 'recto':
        this.rectoFilled = false;
        this.rectoImage = null;
        break;
      case 'verso':
        this.versoFilled = false;
        this.versoImage = null;
        break;
      case 'selfie':
        this.selfieFilled = false;
        this.selfieImage = null;
        break;
      default:
        break;
    }
  }

  async showModal(data: {purchaseType: string; textMsg: string}) {
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  isEligibleToOpenOMAccount(userStatus: OMCustomerStatusModel) {
    return userStatus && userStatus.operation === 'OUVERTURE_COMPTE' && userStatus.operationStatus === 'NEW';
  }

  isEligibleToSuiviOpenOMAccount(userStatus: OMCustomerStatusModel) {
    return userStatus && (userStatus.operation === 'OUVERTURE_COMPTE' || userStatus?.operation === 'FULL') && userStatus.operationStatus !== 'NEW';
  }

  checkAge(event: any) {
    const birthDate = event.detail.value;
    if (birthDate) {
      const age = getAge(new Date(birthDate));
      if (age < 18) {
        this.isUserAgeInvalid = true;
        event.target.value = null;
      } else {
        this.isUserAgeInvalid = false;
        console.log(event.target.value);
      }
    }
  }

  checkIdentityNumber(event: any) {
    this.isUserIDInvalid = false;
    if (event.target) {
      const value = event.srcElement.value.toString();
      if (
        this.personalInfosForm.value.identityType === 'CNI' &&
        value.length &&
        value.length < ID_CARD_CARACTERS_MIN_LENGTH
      ) {
        this.isUserIDInvalid = true;
        this.personalInfosForm.controls['identityType'].setErrors({incorrect: true});
      } else {
        this.isUserIDInvalid = false;
        this.personalInfosForm.controls['identityType'].setErrors(null);
      }
    }
  }

  getNumber() {
    const startTime = Date.now();
    this.gettingNumber = true;
    this.authServ
      .getMsisdnByNetwork()
      //if after msisdnTimeout milliseconds the call does not complete, stop it.
      .pipe(
        takeUntil(timer(MSISDN_RECUPERATION_TIMEOUT)),
        // finalize to detect whenever call is complete or terminated
        finalize(() => {
          if (!this.selectedNumber) {
            this.displayMsisdnError();
            this.authErrorDetected.next(HelpModalRegisterOMContent);
            console.log('http call is not successful');
          }
        }),
        switchMap((res: {msisdn: string}) => {
          this.selectedNumber = res.msisdn;
          return this.authServ.confirmMsisdnByNetwork(res.msisdn).pipe(
            tap(
              (response: ConfirmMsisdnModel) => {
                this.gettingNumber = false;
                if (response && response.status) {
                  response.msisdn = response.msisdn.substring(response.msisdn.length - 9);
                  this.selectedNumber = response.msisdn;
                  this.initPage();
                  const endTime = Date.now();
                  const elapsedSeconds = endTime - startTime;
                  const duration = `${elapsedSeconds} ms`;
                  console.log(duration);
                  this.userAuthImplicitInfos = response;
                  this.followAnalyticsService.registerEventFollow('User_msisdn_recuperation_success', 'event', {
                    msisdn: this.selectedNumber,
                    duration
                  });
                } else {
                  this.displayMsisdnError();
                }
              },
              () => {
                this.displayMsisdnError();
              }
            )
          );
        }),
        catchError(() => {
          this.displayMsisdnError();
          return of();
        })
      )
      .subscribe();
  }

  displayMsisdnError() {
    this.gettingNumber = false;
    this.isSelectedNumberValid = true;
    this.errorGettingNumber = `La récupération du numéro ne s'est pas bien passée. Cliquez ici pour réessayer`;
    let connexion: string;
    this.newtworkSubscription = this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        connexion = this.network.type;
        this.followAnalyticsService.registerEventFollow('User_msisdn_recuperation_failed', 'error', {
          imei: this.uid.IMEI,
          connexion
        });
      }, 3000);
    });
  }

  async openHelpModal(sheetData?: any) {
    const modal = await this.modalController.create({
      component: CommonIssuesComponent,
      cssClass: 'besoin-daide-modal',
      componentProps: {data: sheetData}
    });
    return await modal.present();
  }
}
