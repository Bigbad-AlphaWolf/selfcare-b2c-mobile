import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavController} from '@ionic/angular';
import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {OPERATION_CHANGE_PIN_OM, OPERATION_CREATE_PIN_OM, REGEX_IOS_SYSTEM} from 'src/shared';
import {ChangePinOm} from '../models/change-pin-om.model';
import {NewPinpadModalPage} from '../new-pinpad-modal/new-pinpad-modal.page';
import {OrangeMoneyService} from '../services/orange-money-service/orange-money.service';
import {UuidService} from '../services/uuid-service/uuid.service';
import * as SecureLS from 'secure-ls';
import {OperationSuccessFailModalPage} from '../operation-success-fail-modal/operation-success-fail-modal.page';
import {INITIALISE_PIN_OM_MSG, ORANGE_MONEY_DEFAULT_PIN, SUCCESS_CHANGE_PIN_MSG} from '../services/orange-money-service';
import {FollowAnalyticsService} from '../services/follow-analytics/follow-analytics.service';
import {getPageHeader} from '../utils/title.util';
import {PageHeader} from '../models/page-header.model';
import {ConfirmMsisdnModel} from '../services/authentication-service/authentication.service';
import {CreatePinOM} from '../models/create-pin-om.model';
const ls = new SecureLS({encodingType: 'aes'});

