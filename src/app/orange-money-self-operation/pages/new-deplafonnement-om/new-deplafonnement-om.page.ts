import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OPERATION_OPEN_OM_ACCOUNT } from 'src/shared';
import { OMCustomerStatusModel } from '../../../models/om-customer-status.model';
import {
  OmCheckOtpModel,
  OmInitOtpModel,
} from '../../../models/om-self-operation-otp.model';
import { NewPinpadModalPage } from '../../../new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from '../../../operation-success-fail-modal/operation-success-fail-modal.page';
import { DashboardService } from '../../../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../../../services/follow-analytics/follow-analytics.service';
import { getAge, ID_CARD_CARACTERS_MIN_LENGTH, SUCCESS_MSG_OM_ACCOUNT_DEPLAFONNEMENT } from '../../../services/orange-money-service';
import { OrangeMoneyService } from '../../../services/orange-money-service/orange-money.service';
import { TypeOtpModalComponent } from '../../components/type-otp-modal/type-otp-modal.component';

@Component({
  selector: 'app-new-deplafonnement-om',
  templateUrl: './new-deplafonnement-om.page.html',
  styleUrls: ['./new-deplafonnement-om.page.scss'],
})
export class NewDeplafonnementOmPage implements OnInit {
  personalInfosForm: FormGroup;
  rectoFilled: boolean;
  rectoImage: any;
  rectoFileName = 'recto.jpg';
  versoFilled: boolean;
  versoImage: any;
  versoFileName= 'verso.jpg';
  selfieFilled: boolean;
  selfieImage: any;
  selfieFileName = 'selfie.jpg';
  acceptCGU: boolean = true;
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
  maxBirthYearAuthorized = (new Date().getFullYear() - 18).toString() ;
  isUserAgeInvalid: boolean;
  isUserIDInvalid: boolean;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private modalController: ModalController,
    private dashbServ: DashboardService,
    private followAnalyticsServ: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getOmMsisdn().subscribe();
  }

  ionViewWillEnter() {
    this.getStepImage();
  }


  initForms() {
    this.personalInfosForm = this.formBuilder.group({
      civility: [null, [Validators.required]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      firstname: [null, [Validators.required, Validators.minLength(2)]],
      birthdate: [null, [Validators.required]],
      nIdentity: [null, [Validators.required]],
      identityType: ['CNI', [Validators.required]],
    });
  }

  setUserInfos() {
    this.dashbServ.getCustomerInformations().pipe(tap((res: {givenName?: string, familyName?: string, birthDate?: string, gender?: 'MALE' | 'FEMALE'}) => {
      this.personalInfosForm.patchValue({ civility: res.gender === 'MALE' ? 'monsieur' : res.gender === 'FEMALE' ? 'madame' : null })
      this.personalInfosForm.patchValue({ firstname: res.givenName })
      this.personalInfosForm.patchValue({ lastname: res.familyName })
      this.personalInfosForm.patchValue({ birthdate: new Date(res.birthDate).toISOString() });
    })).subscribe();
  }

  checkStatus(msisdn: string) {
    this.checkingStatus = true;
    this.checkStatusError = false;
    this.orangeMoneyService.getUserStatus(msisdn).subscribe(
      (status) => {
        this.omMsisdn = status.omNumber;
        this.userOmStatus = status;
        this.checkingStatus = false;
        if (this.isElligibleToDeplafonnement(status)) {
          this.followAnalyticsServ.registerEventFollow('deplafonnement_om_affichage_formulaire', 'event', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn, typeDemande: status.operation, status: status.operationStatus })
        } else if(this.isElligibleToSuiviDeplafonnement(status)) {
          this.followAnalyticsServ.registerEventFollow('deplafonnement_om_affichage_suivi_deplafonnement', 'event', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn, status: status.operationStatus, typeDemande: status.operation })
        }
      },
      (err) => {
        this.checkingStatus = false;
        this.followAnalyticsServ.registerEventFollow('deplafonnement_om_affichage_error', 'error', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn, error: err })
        if (err === 'NO_OM_ACCOUNT') this.openPinpad();
        this.checkStatusError = true;
      }
    );
  }

  getOmMsisdn() {
    this.getMsisdnHasError = false;
    this.gettingOmNumber = true;
    return this.orangeMoneyService.getOmMsisdn().pipe(tap((msisdn: string) => {
      this.gettingOmNumber = false;
      if (msisdn.match('error')) {
        this.openPinpad();
        this.getMsisdnHasError = true;
        this.followAnalyticsServ.registerEventFollow('deplafonnement_om_recuperation_numéro_msisdn_failed', 'error', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), error: 'no om number registered' })
        throw new Error();
      } else {
        this.omMsisdn = msisdn;
        this.followAnalyticsServ.registerEventFollow('deplafonnement_om_recuperation_numéro_msisdn_success', 'event', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn })
        this.checkStatus(msisdn);
        this.initForms();
        this.setUserInfos();
      }
    }), catchError((err: any) => {
      this.getMsisdnHasError = true;
      this.followAnalyticsServ.registerEventFollow('deplafonnement_om_recuperation_numéro_msisdn_failed', 'error', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), error: err });
      return of(err)
    }));
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.getOmMsisdn().subscribe();
      } else {
        this.router.navigate(['/assistance-hub']);
      }
    });
    return await modal.present();
  }

  getStepImage() {
    const state = history.state;
    const step = state ? state.step : null;
    switch (step) {
      case 'recto':
        this.rectoFilled = true;
        this.rectoImage = state.image;
        break;
      case 'verso':
        this.versoFilled = true;
        this.versoImage = state.image;
        break;
      case 'selfie':
        this.selfieFilled = true;
        this.selfieImage = state.image;
        break;
      default:
        break;
    }
  }

  generateOtp() {
    this.hasErrorsubmit = false;
    if(this.personalInfosForm.valid && this.rectoFilled && this.versoFilled && this.selfieFilled && this.acceptCGU) {
      let otpPayload: OmInitOtpModel = {
        msisdn: this.omMsisdn,
        first_name: this.personalInfosForm.value.firstname,
        last_name: this.personalInfosForm.value.lastname,
        birth_date: this.personalInfosForm.value.birthdate,
        civilite: this.personalInfosForm.value.civility,
        cniRectoBase64: this.rectoImage,
        cniVectoBase64: this.versoImage,
        cni_recto: this.rectoImage,
        cni_verso: this.versoImage,
        id_num: this.personalInfosForm.value.nIdentity,
        type_piece: this.personalInfosForm.value.identityType,
        adresse: 'adresse',
        delivery_date: 'delivery_date',
        expiry_date: 'expiry_date',
        hmac2: this.userOmStatus.hmac
      };
      this.generatingOtp = true;
      this.orangeMoneyService.initSelfOperationOtp(otpPayload).subscribe(
        (res: any) => {
          this.generatingOtp = false;
          this.followAnalyticsServ.registerEventFollow('deplafonnement_om_init_otp_success', 'event', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn });
          this.openTypeOtpModal(otpPayload, res.content.data.hmac);
        },
        (err) => {
          this.hasErrorsubmit = true;
          this.generatingOtp = false;
          this.followAnalyticsServ.registerEventFollow('deplafonnement_om_init_otp_failed', 'error', {userMsisdn: this.dashbServ.getCurrentPhoneNumber(), omMsisdn: this.omMsisdn, error: err });
          this.msgSubmitError = 'Une erreur est survenue';
        }
      );
    } else {
      this.hasErrorsubmit = true;
      this.msgSubmitError = 'Veuillez remplir correctement toutes les infos avant de valider'
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
      typeDemande: 'UPGRADE',
      hmac
    };
    const modal = await this.modalController.create({
      component: TypeOtpModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: { checkOtpPayload },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.accept) {
        this.openSuccessModal();
      }
    });
    return await modal.present();
  }

  clearInput() {
    this.personalInfosForm.patchValue({ 'nIdentity' : null });
  }

  openSuccessModal() {
    this.showModal({purchaseType: OPERATION_OPEN_OM_ACCOUNT , textMsg: SUCCESS_MSG_OM_ACCOUNT_DEPLAFONNEMENT });
  }

  goBack() {
    this.navController.pop();
  }

  toggleAcceptCGU() {
    this.acceptCGU = !this.acceptCGU;
  }

  takePicture(step?: 'recto' | 'verso' | 'selfie') {
    this.router.navigate(['/om-self-operation/take-picture'], {
      state: { step, operation: 'DEPLAFONNEMENT' },
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

  async showModal(data: {purchaseType: string, textMsg: string}){
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  isElligibleToDeplafonnement(userStatus: OMCustomerStatusModel){
    return userStatus && userStatus.operation === 'DEPLAFONNEMENT' && userStatus.operationStatus === 'NEW'
  }

  isElligibleToSuiviDeplafonnement(userStatus: OMCustomerStatusModel){
    return userStatus && (userStatus.operation === 'DEPLAFONNEMENT' || userStatus.operation === 'FULL') && userStatus.operationStatus !== 'NEW'
  }

  checkAge(event: any) {
    const birthDate = event.detail.value;
    if(birthDate) {
      const age = getAge(new Date(birthDate));
      if (age < 18) {
        this.isUserAgeInvalid = true;
        event.target.value = null;
      } else {
        this.isUserAgeInvalid = false;
      }
    }
  }

  checkIdentityNumber(event: any) {
    this.isUserIDInvalid = false;
    if(event.target) {
      const value = event.srcElement.value.toString();
      if(this.personalInfosForm.value.identityType === 'CNI' && value.length && value.length < ID_CARD_CARACTERS_MIN_LENGTH ) {
        this.isUserIDInvalid = true;
        this.personalInfosForm.controls['identityType'].setErrors({'incorrect': true});
      } else {
        this.isUserIDInvalid = false;
        this.personalInfosForm.controls['identityType'].setErrors(null);
      }
    }
  }
}
