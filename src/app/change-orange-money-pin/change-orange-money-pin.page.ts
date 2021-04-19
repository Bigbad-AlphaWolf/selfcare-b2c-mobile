import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OPERATION_CHANGE_PIN_OM, REGEX_IOS_SYSTEM } from 'src/shared';
import { ChangePinOm } from '../models/change-pin-om.model';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { UuidService } from '../services/uuid-service/uuid.service';
import * as SecureLS from 'secure-ls';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { SUCCESS_CHANGE_PIN_MSG } from '../services/orange-money-service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-change-orange-money-pin',
  templateUrl: './change-orange-money-pin.page.html',
  styleUrls: ['./change-orange-money-pin.page.scss'],
})
export class ChangeOrangeMoneyPinPage implements OnInit {
  form: FormGroup;
  loading:boolean;
  omInfos: { apiKey: string,em: string,loginToken: string, msisdn: string, sequence: string, pin: string };
  hasError: boolean;
  errorMsg: string;
  birthYear: string;
  DEFAULT_ERROR_CHANGE_PIN_REQUEST = 'Une erreur est survenue. Veuillez réessayer';
  DEFAULT_ERROR_VALIDATION_FORMS = "Les champs renseignés doivent être conformes et être différents de l'ancien code secret";
  constructor(private fb: FormBuilder, private mdCtrl: ModalController, private omServ: OrangeMoneyService, private uuidServ: UuidService,
     private navCtrl: NavController, private followAnalyticsService: FollowAnalyticsService) {}

  ngOnInit() {
    this.form = this.fb.group({
      pin: ['', [Validators.required]],
      confirmPin: ['', [Validators.required]],
    });
    this.omInfos = history.state.omUserInfos;
    this.birthYear = history.state.birthYear;

    this.followAnalyticsService.registerEventFollow(
      'Change_Pin_OM_page',
      'event'
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  changePinOM() {
    this.hasError = false;
    this.errorMsg = null;

    if(this.isInputsValid()){
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
      }
      this.omServ.changePin(data).pipe(tap(() => {
        this.loading = false;
        this.showModal({purchaseType: OPERATION_CHANGE_PIN_OM , textMsg: SUCCESS_CHANGE_PIN_MSG });
        this.followAnalyticsService.registerEventFollow(
          'Change_Pin_OM_success',
          'event',
          { msisdn: this.omInfos.msisdn }
        );
      }),catchError((err: any) => {
        this.loading = false;
        this.hasError = true;
        this.errorMsg = this.DEFAULT_ERROR_CHANGE_PIN_REQUEST;
        this.followAnalyticsService.registerEventFollow(
          'Change_Pin_OM_failed',
          'error',
          { msisdn: this.omInfos.msisdn, error: err && err.error && err.error.message ? err.error.message : err.status }
        );
        return of(err)
      })).subscribe();
    }else{
      this.hasError = true;
      this.errorMsg = this.DEFAULT_ERROR_VALIDATION_FORMS;
    }
  }

  async openBasicPinpad(inputType: 'PIN' | 'CONFIRM_PIN'){
    const modal = await this.mdCtrl.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        'operationType' : OPERATION_CHANGE_PIN_OM,
        'omInfos': {...this.omInfos, birthYear: this.birthYear}
      }
    });
    modal.onDidDismiss().then((resp) => {
      if(resp && resp.data) {
        if(inputType === 'PIN'){
          const pin = resp.data.pin;
          this.form.value.pin = pin;
        } else if(inputType === 'CONFIRM_PIN'){
          const pin = resp.data.pin;
          this.form.value.confirmPin = pin;
        }
      }
    });
    return await modal.present();
  }

  isInputsValid(): boolean{
    let isValid = true;
    if(this.form.value.pin !== this.form.value.confirmPin || this.form.value.pin === this.form.value.confirmPin && this.form.value.pin === this.omInfos.pin) {
      isValid = false;
    }
    return isValid;
  }

  async showModal(data: {purchaseType: string, textMsg: string}){
    const modal = await this.mdCtrl.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'failed-modal',
      componentProps: data,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }
}