@Component({
  selector: 'app-change-orange-money-pin',
  templateUrl: './change-orange-money-pin.page.html',
  styleUrls: ['./change-orange-money-pin.page.scss']
})
export class ChangeOrangeMoneyPinPage implements OnInit {
  form: FormGroup;
  loading: boolean;
  omInfos: {apiKey?: string; em: string; loginToken?: string; msisdn?: string; sequence: string; pin?: string};
  hasError: boolean;
  errorMsg: string;
  birthYear: string;
  DEFAULT_ERROR_CHANGE_PIN_REQUEST = 'Une erreur est survenue. Veuillez réessayer';
  DEFAULT_ERROR_VALIDATION_FORMS = "Les champs renseignés doivent être conformes et être différents de l'ancien code secret";
  DEFAULT_ERROR_VALIDATION_CREATE_PIN_FORMS = 'Les champs renseignés doivent être conformes';
  operationType = OPERATION_CHANGE_PIN_OM;
  pageInfos: PageHeader;
  authImplicitInfos: ConfirmMsisdnModel;
  constructor(
    private fb: FormBuilder,
    private mdCtrl: ModalController,
    private omServ: OrangeMoneyService,
    private uuidServ: UuidService,
    private navCtrl: NavController,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      pin: ['', [Validators.required]],
      confirmPin: ['', [Validators.required]]
    });
    this.omInfos = history.state && history.state.omUserInfos ? history.state.omUserInfos : null;
    this.birthYear = history.state && history.state.birthYear ? history.state.birthYear : null;

    this.followAnalyticsService.registerEventFollow('Change_Pin_OM_page', 'event');
    this.getOrangeMoneyOperationInfos();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getOrangeMoneyOperationInfos() {
    const operation = history?.state?.operation;
    const payload = history?.state?.payload;
    if (operation) this.operationType = operation;
    if (payload) this.authImplicitInfos = payload;
    this.pageInfos = getPageHeader(this.operationType);
  }

  changePinOM() {
    this.loading = true;
    let isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);

    const newPin = this.form.value.pin;
    const confirmNewPin = this.form.value.confirmPin;
    const uuid = this.uuidServ.getUuid();
    const os = isIOS ? 'iOS' : 'Android';

    const data: ChangePinOm = {
      msisdn: this.omInfos.msisdn,
      pin: this.omInfos.pin,
      new_pin: newPin,
      confirm_pin: confirmNewPin,
      em: this.omInfos.em,
      uuid: uuid,
      os: os,
      channel: 'selfcare',
      app_version: 'v1.0',
      conf_version: 'v1.0',
      service_version: 'v1.0',
      type: 'CLIENT',
      is_primo: false
    };
    this.omServ
      .changePin(data)
      .pipe(
        tap(() => {
          this.loading = false;
          this.showModal({purchaseType: OPERATION_CHANGE_PIN_OM, textMsg: SUCCESS_CHANGE_PIN_MSG});
          this.followAnalyticsService.registerEventFollow('Change_Pin_OM_success', 'event', {
            msisdn: this.omInfos.msisdn
          });
        }),
        catchError((err: any) => {
          this.loading = false;
          this.hasError = true;
          this.errorMsg = this.DEFAULT_ERROR_CHANGE_PIN_REQUEST;
          this.followAnalyticsService.registerEventFollow('Change_Pin_OM_failed', 'error', {
            msisdn: this.omInfos.msisdn,
            error: err && err.error && err.error.message ? err.error.message : err.status
          });
          return of(err);
        })
      )
      .subscribe();
  }

  createPinOM() {
    if (this.isInputsValid()) {
			this.loading = true;
      const default_pin = this.omServ.GetPin(this.omInfos.sequence.split(''), ORANGE_MONEY_DEFAULT_PIN);
      const payload: CreatePinOM = {
        em: this.omInfos.em,
        confirm_pin: this.form.value.confirmPin,
        new_pin: this.form.value.pin,
        pin: default_pin,
        hmac: this.authImplicitInfos.hmac,
        msisdn: this.authImplicitInfos.msisdn
      };
      this.omServ
        .createFirstOmPin(payload, this.authImplicitInfos.api_key)
        .pipe(
          tap(
            (res: any) => {
							this.loading = false;
							this.showModal({purchaseType: OPERATION_CHANGE_PIN_OM, textMsg: INITIALISE_PIN_OM_MSG});
							this.followAnalyticsService.registerEventFollow('Create_Pin_OM_success', 'event', {
								msisdn: this.omInfos.msisdn
							});
            }
          ),
					catchError(err => {
						this.loading = false;
						this.hasError = true;
						this.errorMsg = this.DEFAULT_ERROR_CHANGE_PIN_REQUEST;
						this.followAnalyticsService.registerEventFollow('Create_Pin_OM_failed', 'error', {
							msisdn: this.omInfos.msisdn,
							error: err && err.error && err.error.message ? err.error.message : err.status
						});
						return of(err);
					})
        )
        .subscribe();
    }
  }

  processPageData() {
    this.hasError = !this.isInputsValid();
    if (!this.hasError) {
      switch (this.operationType) {
        case OPERATION_CHANGE_PIN_OM:
          this.changePinOM();
          break;
        case OPERATION_CREATE_PIN_OM:
          this.createPinOM();
        default:
          break;
      }
    } else {
      this.errorMsg =
        this.operationType === OPERATION_CHANGE_PIN_OM
          ? this.DEFAULT_ERROR_VALIDATION_FORMS
          : this.DEFAULT_ERROR_VALIDATION_CREATE_PIN_FORMS;
    }
  }

  async openBasicPinpad(inputType: 'PIN' | 'CONFIRM_PIN') {
    const modal = await this.mdCtrl.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: this.operationType,
        omInfos: {...this.omInfos, birthYear: this.birthYear},
        payloadCreatePin: this.authImplicitInfos
      }
    });
    modal.onDidDismiss().then(resp => {
      if (resp && resp.data) {
        if (inputType === 'PIN') {
          const pin = resp.data.pin;
          this.form.value.pin = pin;
        } else if (inputType === 'CONFIRM_PIN') {
          const pin = resp.data.pin;
          this.form.value.confirmPin = pin;
        }
        if (resp.data.omInfos) this.omInfos = resp.data.omInfos;
      }
    });
    return await modal.present();
  }

  isInputsValid(): boolean {
    let isValid = true;
    if (
      this.form.value.pin !== this.form.value.confirmPin ||
      (this.form.value.pin === this.form.value.confirmPin && this.form.value.pin === this.omInfos.pin)
    ) {
      isValid = false;
    }
    return isValid;
  }

  async showModal(data: {purchaseType: string; textMsg: string}) {
    const modal = await this.mdCtrl.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }
}
