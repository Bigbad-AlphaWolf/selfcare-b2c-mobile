import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { OPERATION_OPEN_OM_ACCOUNT } from 'src/shared';
import { OMCustomerStatusModel } from '../models/om-customer-status.model';
import {
  OmCheckOtpModel,
  OmInitOtpModel,
} from '../models/om-self-operation-otp.model';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { SUCCESS_MSG_OM_ACCOUNT_CREATION } from '../services/orange-money-service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { TypeOtpModalComponent } from './components/type-otp-modal/type-otp-modal.component';

@Component({
  selector: 'app-new-deplafonnement-om',
  templateUrl: './new-deplafonnement-om.page.html',
  styleUrls: ['./new-deplafonnement-om.page.scss'],
})
export class NewDeplafonnementOmPage implements OnInit {
  personalInfosForm: FormGroup;
  identityForm: FormGroup;
  rectoFilled: boolean;
  rectoImage: any;
  rectoFileName: string;
  versoFilled: boolean;
  versoImage: any;
  versoFileName: string;
  selfieFilled: boolean;
  selfieImage: any;
  selfieFileName: string;
  acceptCGU: boolean;
  omMsisdn: string;
  gettingOmNumber: boolean;
  getMsisdnHasError: boolean;
  checkingStatus: boolean;
  userOmStatus: OMCustomerStatusModel;
  checkStatusError: boolean;
  omMessage: string;
  initOtpError: boolean;
  generatingOtp: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForms();
    this.checkStatus();
    this.getOmMsisdn();
  }

  ionViewWillEnter() {
    this.getStepImage();
  }

  initForms() {
    this.personalInfosForm = this.formBuilder.group({
      civility: [null, [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      birthdate: [null, [Validators.required]],
    });
    this.identityForm = this.formBuilder.group({
      nIdentity: [null, [Validators.required]],
      identityType: ['CNI', [Validators.required]],
    });
  }

  checkStatus() {
    this.checkingStatus = true;
    this.checkStatusError = false;
    this.orangeMoneyService.getUserStatus().subscribe(
      (status) => {
        this.omMsisdn = status.omNumber;
        this.userOmStatus = status;
        this.checkingStatus = false;
      },
      (err) => {
        this.checkingStatus = false;
        if (err === 'NO_OM_ACCOUNT') this.openPinpad();
        this.checkStatusError = true;
      }
    );
  }

  getOmMsisdn() {
    this.getMsisdnHasError = false;
    this.gettingOmNumber = true;
    this.orangeMoneyService.getOmMsisdn().subscribe(
      (msisdn: string) => {
        this.gettingOmNumber = false;
        if (msisdn.match('error')) {
          this.openPinpad();
          this.getMsisdnHasError = true;
        } else {
          this.omMsisdn = msisdn;
        }
      },
      (err) => {
        this.getMsisdnHasError = true;
      }
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.getOmMsisdn();
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
      id_num: this.identityForm.value.nIdentity,
      type_piece: this.identityForm.value.identityType,
      adresse: 'adresse',
      delivery_date: 'delivery_date',
      expiry_date: 'expiry_date',
      hmac2: this.userOmStatus.hmac
    };
    this.initOtpError = false;
    this.generatingOtp = true;
    this.orangeMoneyService.initSelfOperationOtp(otpPayload).subscribe(
      (res: any) => {
        this.generatingOtp = false;
        this.openTypeOtpModal(otpPayload, res.content.data.hmac);
      },
      (err) => {
        this.initOtpError = true;
        this.generatingOtp = false;
      }
    );
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

  openSuccessModal() {
    this.showModal({purchaseType: OPERATION_OPEN_OM_ACCOUNT , textMsg: SUCCESS_MSG_OM_ACCOUNT_CREATION });
  }

  goBack() {
    this.navController.pop();
  }

  toggleAcceptCGU() {
    this.acceptCGU = !this.acceptCGU;
  }

  takePicture(step?: 'recto' | 'verso' | 'selfie') {
    this.router.navigate(['new-deplafonnement-om/take-picture'], {
      state: { step },
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
    return userStatus && userStatus.operation === 'DEPLAFONNEMENT' && userStatus.operationStatus !== 'NEW'
  }
}
